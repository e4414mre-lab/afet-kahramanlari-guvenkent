export type ForestRiskId = "forestEmbers" | "forestBrush" | "forestSign";
export type ForestMeasureId = "routes" | "maintenance" | "watch";
export const FOREST_SAFETY =
  "Eğitim canlandırması; gerçek yangın tahmini veya güvenlik garantisi değildir. Dumana yaklaşma; güvenli uzaklaşma yönlendirmelerine uy, bir yetişkine bildir.";
export const FOREST_WEATHER = Object.freeze({
  durationSeconds: 40,
  windDirection: "kuzeydoğu",
  windKmh: 18,
  temperatureC: 32,
  dryness: "kuru",
  seed: 67,
});
export const FOREST_RISKS = [
  {
    id: "forestEmbers",
    name: "Piknik alanındaki köz belirtisi",
    asset: "embers",
    detail:
      "Sınırın ötesindeki piknik noktasında sönmemiş köz belirtisi var. Güvenli seyir yolundayız.",
    why: "Rüzgâr közleri kuru örtüye taşıyabilir. Yaklaşma veya kendin söndürme; güvenli yere uzaklaşıp yetişkine ve gerekiyorsa 112’ye haber verilmesini sağla.",
    choices: [
      {
        id: "report",
        text: "Uzaklaş; yetişkine bildir, gerekirse 112’den uzman yardım iste.",
        correct: true,
      },
      { id: "extinguish", text: "Kendim gidip söndüreyim.", correct: false },
    ],
    hint: [
      "AFİ: İlk riski birlikte bulalım; uzaktaki piknik noktasına bak.",
      "AFİ: Taş çemberin içinde köz belirtisi var; sınırı geçmeden gözlemle.",
      "AFİ: Köz noktasını incele; müdahale etmeden uzaklaş ve yetişkine bildir.",
    ],
    x: 1400,
    y: 570,
    width: 150,
    approach: { x: 1050, y: 710 },
  },
  {
    id: "forestBrush",
    name: "Kuru dal ve ot birikimi",
    asset: "brush",
    detail:
      "Yol sınırının ötesinde kuru dal ve otlar birikmiş. Malzemeye dokunmadan gözlemliyoruz.",
    why: "Kuru bitkiler yanıcı yükü artırabilir. Mevzuata uygun bakım ve temizlik yetkili ekiplerin işidir; dalları yakarak temizlemek yeni bir yangın başlatabilir.",
    choices: [
      {
        id: "report",
        text: "Yetkililere bakım ve risk azaltma ihtiyacını bildir.",
        correct: true,
      },
      {
        id: "burn",
        text: "Kuru dalları yakarak temizleyelim.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Yol kenarında biriken bitkilere bak.",
      "AFİ: Sınırın ötesindeki kuru dallar ve otlar yanıcı olabilir.",
      "AFİ: Kuru bitki birikimini incele; yakmak yerine yetkili bakımını öner.",
    ],
    x: 1370,
    y: 920,
    width: 220,
    approach: { x: 1030, y: 960 },
  },
  {
    id: "forestSign",
    name: "Eksik güzergâh bilgisi",
    asset: "sign",
    detail:
      "Ziyaretçi panosunun yön levhası eksik; güvenli çıkış bilgisi herkes için anlaşılır değil.",
    why: "Belirsiz yönlendirme güvenli uzaklaşmayı zorlaştırır. Yetkililer açık uyarı, acil erişim ve ziyaretçi bilgilendirmesini planlar; ormanın içine kestirme yapılmaz.",
    choices: [
      {
        id: "plan",
        text: "Yetkililerden açık uyarı ve güvenli güzergâh planı iste.",
        correct: true,
      },
      {
        id: "shortcut",
        text: "Tehlike varsa kestirmeden ormanın içine kaçalım.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Ziyaretçi doğru çıkış yönünü nasıl bulur?",
      "AFİ: Ahşap panonun yön levhasına bak.",
      "AFİ: Eksik güzergâh bilgisini incele; yetkililerden açık işaretler iste.",
    ],
    x: 500,
    y: 640,
    width: 135,
    approach: { x: 650, y: 680 },
  },
] as const;
export const FOREST_MEASURES = [
  {
    id: "routes",
    label: "Erken uyarı ve güvenli uzaklaşma güzergâhı",
    result:
      "Ziyaretçiler daha erken bilgilendirilip güvenli güzergâha yönlendirilir.",
  },
  {
    id: "maintenance",
    label: "Yetkili ekiplerle uygun bakım ve yanıcı yük yönetimi",
    result:
      "Mevzuata uygun bakım olası etkiyi azaltabilir; yangın riski sürer.",
  },
  {
    id: "watch",
    label: "Gözetleme, erken bildirim ve ziyaretçi eğitimi",
    result:
      "Uzman ekipler daha erken haberdar olur; müdahaleyi yalnızca uzmanlar yapar.",
  },
] as const;
export const FOREST_INTRO = {
  elif: "Elif: Ben orman görevlisi Elif. Üç riski güvenli seyir yolundan, sınırı geçmeden inceleyelim.",
  afi: "AFİ: Duman belirtisine yaklaşmayız. Güvenli yere geçip yetişkinlere haber veririz.",
};
export const SMOKE_CHOICES = [
  {
    id: "safe",
    text: "Güvenli uzaklaşma yönlendirmesine uy; yetişkine, gerekirse 112’ye konumu bildir.",
    correct: true,
  },
  {
    id: "approach",
    text: "Dumanı yakından incelemeye giderim.",
    correct: false,
  },
  {
    id: "fight",
    text: "Alevleri söndürmek için ormana girerim.",
    correct: false,
  },
] as const;
export const SMOKE_EXPLANATION =
  "Duman şüpheli bir belirtidir; her duman kesin yangın demek değildir. Yaklaşmadan güvenli uzaklaşma yönlendirmelerine uy; bir yetişkine, gerekiyorsa 112’ye güvenli konumunu ve gördüğün belirtiyi bildir.";
export const FOREST_OBJECTIVES = {
  notStarted: "Orman Görevlisi Elif ile tanış",
  meetElif: "Orman Görevlisi Elif ile konuş",
  inspectRisks: "Üç riski güvenli seyir yolundan incele",
  smokeDecision: "Uzaktaki duman belirtisi için güvenli karar ver",
  chooseMeasures: "Bilgi panosunda uzman hazırlıklarını seç",
  beforeSimulation: "Önce: aynı hava koşullarında gözlemle",
  afterSimulation: "Sonra: aynı havada hazırlıkları karşılaştır",
  compare: "Uyarı ve yönlendirme farkını karşılaştır",
  completed: "Çamlık Ormanı kısa raporu hazır",
};
export function forestForcing(seconds: number) {
  return {
    ...FOREST_WEATHER,
    elapsed: Math.max(0, Math.min(40, seconds)),
    dangerAccessible: false as const,
  };
}
export function forestFrame(
  mode: "before" | "after",
  seconds: number,
  measures: readonly ForestMeasureId[],
) {
  const weather = forestForcing(seconds),
    prepared = mode === "after";
  return {
    ...weather,
    warningEarly: prepared && measures.includes("routes"),
    visitorsDirected:
      weather.elapsed >= (prepared && measures.includes("routes") ? 4 : 28),
    expertsNotified:
      weather.elapsed >= (prepared && measures.includes("watch") ? 5 : 30),
    managedFuel: prepared && measures.includes("maintenance"),
    residualRisk: true as const,
  };
}
