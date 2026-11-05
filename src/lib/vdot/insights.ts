import { VDOTResult } from '@/types';

export interface CoachingInsight {
  id: string;
  categoryFa: string;
  categoryEn: string;
  titleFa: string;
  titleEn: string;
  bodyFa: string;
  bodyEn: string;
  iconName: 'zap' | 'shield' | 'target' | 'heart' | 'trendUp';
}

export function generateTrainingInsights(result: VDOTResult): CoachingInsight[] {
  const { vdot, inputDistanceMeters, avgPaceSecPerKm, zones } = result;
  const insights: CoachingInsight[] = [];

  // Insight 1: Fundamental pacing truth
  insights.push({
    id: 'insight_current_not_future',
    categoryFa: 'اصول پایه‌ای تمرین',
    categoryEn: 'Core Training Principle',
    titleFa: 'تمرین بر اساس توان فعلی، نه آرزوی آینده',
    titleEn: 'Train on Current Fitness, Not Future Desires',
    bodyFa: `سرعت‌های تمرینی نمایش‌داده‌شده بر اساس عملکرد واقعی شما (VDOT ${vdot}) محاسبه شده‌اند، نه بر اساس رکوردی که قصد دارید در آینده به آن دست یابید. تمرین بیش از حد سریع به جای تسریع پیشرفت، دوره بازیابی فیزیولوژیک را مختل می‌کند.`,
    bodyEn: `These training paces are derived strictly from your verified performance (VDOT ${vdot}), not aspirational targets. Running your workouts faster than your current capacity compromises neuromuscular and cellular adaptation.`,
    iconName: 'target',
  });

  // Insight 2: Easy run discipline (The 80/20 rule)
  const eZone = zones.find((z) => z.code === 'E');
  insights.push({
    id: 'insight_easy_discipline',
    categoryFa: 'دویدن آسان (Zone E)',
    categoryEn: 'Easy Running Discipline',
    titleFa: 'دویدن آسان را واقعاً آسان بدوید',
    titleEn: 'Keep Your Easy Runs Truly Easy',
    bodyFa: 'برای دویدن‌های آرام و ریکاوری، لازم نیست حتی به سرعت مسابقه نزدیک شوید. ۷۵ تا ۸۰ درصد حجم هفتگی شما باید در محدوده Easy باشد تا توسعه مویرگ‌های عضلانی بدون انباشت خستگی مزمن محقق شود.',
    bodyEn: 'During recovery and easy miles, avoid drifting toward race pace. 75-80% of your weekly volume should live comfortably in Zone E to develop aerobic base without chronic fatigue.',
    iconName: 'shield',
  });

  // Insight 3: Threshold calibration
  insights.push({
    id: 'insight_threshold_effort',
    categoryFa: 'تمرین آستانه (Zone T)',
    categoryEn: 'Threshold Execution',
    titleFa: 'تنظیم دقیق سرعت آستانه لاکتات',
    titleEn: 'Precision Lactate Threshold Calibration',
    bodyFa: 'تمرینات Threshold باید احساس «سخت اما تحت کنترل» داشته باشند. اگر در پایان هر ست احساس بی‌رمقی کامل دارید، سرعتتان بیش از حد سریع بوده و در واقع وارد محدوده اینتروال شده‌اید.',
    bodyEn: 'Threshold workouts should feel comfortably hard and steady. If you are entirely exhausted at the end of a tempo interval, you exceeded your threshold and entered the VO2max zone prematurely.',
    iconName: 'zap',
  });

  // Insight 4: Specific context based on distance
  if (inputDistanceMeters <= 5000) {
    insights.push({
      id: 'insight_short_distance_focus',
      categoryFa: 'پیشنهاد برای ۵ کیلومتر',
      categoryEn: '5K Specific Focus',
      titleFa: 'تأکید بر اینتروال و سرعت پایانی',
      titleEn: 'Aerobic Power & Finish Speed',
      bodyFa: 'برای ارتقای رکورد ۵ کیلومتر، ترکیب یک جلسه اینتروال (Zone I) در هفته با تکرارهای ۸۰۰ تا ۱۰۰۰ متری در کنار استقامت پایه‌ای بیشترین اثر را خواهد داشت.',
      bodyEn: 'To elevate your 5K performance, sequence one Zone I interval workout weekly (800m-1000m repeats) anchored by steady aerobic mileage.',
      iconName: 'trendUp',
    });
  } else if (inputDistanceMeters >= 20000) {
    insights.push({
      id: 'insight_marathon_fueling',
      categoryFa: 'پیشنهاد ماراتن و نیمه‌ماراتن',
      categoryEn: 'Marathon & Half Strategy',
      titleFa: 'استقامت سوخت‌رسانی و ریتم ماراتن',
      titleEn: 'Nutritional Efficiency & Pacing Discipline',
      bodyFa: 'پیش‌بینی زمان ماراتن نیازمند دویدن‌های طولانی اختصاصی و تمرین با سرعت Zone M است. بدون سوخت‌رسانی کربوهیدراتی مناسب در طول مسیر، حتی با VDOT بالا نیز احتمال برخورد به «دیوار خستگی» در کیلومتر ۳۰ وجود دارد.',
      bodyEn: 'Equivalent marathon predictions assume specialized endurance prep and pacing mastery. Without dedicated Zone M blocks and intra-race fueling practice, glycogen depletion remains a limiting bottleneck.',
      iconName: 'trendUp',
    });
  }

  return insights;
}
