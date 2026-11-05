import { DistancePreset, PerformanceType, RacePrediction, TrainingZone, VDOTResult } from '@/types';

export const DISTANCE_PRESETS: DistancePreset[] = [
  { id: '1500m', nameFa: '۱۵۰۰ متر', nameEn: '1,500 m', meters: 1500, category: 'track' },
  { id: '1mile', nameFa: '۱ مایل (۱۶۰۹ متر)', nameEn: '1 Mile (1,609 m)', meters: 1609.344, category: 'track' },
  { id: '3km', nameFa: '۳ کیلومتر', nameEn: '3 km', meters: 3000, category: 'track' },
  { id: '5km', nameFa: '۵ کیلومتر', nameEn: '5 km', meters: 5000, category: 'road' },
  { id: '10km', nameFa: '۱۰ کیلومتر', nameEn: '10 km', meters: 10000, category: 'road' },
  { id: 'half_marathon', nameFa: 'نیمه‌ماراتن (۲۱.۱ ک.م)', nameEn: 'Half Marathon (21.1 km)', meters: 21097.5, category: 'road' },
  { id: 'marathon', nameFa: 'ماراتن (۴۲.۲ ک.م)', nameEn: 'Marathon (42.2 km)', meters: 42195, category: 'road' },
];

/**
 * Step 1: Calculate velocity in metres per minute.
 */
export function calculateVelocity(distanceMeters: number, timeMinutes: number): number {
  if (timeMinutes <= 0) throw new Error('Time must be greater than zero.');
  return distanceMeters / timeMinutes;
}

/**
 * Step 2: Daniels-Gilbert Oxygen Cost VO2 (ml/kg/min)
 * VO2 = -4.60 + 0.182258 * v + 0.000104 * v^2
 */
export function calculateVO2Cost(velocityMetersPerMin: number): number {
  return -4.60 + 0.182258 * velocityMetersPerMin + 0.000104 * Math.pow(velocityMetersPerMin, 2);
}

/**
 * Step 3: Sustainable fraction of VO2Max over race duration t (minutes)
 * f = 0.8 + 0.1894393 * exp(-0.012778 * t) + 0.2989558 * exp(-0.1932605 * t)
 */
export function calculateSustainableFraction(timeMinutes: number): number {
  if (timeMinutes <= 0) return 1.0;
  return (
    0.8 +
    0.1894393 * Math.exp(-0.012778 * timeMinutes) +
    0.2989558 * Math.exp(-0.1932605 * timeMinutes)
  );
}

/**
 * Step 4: Calculate VDOT = VO2 / f
 */
export function calculateVDOT(distanceMeters: number, timeMinutes: number): number {
  const v = calculateVelocity(distanceMeters, timeMinutes);
  const vo2 = calculateVO2Cost(v);
  const f = calculateSustainableFraction(timeMinutes);
  return vo2 / f;
}

/**
 * Invert Daniels-Gilbert quadratic equation to find velocity (m/min) from oxygen cost VO2.
 * 0.000104 * v^2 + 0.182258 * v - (4.60 + VO2) = 0
 */
export function velocityFromVO2(vo2: number): number {
  const a = 0.000104;
  const b = 0.182258;
  const c = -(4.60 + vo2);
  const discriminant = Math.pow(b, 2) - 4 * a * c;
  if (discriminant < 0) {
    throw new Error('Invalid VO2 value: cannot compute velocity.');
  }
  return (-b + Math.sqrt(discriminant)) / (2 * a);
}

/**
 * Convert velocity in metres/min to pace in seconds per kilometre.
 */
export function velocityToPaceSecPerKm(velocityMetersPerMin: number): number {
  if (velocityMetersPerMin <= 0) return 0;
  return 60000 / velocityMetersPerMin;
}

/**
 * Convert seconds per kilometre to seconds per mile.
 */
export function paceKmToPaceMile(paceSecPerKm: number): number {
  return paceSecPerKm * 1.609344;
}

/**
 * Convert velocity (m/min) to km/h.
 */
export function velocityToKmh(velocityMetersPerMin: number): number {
  return (velocityMetersPerMin * 60) / 1000;
}

/**
 * Predict race time in minutes using numerical bisection root-finding.
 * Solves: calculateVDOT(distanceMeters, t) - targetVDOT = 0
 */
export function predictRaceTimeMinutes(distanceMeters: number, targetVDOT: number): number {
  if (targetVDOT <= 10 || targetVDOT >= 90) {
    throw new Error('VDOT value out of supported physiological range (15 - 85).');
  }

  let low = 0.5; // 30 seconds
  let high = 1440; // 24 hours

  for (let i = 0; i < 64; i++) {
    const mid = (low + high) / 2;
    const vdotMid = calculateVDOT(distanceMeters, mid);

    // As time increases, performance VDOT decreases
    if (vdotMid > targetVDOT) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * Calculate full training zones for a given VDOT.
 * Percentages of VDOT:
 * E (Easy): 59% - 74%
 * M (Marathon): 75% - 84%
 * T (Threshold): 83% - 88%
 * I (Interval): 95% - 100%
 * R (Repetition): 105% - 120%
 */
export function calculateTrainingZones(vdot: number): TrainingZone[] {
  const getZonePaces = (pctMin: number, pctMax: number) => {
    // Note: Higher % VDOT = higher VO2 = higher velocity = faster pace (lower sec/km).
    // So minimum pace (fastest) corresponds to pctMax, maximum pace (slowest) corresponds to pctMin.
    const vo2Min = (pctMin / 100) * vdot;
    const vo2Max = (pctMax / 100) * vdot;

    const vSlow = velocityFromVO2(vo2Min);
    const vFast = velocityFromVO2(vo2Max);

    const paceFast = velocityToPaceSecPerKm(vFast);
    const paceSlow = velocityToPaceSecPerKm(vSlow);

    return {
      paceSecPerKmMin: paceFast,
      paceSecPerKmMax: paceSlow,
      paceSecPerMileMin: paceKmToPaceMile(paceFast),
      paceSecPerMileMax: paceKmToPaceMile(paceSlow),
      speedKmhMin: velocityToKmh(vSlow),
      speedKmhMax: velocityToKmh(vFast),
    };
  };

  const eData = getZonePaces(59, 74);
  const mData = getZonePaces(75, 84);
  const tData = getZonePaces(83, 88);
  const iData = getZonePaces(95, 100);
  const rData = getZonePaces(105, 120);

  return [
    {
      code: 'E',
      nameFa: 'دویدن آسان (Easy Run)',
      nameEn: 'Easy Run (Zone E)',
      taglineFa: 'پایه استقامت هوازی و ریکاوری با حداقل استرس بدنی',
      taglineEn: 'Aerobic foundation and recovery with minimal musculoskeletal stress',
      color: '#38BDF8', // Cyan / Sky blue
      bgColor: 'rgba(56, 189, 248, 0.1)',
      borderColor: 'rgba(56, 189, 248, 0.3)',
      vdotPercentageMin: 59,
      vdotPercentageMax: 74,
      ...eData,
      rpeFa: '۲ تا ۴ از ۱۰ (خیلی راحت تا راحت)',
      rpeEn: '2-4 out of 10 (Very easy to easy)',
      conversationTestFa: 'آزمون مکالمه: می‌توانید جملات کامل و طولانی را بدون وقفه نفس‌گیری بیان کنید.',
      conversationTestEn: 'Talk test: You can speak complete, full sentences without gasping for breath.',
      purposeFa: 'توسعه مویرگ‌بندی عضلانی، افزایش میتوکندری‌ها، آمادگی تاندون‌ها و رباط‌ها، و بهبود ظرفیت پایه‌ای قلبی-عروقی.',
      purposeEn: 'Muscular capillarization, mitochondrial proliferation, connective tissue adaptation, and aerobic base development.',
      sampleWorkoutsFa: [
        'دویدن آسان ۳۰ تا ۶۰ دقیقه‌ای در روزهای ریکاوری',
        'دویدن طولانی هفتگی (Long Run) بین ۶۰ تا ۱۲۰ دقیقه با سرعت پایدار',
        'گرم‌کردن و سردکردن قبل و بعد از جلسات سرعتی',
      ],
      sampleWorkoutsEn: [
        '30-60 min recovery runs between hard sessions',
        'Weekly Long Run (60-120 min) at an unhurried, steady rhythm',
        'Warm-up and cool-down for quality sessions',
      ],
    },
    {
      code: 'M',
      nameFa: 'سرعت ماراتن (Marathon Pace)',
      nameEn: 'Marathon Pace (Zone M)',
      taglineFa: 'استقامت اختصاصی مسابقه و بهینه‌سازی مصرف سوخت چربی',
      taglineEn: 'Race-specific endurance and glycogen sparing optimization',
      color: '#34D399', // Emerald
      bgColor: 'rgba(52, 211, 153, 0.1)',
      borderColor: 'rgba(52, 211, 153, 0.3)',
      vdotPercentageMin: 75,
      vdotPercentageMax: 84,
      ...mData,
      rpeFa: '۵ تا ۶ از ۱۰ (متوسط تا کنترل‌شده)',
      rpeEn: '5-6 out of 10 (Moderate to controlled)',
      conversationTestFa: 'آزمون مکالمه: می‌توانید جملات کوتاه بگویید ولی برای مکالمه طولانی انرژی لازم نیست تلف شود.',
      conversationTestEn: 'Talk test: Sentences are possible, but sustained chatter wastes precious energy.',
      purposeFa: 'تطبیق عضلانی با ریتم مسابقه ۴۲ کیلومتر، یادگیری ریتم‌خوانی دقیق، و آموزش بدن به حفظ ذخایر گلیکوژن.',
      purposeEn: 'Biomechanic adaptation to 42km race tempo, pacing discipline, and fatty acid oxidation efficiency.',
      sampleWorkoutsFa: [
        'دویدن طولانی با ۲۵ تا ۴۰ دقیقه پایانی با سرعت ماراتن (M)',
        'تکرارهای ۲ × ۵ کیلومتر با سرعت M و ۲ دقیقه استراحت آسان',
        'جلسات تمپوی طولانی ۱۲ تا ۱۸ کیلومتر در دوره تخصصی ماراتن',
      ],
      sampleWorkoutsEn: [
        'Long run finishing with 25-40 minutes at target marathon pace',
        '2 x 5km at M pace with 2 minutes easy jog recovery',
        '12-18km progressive tempo during marathon peak cycle',
      ],
    },
    {
      code: 'T',
      nameFa: 'تمرین آستانه (Threshold / Tempo)',
      nameEn: 'Threshold / Tempo (Zone T)',
      taglineFa: 'تأخیر در انباشت اسید لاکتیک و افزایش سرعت پایدار نیمه‌استقامتی',
      taglineEn: 'Lactate clearance adaptation and half-marathon sustained speed',
      color: '#FBBF24', // Amber
      bgColor: 'rgba(251, 191, 36, 0.1)',
      borderColor: 'rgba(251, 191, 36, 0.3)',
      vdotPercentageMin: 83,
      vdotPercentageMax: 88,
      ...tData,
      rpeFa: '۷ از ۱۰ (سخت اما پایدار به مدت ۲۰ تا ۶۰ دقیقه)',
      rpeEn: '7 out of 10 (Comfortably hard, sustainable for 20-60 min)',
      conversationTestFa: 'آزمون مکالمه: فقط عبارات کوتاه یک یا دو کلمه‌ای («آره»، «خوبم») امکان‌پذیر است.',
      conversationTestEn: 'Talk test: Only short one or two word answers ("yes", "okay") are feasible.',
      purposeFa: 'افزایش آستانه بی‌هوازی؛ بالا بردن سرعتی که بدن بدون تجمع سریع یون هیدروژن و خستگی شدید می‌تواند بدود.',
      purposeEn: 'Lactate threshold enhancement; raising the speed at which blood lactate accumulation remains in steady state.',
      sampleWorkoutsFa: [
        'تمپو ران پیوسته ۲۰ تا ۳۰ دقیقه با سرعت دقیق Threshold',
        'اینتروال کروز (Cruise Intervals): ۵ × ۱۰۰۰ متر با ۱ دقیقه استراحت پیاده‌روی/نرم‌دوی',
        '۳ × ۲ کیلومتر با سرعت T و ۲ دقیقه استراحت آسان',
      ],
      sampleWorkoutsEn: [
        'Continuous 20-30 min tempo run at exact Threshold pace',
        'Cruise intervals: 5 x 1,000m with 60 sec easy jog recovery',
        '3 x 2,000m at T pace with 2 minutes recovery',
      ],
    },
    {
      code: 'I',
      nameFa: 'تمرین اینتروال (VO₂ Max Interval)',
      nameEn: 'Interval Training (Zone I)',
      taglineFa: 'حداکثر اکسیژن مصرفی و تحریک توان پمپاژ قلبی',
      taglineEn: 'Maximal oxygen uptake stimulation and stroke volume enhancement',
      color: '#FB923C', // Orange
      bgColor: 'rgba(251, 146, 60, 0.1)',
      borderColor: 'rgba(251, 146, 60, 0.3)',
      vdotPercentageMin: 95,
      vdotPercentageMax: 100,
      ...iData,
      rpeFa: '۸ تا ۹ از ۱۰ (بسیار سخت و سنگین)',
      rpeEn: '8-9 out of 10 (Very hard, near maximal aerobic effort)',
      conversationTestFa: 'آزمون مکالمه: صحبت کردن غیرممکن است و تمرکز کامل روی تنفس و گام‌برداری لازم است.',
      conversationTestEn: 'Talk test: Talking is nearly impossible; complete focus on breath cadence is required.',
      purposeFa: 'گسترش سقف فیزیولوژیک قلبی-تنفسی، رساندن قلب به حداکثر برون‌ده، و افزایش سرعت ۵ تا ۱۰ کیلومتر.',
      purposeEn: 'Expanding cardiac stroke volume, maximizing VO2 kinetics, and upgrading 5K/10K engine.',
      sampleWorkoutsFa: [
        '۵ × ۱۰۰۰ متر با سرعت اینتروال با ۳ دقیقه استراحت دویدن بسیار آرام',
        '۶ × ۸۰۰ متر با زمان استراحت برابر با زمان دویدن',
        '۴ × ۱۲۰۰ متر با استراحت مساوی زمان دویدن',
      ],
      sampleWorkoutsEn: [
        '5 x 1,000m at Interval pace with 3 minutes easy jog rest',
        '6 x 800m with equal work-to-rest duration',
        '4 x 1,200m with equal recovery duration',
      ],
      recommendedRepetitionsFa: 'فاصله‌های ایده‌آل: ۸۰۰ تا ۱۲۰۰ متر (زمان هر تکرار ۳ تا ۵ دقیقه)',
      recommendedRepetitionsEn: 'Ideal work distance: 800m - 1200m (work bouts of 3 - 5 minutes)',
    },
    {
      code: 'R',
      nameFa: 'تمرین تکرار سرعتی (Repetition)',
      nameEn: 'Repetition Speed (Zone R)',
      taglineFa: 'اقتصاد دویدن، هماهنگی عصبی-عضلانی و مکانیک گام‌برداری سریع',
      taglineEn: 'Running economy, neuromuscular coordination, and stride mechanics',
      color: '#F43F5E', // Rose / Red
      bgColor: 'rgba(244, 63, 94, 0.1)',
      borderColor: 'rgba(244, 63, 94, 0.3)',
      vdotPercentageMin: 105,
      vdotPercentageMax: 120,
      ...rData,
      rpeFa: '۹ تا ۱۰ از ۱۰ (سرعت انفجاری و ریتمیک)',
      rpeEn: '9-10 out of 10 (Explosive, rhythmic speed)',
      conversationTestFa: 'آزمون مکالمه: اصلاً صحبت نمی‌شود؛ فقط پس از استراحت کامل کلمات ادا می‌شوند.',
      conversationTestEn: 'Talk test: No speaking during repeats; full recovery is mandatory.',
      purposeFa: 'بهبود اقتصاد دویدن (کاهش هزینه انرژی در سرعت‌های پایین‌تر)، افزایش انعطاف و هماهنگی پاها بدون انباشت خستگی بی‌هوازی.',
      purposeEn: 'Upgrading running economy (reducing O2 cost at submaximal speeds), fast stride cadence, and neuromuscular power.',
      sampleWorkoutsFa: [
        '۸ × ۴۰۰ متر با زمان استراحت کامل (۲ تا ۳ برابر زمان دویدن)',
        '۱۰ × ۲۰۰ متر در پیست با ریکاوری پیاده‌روی تا آرامش کامل ضربان قلب',
        'ترکیب: ۴ × ۴۰۰ متر + ۴ × ۲۰۰ متر سرعتی و تمیز',
      ],
      sampleWorkoutsEn: [
        '8 x 400m with full recovery (2-3x run time)',
        '10 x 200m on track with full walking recovery',
        'Combo: 4 x 400m + 4 x 200m with crisp mechanics',
      ],
      recommendedRepetitionsFa: 'فاصله‌های ایده‌آل: ۲۰۰ تا ۶۰۰ متر با بازیابی کامل بین هر تکرار',
      recommendedRepetitionsEn: 'Ideal work distance: 200m - 600m with full recovery between sets',
    },
  ];
}

/**
 * Predict equivalent performances for key standard race distances.
 */
export function calculateRacePredictions(vdot: number): RacePrediction[] {
  const targetDistances: { id: string; nameFa: string; nameEn: string; meters: number }[] = [
    { id: '1500m', nameFa: '۱۵۰۰ متر', nameEn: '1,500 m', meters: 1500 },
    { id: '1mile', nameFa: '۱ مایل', nameEn: '1 Mile', meters: 1609.344 },
    { id: '3km', nameFa: '۳ کیلومتر', nameEn: '3 km', meters: 3000 },
    { id: '5km', nameFa: '۵ کیلومتر', nameEn: '5 km', meters: 5000 },
    { id: '10km', nameFa: '۱۰ کیلومتر', nameEn: '10 km', meters: 10000 },
    { id: 'half_marathon', nameFa: 'نیمه‌ماراتن', nameEn: 'Half Marathon', meters: 21097.5 },
    { id: 'marathon', nameFa: 'ماراتن کامل', nameEn: 'Marathon', meters: 42195 },
  ];

  return targetDistances.map((d) => {
    const timeMinutes = predictRaceTimeMinutes(d.meters, vdot);
    const predictedSeconds = timeMinutes * 60;
    const velocityMetersPerMin = d.meters / timeMinutes;
    const paceSecPerKm = velocityToPaceSecPerKm(velocityMetersPerMin);
    const paceSecPerMile = paceKmToPaceMile(paceSecPerKm);
    const speedKmh = velocityToKmh(velocityMetersPerMin);

    return {
      distanceId: d.id,
      nameFa: d.nameFa,
      nameEn: d.nameEn,
      distanceMeters: d.meters,
      predictedSeconds,
      paceSecPerKm,
      paceSecPerMile,
      speedKmh,
    };
  });
}

/**
 * Calculate full VDOT result object from distance (m), time (seconds), and performance type.
 */
export function computeVDOTResult(
  distanceMeters: number,
  timeSeconds: number,
  performanceType: PerformanceType = 'official_race',
  customNameFa?: string,
  customNameEn?: string,
  timestamp?: string
): VDOTResult {
  const timeMinutes = timeSeconds / 60;
  const vdotRaw = calculateVDOT(distanceMeters, timeMinutes);
  const velocity = distanceMeters / timeMinutes;
  const vo2Cost = calculateVO2Cost(velocity);
  const fraction = calculateSustainableFraction(timeMinutes);

  const avgPaceSecPerKm = velocityToPaceSecPerKm(velocity);
  const avgPaceSecPerMile = paceKmToPaceMile(avgPaceSecPerKm);
  const avgSpeedKmh = velocityToKmh(velocity);

  // Find distance label if preset
  const preset = DISTANCE_PRESETS.find((p) => Math.abs(p.meters - distanceMeters) < 5);
  const labelFa = customNameFa || preset?.nameFa || `${(distanceMeters / 1000).toFixed(2)} کیلومتر`;
  const labelEn = customNameEn || preset?.nameEn || `${(distanceMeters / 1000).toFixed(2)} km`;

  const zones = calculateTrainingZones(vdotRaw);
  const predictions = calculateRacePredictions(vdotRaw);

  return {
    vdot: Number(vdotRaw.toFixed(1)),
    inputDistanceMeters: distanceMeters,
    inputDistanceLabelFa: labelFa,
    inputDistanceLabelEn: labelEn,
    inputTimeSeconds: timeSeconds,
    avgPaceSecPerKm,
    avgPaceSecPerMile,
    avgSpeedKmh,
    performanceType,
    calculatedAt: timestamp || '2026-01-01T00:00:00.000Z',
    zones,
    predictions,
    vo2Cost,
    fractionOfVO2Max: fraction,
  };
}

/**
 * Directly compute from an existing known VDOT value.
 */
export function computeFromKnownVDOT(vdot: number): VDOTResult {
  if (vdot < 15 || vdot > 85) {
    throw new Error('VDOT must be between 15 and 85.');
  }

  // Use equivalent 5km as baseline input reference
  const timeMin5k = predictRaceTimeMinutes(5000, vdot);
  const timeSec5k = timeMin5k * 60;

  return computeVDOTResult(5000, timeSec5k, 'official_race', 'مقدار مستقیم VDOT', 'Direct VDOT Input');
}

/**
 * Calculate split time for a given repetition distance and target pace (sec/km).
 */
export function calculateSplitTime(distanceMeters: number, paceSecPerKm: number): number {
  return (paceSecPerKm / 1000) * distanceMeters;
}
