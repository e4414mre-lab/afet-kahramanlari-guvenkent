export type LandslideRiskId = "slopeCrack" | "slopeHouse" | "slopeDrain";
export type LandslideMeasureId = "survey" | "engineering" | "warning";
export const LANDSLIDE_SAFETY =
  "Eğitim canlandırması; gerçek heyelan tahmini veya güvenlik garantisi değildir. Her yağmur heyelan oluşturmaz. Riskli yamaçtan uzak dur, yetişkine bildir ve resmî uyarıları izle.";
export const LANDSLIDE_SCENARIO = Object.freeze({
  scenarioId: "yamac-rain-soil-01",
  seed: 83,
  durationSeconds: 40,
  rainfall: "şiddetli / uzun süreli",
  soilSensitivity: "duyarlı zemin",
  slope: "dik eğim",
  initialMoisture: "önceden nemli",
  initialGround: "aynı yüzey / aynı bitki örtüsü",
});
export const LANDSLIDE_RISKS = [
  {
    id: "slopeCrack",
    name: "Yol kenarında yüzey çatlağı",
    asset: "crack",
    detail:
      "Uzak yol kenarında ince bir çatlak ve eğilmiş çit görüyoruz. Sınırın güvenli tarafındayız.",
    why: "Yüzey değişimi uzman incelemesi gerektiren bir belirti olabilir; tek başına kesin heyelan demek değildir. Yaklaşmadan yetişkine ve ilgili yetkililere bildir, değerlendirme ve resmî uyarıları bekle.",
    choices: [
      {
        id: "report",
        text: "Uzak dur; yetişkine ve yetkililere bildir, uzman değerlendirmesini bekle.",
        correct: true,
      },
      {
        id: "measure",
        text: "Çatlağın üstüne gidip yakından ölçerim.",
        correct: false,
      },
      {
        id: "fill",
        text: "Çatlağı kendi başıma taşla doldururum.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Heyelan, toprak veya kaya kütlesinin yamaç boyunca yer değiştirmesidir. İlk gözlemimiz yol kenarında; güvenli platformda kalalım.",
      "AFİ: İnce çatlağı ve eğrilmiş çiti güvenli platformdan gözlemle.",
      "AFİ: Yol değişimini incele; yaklaşmadan yetişkine ve yetkililere bildir.",
    ],
    x: 1750,
    y: 600,
    width: 155,
    approach: { x: 1020, y: 760 },
  },
  {
    id: "slopeHouse",
    name: "Dik yamaca yakın yapı",
    asset: "house",
    detail:
      "Uzak evin yamaçla ilişkisini platformdan inceliyoruz. Görünüşüne bakarak güvenli ya da güvensiz diye kesin karar vermiyoruz.",
    why: "Yağış, eğim, bitki örtüsü ve arazi kullanımı zeminle birlikte değerlendirilir. Yerleşim için zemin etüdü ve yetkili uzman planlaması gerekir; bitki örtüsü tek başına güvenlik garantisi değildir.",
    choices: [
      {
        id: "survey",
        text: "Zemin etüdü ve uzman yerleşim değerlendirmesi iste; resmî uyarıları izle.",
        correct: true,
      },
      {
        id: "build",
        text: "Yamaç güzel görünüyor; istediğimiz yere ev yapabiliriz.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Yalnızca manzaraya bakmak yeterli mi?",
      "AFİ: Uzak evin dik yamaçla ilişkisini düşün.",
      "AFİ: Yapıyı güvenli yerden incele; kesin hüküm yerine zemin etüdü ve uzman planlaması öner.",
    ],
    x: 1370,
    y: 520,
    width: 220,
    approach: { x: 960, y: 580 },
  },
  {
    id: "slopeDrain",
    name: "Yamaçta yüzey suyu akışı",
    asset: "drain",
    detail:
      "Uzak drenaj kenarında su belli bir hatta yoğunlaşıyor. Şeve inmeden gözlemliyoruz.",
    why: "Kontrolsüz yüzey suyu zemini etkileyebilir; her yağmur heyelan oluşturmaz. Drenaj, istinat ve şev güvenliğini yetkili mühendislik ekipleri değerlendirir; çocuk kanala girmez veya kazı yapmaz.",
    choices: [
      {
        id: "engineers",
        text: "Yetkili mühendislik ekiplerine drenaj değerlendirmesini bildir.",
        correct: true,
      },
      {
        id: "dig",
        text: "Şeve inip kanalı kendim kazarak açarım.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Yüzeydeki yağmur suyu hangi hatta ilerliyor?",
      "AFİ: Sınırın ötesindeki taş drenaj kenarına bak.",
      "AFİ: Akış noktasını platformdan incele; müdahale etmeden yetkili mühendislik değerlendirmesi öner.",
    ],
    x: 1300,
    y: 980,
    width: 160,
    approach: { x: 1050, y: 960 },
  },
] as const;
export const LANDSLIDE_MEASURES = [
  {
    id: "survey",
    label: "Zemin / şev incelemesi ve uzman arazi kullanım kararı",
    result:
      "Yetkili zemin incelemesi ve alan kullanım planı var; çocuk yapının güvenliğine tek başına karar vermez.",
  },
  {
    id: "engineering",
    label: "Yetkili ekiplerle drenaj, istinat ve şev güvenliği planı",
    result:
      "Yerel mühendislik önlemleri bazı etkileri azaltabilir; zayıf yamaç kesin sağlamlaşmaz.",
  },
  {
    id: "warning",
    label: "Erken uyarı, yol kısıtlaması ve güvenli buluşma güzergâhı",
    result:
      "Mahalleli daha erken bilgilendirilip güvenli uzaklaşma güzergâhına yönlendirilir.",
  },
] as const;
export const LANDSLIDE_INTRO = {
  murat:
    "Murat: Ben belediye teknik ekibiyle çalışan jeoloji mühendisi Murat. Yamaçtaki değişimleri güvenli noktadan birlikte inceleyelim.",
  afi: "AFİ: Çatlağa yaklaşmıyoruz; gördüklerimizi yetişkinlere ve yetkililere bildiriyoruz.",
};
export const LANDSLIDE_OBJECTIVES = {
  notStarted: "Jeoloji Mühendisi Murat ile tanış",
  meetMurat: "Jeoloji Mühendisi Murat ile konuş",
  inspect3: "Üç riski güvenli platformdan incele",
  choosePreparedness: "Bilgi panosunda uzman hazırlıklarını seç",
  beforeSimulation: "Önce: aynı yağış ve zemin koşulları",
  afterSimulation: "Sonra: aynı koşullarda hazırlıkları izle",
  compare: "Uzman planı ve uyarı farkını karşılaştır",
  completed: "Yamaç Mahallesi kısa raporu hazır",
};
export function landslideForcing(seconds: number) {
  return {
    ...LANDSLIDE_SCENARIO,
    elapsed: Math.max(0, Math.min(40, seconds)),
    dangerAccessible: false as const,
    roadClosed: true as const,
  };
}
export function landslideFrame(
  mode: "before" | "after",
  seconds: number,
  measures: readonly LandslideMeasureId[],
) {
  const forcing = landslideForcing(seconds),
    after = mode === "after";
  return {
    ...forcing,
    surveyPlanned: after && measures.includes("survey"),
    engineeringPlanned: after && measures.includes("engineering"),
    warningEarly: after && measures.includes("warning"),
    residentsDirected:
      forcing.elapsed >= (after && measures.includes("warning") ? 4 : 28),
    residentProgress: Math.max(
      0,
      Math.min(
        1,
        (forcing.elapsed - (after && measures.includes("warning") ? 4 : 28)) /
          3,
      ),
    ),
    localRunoff:
      (forcing.elapsed / 40) *
      (after && measures.includes("engineering") ? 0.55 : 1),
    residualRisk: true as const,
  };
}
