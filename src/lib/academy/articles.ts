import { AcademyArticle } from '@/types';

export const ACADEMY_ARTICLES: AcademyArticle[] = [
  {
    id: 'what-is-vdot',
    titleFa: 'VDOT چیست و چرا دنیای دویدن را متحول کرد؟',
    titleEn: 'What is VDOT and How Did It Transform Running?',
    category: 'fundamentals',
    readingTimeMinutes: 5,
    summaryFa: 'آشنایی با شاخص ابداعی دکتر جک دانیلز؛ معیاری علمی برای تعیین آمادگی واقعی دویدن بدون نیاز به تست‌های گران‌قیمت آزمایشگاهی.',
    summaryEn: 'An introduction to Dr. Jack Daniels’ breakthrough metric for pinpointing actual running fitness without expensive laboratory equipment.',
    keyTakeawaysFa: [
      'شاخص VDOT عملکرد واقعی در مسابقه را به یک عدد یکپارچه تبدیل می‌کند.',
      'بر خلاف VO2 Max آزمایشگاهی، VDOT اقتصاد دویدن و مقاومت روانی را هم منعکس می‌کند.',
      'سرعت‌های تمرینی مشتق از VDOT مانع از تمرین بیش از حد سنگین (Over-training) می‌شوند.',
    ],
    keyTakeawaysEn: [
      'VDOT synthesizes race performance into a unified fitness index.',
      'Unlike lab-tested VO2 Max, VDOT encapsulates running economy and mental resilience.',
      'Paces derived from VDOT prevent the common trap of overtraining.',
    ],
    contentFa: `شاخص VDOT توسط فیزیولوژیست نامدار ورزشی، دکتر جک دانیلز (Dr. Jack Daniels) و جیمی گیلبرت در دهه ۱۹۷۰ ابداع شد. دانیلز متوجه شد که دو دونده با میزان اکسیژن مصرفی بیشینه (VO₂ Max) یکسان در آزمایشگاه، در مسابقه عملکرد یکسانی نشان نمی‌دهند. علت این تفاوت در «اقتصاد دویدن» (Running Economy) نهفته بود؛ یعنی دونده‌ای با تکنیک و بهره‌وری مکانیکی بهتر، اکسیژن کمتری برای حفظ یک سرعت معین مصرف می‌کند.

برای حل این مسئله، دانیلز واژه اختصاری VDOT را (که نشان‌دهنده نسبت حجم اکسیژن در دقیقه در عملکرد واقعی است) معرفی کرد. فرمول‌های دانیلز-گیلبرت با ترکیب مسافت و زمان مسابقه اخیر، یک عدد یکتا (معمولاً بین ۳۰ تا ۸۵) به شما اختصاص می‌دهند. این عدد به عنوان قطب‌نمای تمرینی عمل کرده و سرعت‌های ۵ گانه استاندارد (Easy، Marathon، Threshold، Interval، Repetition) را دقیقاً مشخص می‌کند.`,
    contentEn: `The VDOT metric was conceived by legendary exercise physiologist Dr. Jack Daniels and Jimmy Gilbert in the 1970s. Daniels observed that two runners possessing identical laboratory VO2 Max numbers often clocked vastly different race finishes. The crucial differentiator was Running Economy: the biomechanical and physiological efficiency that allows an economical runner to consume less oxygen at a given velocity.

To quantify this practical reality, Daniels formulated VDOT (an index combining VO2 Max kinetics and mechanical efficiency into one actionable value). By plugging in a recent maximal-effort race time, VDOT generates an individual score (typically 30 to 85) that defines your exact personal training paces across Daniels’ five physiological zones: Easy, Marathon, Threshold, Interval, and Repetition.`,
  },
  {
    id: 'vdot-vs-vo2max',
    titleFa: 'تفاوت بنیادین VDOT با VO₂ Max آزمایشگاهی',
    titleEn: 'The Fundamental Difference: VDOT vs. Laboratory VO₂ Max',
    category: 'fundamentals',
    readingTimeMinutes: 4,
    summaryFa: 'چرا داشتن VO2 Max آزمایشگاهی بالا به تنهایی ضامن قهرمانی نیست و چرا VDOT برای دونده کاربردی‌تر است؟',
    summaryEn: 'Why high lab VO2 Max alone doesn’t guarantee race victory, and why VDOT is more practically useful.',
    keyTakeawaysFa: [
      'VO2 Max ظرفیت ریوی و قلبی را اندازه می‌گیرد، اما تکنیک گام‌برداری را نمی‌سنجد.',
      'VDOT معیاری از «توانایی قابل بهره‌برداری» در میدان واقعی است.',
      'تغییر کفش، افتادگی تکنیک و انگیزه روانی همگی در عدد VDOT لحاظ می‌شوند.',
    ],
    keyTakeawaysEn: [
      'Lab VO2 Max measures cardiovascular pump capacity, ignoring running efficiency.',
      'VDOT measures usable, deployed race power.',
      'Shoe technology, biomechanical fatigue, and mental pacing reflect directly in VDOT.',
    ],
    contentFa: `تست VO₂ Max در آزمایشگاه با ماسک گازسنج و تردمیل شیب‌دار انجام می‌شود و سقف پمپاژ قلبی و جذب اکسیژن عضلانی را می‌سنجد. اما مسابقه دویدن در شیب آزمایشگاه انجام نمی‌شود؛ بلکه بر روی آسفالت یا پیست و با اتکا به ریتم گام‌ها، مقاومت باد و کارایی مصرف انرژی انجام می‌شود.

VDOT در واقع «VO₂ Max معادل عملکرد» (Pseudo-VO2 Max) است. دونده‌ای که با استیل نرم و اقتصاد عالی می‌دود، می‌تواند دونده‌ای با VO₂ Max آزمایشگاهی بالاتر ولی استیل سنگین و اتلاف انرژی زیاد را در مسابقه شکست دهد. بنابراین در دنیای مربی‌گری حرفه‌ای، VDOT به دلیل اتکا به نتیجه واقعی زمین مسابقه، راهنمایی به مراتب معتبرتر و کارآمدتر برای تنظیم شدت تمرینات روزمره است.`,
    contentEn: `A laboratory VO2 Max test utilizes a metabolic gas analyzer and an escalating treadmill incline to determine maximum cardiovascular oxygen consumption. However, distance running is contested on flat roads and tracks, where stride frequency, surface energy return, and fatigue resistance govern performance.

VDOT is fundamentally an 'effective VO2 Max'. A runner with modest cardiac metrics who glides with optimal biomechanics can easily outpace a runner with an astronomical lab VO2 Max who exhibits sloppy mechanics. For coaching and periodization, VDOT provides superior utility because it is grounded in real-world kinetic output.`,
  },
  {
    id: 'understanding-pace',
    titleFa: 'پیس (Pace) چیست و چگونه باید آن را مدیریت کرد؟',
    titleEn: 'Understanding Pace and Rhythm Control',
    category: 'fundamentals',
    readingTimeMinutes: 4,
    summaryFa: 'مفهوم پیس به دقیقه بر کیلومتر، اهمیت ثبات ریتم و چگونگی جلوگیری از اشتباه رایج شروع‌های سریع.',
    summaryEn: 'Pace as minutes per kilometre, rhythm consistency, and conquering the classic positive-split trap.',
    keyTakeawaysFa: [
      'پیس زمان لازم برای پیمودن ۱ کیلومتر است (بر خلاف سرعت که مسافت بر ساعت است).',
      'ثبات در پیس (Even Pacing) یا نیمه دوم سریع‌تر (Negative Split) ضامن بهترین رکوردهاست.',
      'شروع چند ثانیه سریع‌تر در کیلومتر اول می‌تواند در کیلومتر آخر دقیقه ها به زمان شما بیفزاید.',
    ],
    keyTakeawaysEn: [
      'Pace represents elapsed time per kilometre (inverse of velocity).',
      'Even pacing or modest negative splits yield optimal physiological efficiency.',
      'Going 10 seconds too fast in km 1 can cost 2 minutes of agonizing fade in the final kilometre.',
    ],
    contentFa: `در ادبیات دویدن در سراسر جهان، سرعت با «پیس» (Pace) بیان می‌شود؛ یعنی شما هر کیلومتر را در چند دقیقه و ثانیه طی می‌کنید (مثلاً ۵:۳۰ به معنای پنج دقیقه و سی ثانیه برای هر هزار متر). پیس زبانی شهودی برای دوندگان است، زیرا با تقسیم زمان کل بر مسافت به آسانی قابل درک و اندازه‌گیری است.

یکی از بزرگ‌ترین خطاهای دوندگان مبتدی و متوسط، شروع با پیس بسیار سریع به دلیل شور و هیجان خط استارت است. در علم ورزش، شروع سریع‌تر از توان آستانه موجب ورود پیش از موعد اسید لاکتیک و تخلیه زودهنگام فسفوکراتین می‌شود. استفاده از پیس‌های دقیق ماشین‌حساب ریتم به شما یاد می‌دهد که چگونه سرعت هر کیلومتر را کنترل و به عنوان یک دونده منظم پیشرفت کنید.`,
    contentEn: `In global running culture, speed is communicated via 'Pace'—the time taken to cover one kilometre (or mile). For instance, 5:00 min/km signifies five minutes elapsed per 1,000 meters. This metric offers intuitive mental math during competition compared to kilometers-per-hour.

The single most common pacing flaw is starting excessively fast due to adrenaline. Physiologically, an aggressive first kilometre pushes blood lactate above threshold, burning finite anaerobic glycogen stores prematurely. Adhering to calculated pace zones cultivates disciplined pace regulation and consistent splits.`,
  },
  {
    id: 'easy-run-mastery',
    titleFa: 'دویدن آسان (Easy Run): راز پیشرفت پنهان قهرمانان',
    titleEn: 'Easy Run Mastery: The Hidden Superpower of Champions',
    category: 'zones',
    readingTimeMinutes: 6,
    summaryFa: 'چرا دویدن با سرعت آرام بزرگ‌ترین بخش تمرین دوندگان المپیک است و چطور جلوی سریع دویدن را در روزهای آسان بگیریم؟',
    summaryEn: 'Why easy mileage forms 80% of elite marathon training and how to master psychological restraint on recovery days.',
    keyTakeawaysFa: [
      'دویدن آسان شبکه مویرگی عضلات را گسترش داده و تعداد میتوکندری‌ها را دوبرابر می‌کند.',
      'تست مکالمه ساده‌ترین و مطمئن‌ترین راه سنجش سرعت مناسب دویدن آسان است.',
      'سریع دویدن در روز آسان خستگی عمیق ایجاد کرده و تمرینات سرعتی باکیفیت را تخریب می‌کند.',
    ],
    keyTakeawaysEn: [
      'Easy runs build intramuscular capillarization and mitochondrial density.',
      'The talk test remains the gold standard for conversational aerobic effort.',
      'Running too fast on easy days generates systemic fatigue that ruins quality interval sessions.',
    ],
    contentFa: `برای بسیاری از دوندگان تازه‌کار غیرمنتظره است که بفهمند الیود کیپچوگه و نخبگان دو ماراتن، حدود ۸۰ درصد از تمرینات هفتگی خود را با سرعتی بسیار آرام‌تر از سرعت مسابقه انجام می‌دهند. این شدت، زون Easy (محدوده ۵۹ تا ۷۴ درصد VDOT) است.

هنگامی که آرام می‌دوید، جریان خون بدون تنش اسیدی در تارهای عضلانی کندانقباض (تایپ ۱) به گردش درمی‌آید. این امر باعث ترغیب رشد مویرگ‌های جدید در اطراف فیبرهای عضلانی و افزایش آنزیم‌های اکسیدکننده چربی می‌شود. اگر در روزهای آسان تند بدوید، هم تطبیق‌های پایه را از دست می‌دهید و هم پاهایتان برای جلسات اینتروال و تمپو خسته خواهند بود. قانون طلایی: اگر نمی‌توانید حین دویدن یک خاطره تعریف کنید، دارید بیش از حد سریع می‌دوید!`,
    contentEn: `Many recreational runners are astonished to learn that elite marathoners log approximately 80% of their total mileage at an effortless, conversational pace. This is Zone E (59% to 74% of VDOT).

Low-intensity aerobic running triggers angiogenesis (capillary bed branching) and stimulates mitochondrial biogenesis in Type I slow-twitch muscle fibers without excessive metabolic byproducts. If you run your easy days too fast, you simultaneously forfeit pure aerobic adaptations and arrive fatigued at your scheduled quality interval workouts.`,
  },
  {
    id: 'threshold-training',
    titleFa: 'تمرین آستانه (Threshold): چگونه سد خستگی را جابجا کنیم؟',
    titleEn: 'Threshold Training: Shifting the Fatigue Barrier',
    category: 'zones',
    readingTimeMinutes: 5,
    summaryFa: 'آشنایی با آستانه لاکتات، تمپو ران‌ها، اینتروال‌های کروز و چگونگی ارتقای سرعت پایدار در ۱۰K و نیمه‌ماراتن.',
    summaryEn: 'Lactate threshold mechanics, tempo runs, cruise intervals, and expanding sustainable speed for 10K and half marathons.',
    keyTakeawaysFa: [
      'سرعت آستانه سرعتی است که بدن می‌توانید حدود ۵۰ تا ۶۰ دقیقه در مسابقه حفظ کند.',
      'تمپو ران‌های پیوسته ۲۰ تا ۲۵ دقیقه‌ای تمرین کلاسیک و استاندارد این بخش هستند.',
      'اینتروال کروز (مثلاً ۵ × ۱ کیلومتر با ۱ دقیقه استراحت) همان فایده را با استرس عضلانی کمتر ایجاد می‌کند.',
    ],
    keyTakeawaysEn: [
      'Threshold velocity corresponds roughly to an hour-long maximal racing tempo.',
      'Classic 20-30 minute continuous tempo runs represent the gold standard stimulus.',
      'Cruise intervals (e.g. 5 x 1km with 60s jog) offer identical lactate clearance benefits with lower fatigue.',
    ],
    contentFa: `تمرین در زون T (Threshold یا آستانه) شاید مهم‌ترین بخش تمرین برای دوندگان ۱۰ کیلومتر و نیمه‌ماراتن باشد. در بدن شما همواره مقداری اسید لاکتیک تولید می‌شود و کبد و عضلات آن را پاکسازی می‌کنند. با افزایش سرعت، به نقطه‌ای می‌رسید که نرخ تولید لاکتات با نرخ پاکسازی برابر است. این مرز دقیقاً سرعت Threshold (حدود ۸۳ تا ۸۸ درصد VDOT) است.

اگر فقط کمی سریع‌تر از سرعت آستانه بدوید، لاکتات با شتاب تجمع یافته و مجبور به کاهش سرعت می‌شوید. اما با انجام منظم تمرینات آستانه (به عنوان مثال ۲۰ دقیقه تمپو پیوسته یا تکرارهای ۱۰۰۰ متری با ۱ دقیقه استراحت)، بدن یاد می‌گیرد در سرعت‌های بالاتر لاکتات را به عنوان سوخت مصرف کند و سد خستگی شما عقب‌تر می‌رود.`,
    contentEn: `Zone T (Threshold / Tempo) is considered the single most productive zone for 10K and half-marathon runners. Lactate is continuously produced and cleared by the liver, heart, and active muscle fibers. As running speed increases, you reach a tipping point where production matches maximal clearance rate. This equilibrium velocity is the Lactate Threshold (approx. 83-88% of VDOT).

Running slightly above this tipping point causes rapid hydrogen ion accumulation and subsequent deceleration. Regular threshold workouts (20-minute continuous tempos or cruise intervals) train the enzymatic machinery to buffer and recycle lactate into glycogen, expanding your sustainable race speed.`,
  },
  {
    id: 'interval-training',
    titleFa: 'اینتروال (Interval): ارتقای حجم موتور تنفسی',
    titleEn: 'Interval Training: Expanding Your Aerobic Engine',
    category: 'zones',
    readingTimeMinutes: 5,
    summaryFa: 'چگونه اینتروال‌های ۳ تا ۵ دقیقه‌ای حجم ضربه‌ای قلب و ظرفیت تنفسی را به اوج می‌رسانند.',
    summaryEn: 'How 3 to 5 minute interval bouts elevate cardiac stroke volume and maximize VO2 consumption.',
    keyTakeawaysFa: [
      'تمرینات اینتروال در زون I (۹۵ تا ۱۰۰ درصد VDOT) انجام می‌شوند.',
      'مدت هر تکرار باید بین ۳ تا ۵ دقیقه باشد تا قلب به اوج ظرفیت پمپاژ برسد.',
      'استراحت نباید آن‌قدر طولانی باشد که ضربان قلب به طور کامل افت کند.',
    ],
    keyTakeawaysEn: [
      'Interval workouts operate in Zone I (95-100% of VDOT).',
      'Work bouts should span 3 to 5 minutes so the cardiovascular system reaches maximum stroke volume.',
      'Rest intervals should be active and short enough to keep the aerobic engine engaged.',
    ],
    contentFa: `تمرینات اینتروال (Zone I) برای به چالش کشیدن سقف مطلق اکسیژن مصرفی (VO₂ Max) طراحی شده‌اند. هدف این تمرینات، کار در سرعتی است که قلب و ریه‌ها بیشترین حجم خون را پمپاژ کنند. از آن‌جا که انسان نمی‌تواند بیشتر از ۸ تا ۱۲ دقیقه با سرعت ۱۰۰ درصد VO₂ Max بدود، این تمرین را به تکرارهای کوتاه ۳ تا ۵ دقیقه‌ای (مانند تکرارهای ۸۰۰، ۱۰۰۰ یا ۱۲۰۰ متر) همراه با استراحت نرم‌دوی بین آن‌ها تقسیم می‌کنیم.

نکته کلیدی: سرعت اینتروال مسابقه سرعت نیست! دویدن سریع‌تر از زون I در ست‌های اول باعث می‌شود ست‌های بعدی را نتوانید در زمان مقرر به پایان برسانید. انضباط در حفظ سرعت دقیق پیشنهادی ماشین‌حساب ریتم، بهترین نتیجه فیزیولوژیک را تضمین می‌کند.`,
    contentEn: `Zone I intervals are engineered to challenge and expand maximal aerobic capacity. Since human physiology cannot sustain 100% VO2 Max continuously for more than roughly 8 to 11 minutes, we segment the stress into 3-to-5 minute intervals (such as 800m, 1,000m, or 1,200m repeats) with equal or near-equal jogging rests.

Discipline is essential: Interval running is not an all-out sprint. Sprinting the first two repeats triggers excessive muscular acidosis, ruining the subsequent intervals. Maintaining steady target pace produces maximal time accumulated at 95-100% VO2 Max.`,
  },
  {
    id: 'repetition-training',
    titleFa: 'تمرین تکرار سرعتی (Repetition): هنر سبک دویدن',
    titleEn: 'Repetition Speed Training: The Art of Lightness',
    category: 'zones',
    readingTimeMinutes: 5,
    summaryFa: 'سرعت‌های کوتاه، اقتصاد دویدن، زمان تماس کمتر پا با زمین و ضرورت استراحت کامل.',
    summaryEn: 'Short fast repeats, neuromuscular cadence, ground contact time reduction, and the necessity of full recovery.',
    keyTakeawaysFa: [
      'زون R فراتر از اکسیژن مصرفی (۱۰۵ تا ۱۲۰ درصد VDOT) است و روی سیستم عصبی تمرکز دارد.',
      'تکرارها کوتاه هستند (۲۰۰ تا ۴۰۰ متر) با استراحت کامل تا ریکاوری کامل قلب.',
      'هدف، احساس روانی، سبکی گام و سرعت بدون استرس فیزیولوژیک بی‌هوازی است.',
    ],
    keyTakeawaysEn: [
      'Zone R exceeds aerobic VO2 capacity (105-120% VDOT) to train neuromuscular mechanics.',
      'Work bouts are short (200m-400m) backed by generous recovery periods.',
      'The objective is relaxed mechanics, spring-like leg stiffness, and low ground contact time.',
    ],
    contentFa: `زون R (Repetition) سرعت‌هایی سریع‌تر از زون اینتروال هستند، اما بر خلاف باور رایج، هدف آن‌ها ایجاد اسید لاکتیک یا تست طاقت نیست! هدف این جلسات، بهبود «اقتصاد دویدن» و هماهنگی عصب و عضله است. وقتی بدن شما می‌آموزد در سرعت بالا با گام‌های سبک، فرود نرم و عضلات شل بدود، در سرعت‌های پایین‌تر مسابقه انرژی کمتری هدر خواهد داد.

جلسات R معمولاً شامل تکرارهای ۲۰۰ تا ۴۰۰ متری در پیست است. در این تمرین، زمان استراحت باید ۲ تا ۴ برابر زمان دویدن باشد (مثلاً پس از ۴۰۰ متر در ۸۰ ثانیه، ۳ دقیقه راه رفتن و نرم‌دوی) تا هر تکرار با سرحالی کامل و فرم ایده‌آل دویده شود.`,
    contentEn: `Zone R repetitions are faster than Interval work, but contrary to common assumptions, they are not designed to induce lactic acidosis. Their purpose is neuromuscular coordination and movement economy. By teaching the nervous system to cycle strides with short ground contact times and relaxed upper-body posture, submaximal race speeds become dramatically more energy-efficient.

Workouts consist of 200m to 400m strides with long, generous rests (2 to 4 times the duration of the work interval). If you are breathing heavily at the start of the next repeat, you did not rest long enough.`,
  },
  {
    id: 'how-to-increase-vdot',
    titleFa: 'چگونه VDOT خود را به صورت اصولی افزایش دهیم؟',
    titleEn: 'How to Systematically Increase Your VDOT',
    category: 'coaching',
    readingTimeMinutes: 6,
    summaryFa: 'نقشه راه واقع‌بینانه برای ارتقای پایدار سطح آمادگی؛ افزایش تدریجی مسافت، ترکیب تمرینات و پرهیز از تله‌های رایج.',
    summaryEn: 'A sustainable roadmap to elevating your VDOT: progressive overload, polarized training distribution, and patience.',
    keyTakeawaysFa: [
      'قانون ۱۰ درصد: مسافت هفتگی را به آرامی و با احتیاط افزایش دهید.',
      'قانون ۸۰/۲۰: هشتاد درصد آسان، بیست درصد باکیفیت و سریع بدوید.',
      'حداقل ۴ تا ۶ هفته در یک VDOT بمانید قبل از آنکه تست جدیدی ثبت کنید.',
    ],
    keyTakeawaysEn: [
      'The 10% volume progression rule shields tendons and joints from overload.',
      'The 80/20 polarization model ensures sustainable consistency.',
      'Spend at least 4 to 6 weeks at your current VDOT before updating paces.',
    ],
    contentFa: `بسیاری از دوندگان با دیدن پیشرفت اولیه دچار وسوسه می‌شوند و هر دو هفته یک‌بار سرعت‌های تمرینی خود را سریع‌تر می‌کنند. این سریع‌ترین راه برای ورود به منطقه آسیب‌دیدگی تاندون‌ها و سندروم بیش‌تمرینی است!

برای افزایش واقعی VDOT به سه اصل طلایی پایبند بمانید:
۱. تثبیت ۴ تا ۶ هفته‌ای: دانیلز توصیه می‌کند حتی اگر احساس آمادگی بالاتر دارید، ۴ تا ۶ هفته سرعت‌های همان VDOT فعلی را اجرا کنید تا تطبیق‌های فیزیولوژیک در بافت‌های نرم ریشه بدوانند.
۲. اصل استمرار هفتگی: ۳ روز دویدن منظم در هفته بسیار مؤثرتر از یک هفته پرفشار و سپس دو هفته استراحت اجباری به خاطر درد ساق پا است.
۳. آزمون در مسابقه واقعی: پس از اتمام یک دوره تمرینی، یک مسابقه ۵ یا ۱۰ کیلومتر بدهید و عدد VDOT جدید را در ریتم وارد کنید.`,
    contentEn: `Many runners succumb to impatience, bumping their training paces upward every fortnight. This is the fastest route to patellar tendinitis, tibial stress reactions, and systemic burnout.

Three guiding tenets govern sustainable VDOT progression:
1. The 4-to-6 week consolidation rule: Spend a full macro-cycle consolidating your current VDOT before increasing paces.
2. Consistency over heroics: Three disciplined weekly runs outshine a chaotic week followed by two weeks of shin-splint rest.
3. Validate via competition: Update your VDOT after an official race or structured time trial, never on arbitrary guesswork.`,
  },
  {
    id: 'how-to-run-5k-time-trial',
    titleFa: 'راهنمای گام‌به‌گام انجام آزمون زمان‌گیری ۵ کیلومتر',
    titleEn: 'Step-by-Step Guide: Executing a 5K Time Trial',
    category: 'testing',
    readingTimeMinutes: 5,
    summaryFa: 'چگونه به عنوان یک دونده بدون نیاز به مسابقه رسمی، یک آزمون ۵K استاندارد، ایمن و معتبر برای سنجش VDOT خود برگزار کنیم؟',
    summaryEn: 'How to conduct a safe, accurate, and reproducible 5K solo benchmark test to establish your baseline VDOT.',
    keyTakeawaysFa: [
      'مسیر مسطح و بدون ترافیک (پیست تارتان ایده‌آل‌ترین است) انتخاب کنید.',
      'گرم‌کردن کامل ۱۵ دقیقه‌ای شامل نرم‌دوی و ۴ استراید سرعتی الزامی است.',
      'کیلومترهای ۱ و ۲ را با آرامش شروع کرده و انرژی خود را برای کیلومترهای ۴ و ۵ ذخیره کنید.',
    ],
    keyTakeawaysEn: [
      'Select a flat, uninterrupted course—a 400m running track is ideal.',
      'Perform a 15-minute warm-up consisting of easy jogging and dynamic strides.',
      'Control your enthusiasm through km 1 and 2 to preserve reserves for km 4 and 5.',
    ],
    contentFa: `اگر به مسابقه رسمی ۵ کیلومتر دسترسی ندارید، می‌توانید خودتان یک تایم‌تریال (Time Trial) استاندارد برگزار کنید:

۱. انتخاب مکان: پیست دوومیدانی استاندارد ۴۰۰ متری بهترین گزینه است (۱۲.۵ دور پیست در خط یک). اگر در پارک می‌دوید، مسیری مسطح با کمترین چرخش و بدون چراغ قرمز انتخاب کنید.
۲. شرایط آب و هوا: روزی با دمای معتدل (۱۰ تا ۱۸ درجه سانتی‌گراد) و باد ملایم انتخاب کنید. گرمای تابستان VDOT شما را کاذب نشان می‌دهد.
۳. پروتکل گرم‌کردن: ۱۰ تا ۱۵ دقیقه دویدن بسیار آرام + ۵ دقیقه کشش پویا + ۳ تا ۴ بار دویدن سریع ۶۰ متری (Strides).
۴. استراتژی مسابقه: کیلومتر اول را با سرعتی شروع کنید که حس می‌کنید کمی محافظه‌کارانه است. در کیلومترهای ۲ تا ۴ ریتم پایدار را حفظ کنید و در ۱۰۰۰ متر پایانی با تمام توان باقی‌مانده بدوید.
۵. سردکردن و ثبت در ریتم: زمان دقیق را ثبت کرده و بلافاصله در ریتم ذخیره کنید.`,
    contentEn: `If an official local race is unavailable, an individual time trial serves as an excellent benchmark:

1. Venue: A standard 400m synthetic track (12.5 laps on lane 1) guarantees exact distance measurement without GPS drift.
2. Climate: Cool weather (10-18°C) with negligible wind is optimal; hot summer humidity artificially deflates performance.
3. Warm-up routine: 12 minutes of easy jogging, active dynamic drills, and 3-4 acceleration strides.
4. Pacing strategy: Run the first kilometre conservatively. Lock into rhythmic breathing during km 2 through 4, unleashing your remaining reserve over the final kilometre.
5. Record & Save: Log the exact finish time in RITM under the 'Time Trial' performance classification.`,
  },
  {
    id: 'using-vdot-for-5k-and-10k',
    titleFa: 'کاربرد عملی VDOT در برنامه تمرینی ۵K و ۱۰K',
    titleEn: 'Applying VDOT to 5K & 10K Training Cycles',
    category: 'coaching',
    readingTimeMinutes: 6,
    summaryFa: 'نمونه ساختار هفتگی واقعی با تفکیک جلسات Easy، Threshold و Interval متناسب با VDOT شما.',
    summaryEn: 'A practical weekly training blueprint decomposing Easy, Threshold, and Interval workouts around your VDOT.',
    keyTakeawaysFa: [
      'ترکیب طلایی هفتگی: ۱ جلسه تمپو (T) + ۱ جلسه اینتروال (I) + ۱ دویدن طولانی (E) + دویدن‌های آسان ریکاوری.',
      'سرعت‌های تمرینی را هرگز با حدس و گمان افزایش ندهید.',
      'هفته سبک ریکاوری (Deload) هر ۴ هفته یک‌بار ضرورت دارد.',
    ],
    keyTakeawaysEn: [
      'The proven structure: 1 Tempo/Threshold day + 1 Interval day + 1 Long Run + Easy recovery days.',
      'Never inflate training paces based on guesswork.',
      'A planned recovery deload every 4 weeks consolidates physiological gains.',
    ],
    contentFa: `دانستن عدد VDOT زمانی ارزشمند است که آن را در جدول هفتگی خود پیاده کنید. برای یک دونده هدفمند ۵ یا ۱۰ کیلومتر با ۴ روز تمرین در هفته، ساختار پیشنهادی بدین صورت است:

• یکشنبه: دویدن آسان (Zone E) به مدت ۴۵ دقیقه + ۴ استراید سرعتی در پایان
• سه‌شنبه: جلسه آستانه (Zone T) — ۱۵ دقیقه گرم کردن + ۲۰ دقیقه تمپو پیوسته با سرعت دقیق T + ۱۰ دقیقه سرد کردن
• پنجشنبه: جلسه اینتروال (Zone I) — ۱۵ دقیقه گرم کردن + ۵ تکرار ۱۰۰۰ متری با سرعت I با ۳ دقیقه استراحت نرم‌دوی بین هر ست + ۱۰ دقیقه سرد کردن
• جمعه: دویدن طولانی آسان (Long Run - Zone E) به مدت ۷۰ تا ۸۰ دقیقه با سرعت آرام
• شنبه، دوشنبه و چهارشنبه: استراحت کامل یا تمرینات مکمل (یوگا، بدنسازی سبک)

این نظم تمرینی به شما کمک می‌کند بدون خستگی مفرط، هر دو موتور هوازی و بی‌هوازی خود را به اوج برسانید.`,
    contentEn: `A calculated VDOT is only transformative when structured into a coherent microcycle. For a 4-day-per-week 5K/10K athlete, here is a proven weekly architecture:

• Sunday: Easy Run (Zone E) 45 min + 4 x 20-second dynamic strides.
• Tuesday: Threshold Day (Zone T) — 15 min warm-up + 20 min continuous tempo at exact T pace + 10 min cool-down.
• Thursday: Interval Day (Zone I) — 15 min warm-up + 5 x 1,000m at I pace with 3 min easy jog recovery + 10 min cool-down.
• Friday: Aerobic Long Run (Zone E) — 75 min continuous conversational rhythm.
• Rest Days: Active mobility, core strength, or complete recovery.

This balanced distribution elevates VO2 Max, Lactate Threshold, and Running Economy simultaneously.`,
  },
];
