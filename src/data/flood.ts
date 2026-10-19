export type FloodRiskId = "floodStorage" | "floodDrain" | "floodBridge";
export type PreparednessId = "maintenance" | "planning" | "warning";
export const FLOOD_SAFETY =
  "Eğitim simülasyonu; gerçek taşkın tahmini veya güvenlik garantisi değildir. Suya ve alçak köprüye girme; uyarıları izle, yetişkine bildir.";
export const RAIN_SCENARIO = Object.freeze({
  durationSeconds: 45,
  intensity: "yoğun",
  riverRise: 0.8,
  seed: 41,
});
export const FLOOD_RISKS = [
  {
    id: "floodStorage",
    name: "Alt kottaki depo",
    asset: "store",
    detail: "Dere yatağına yakın alçak depoyu güvenli meydandan gözlemliyoruz.",
    why: "Taşkın suyu alt kotta birikebilir; kullanımın uygunluğunu yetkili kurumlar değerlendirir.",
    choices: [
      {
        id: "report",
        text: "Riskli alan kullanımını yetişkin ve yetkili kurumlara bildir.",
        correct: true,
      },
      {
        id: "move",
        text: "Depoyu kendim boşaltıp eşyaları taşırım.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Kullanım yerinin yüksekliğine bak.",
      "AFİ: Derenin yanındaki alçak yapı suya yakın.",
      "AFİ: Depoyu güvenli meydandan incele; alan kullanımını yetkililere bildir.",
    ],
    x: 1400,
    y: 700,
    width: 230,
    approach: { x: 1010, y: 700 },
  },
  {
    id: "floodDrain",
    name: "Yağmur suyu gideri",
    asset: "drain",
    detail: "Gider ızgarasında yaprak ve küçük çöpler birikmiş.",
    why: "Birikinti suyun akışını zorlaştırabilir. Gideri temizlemek belediye ekiplerinin işidir; çocuk gider içine veya suya girmez.",
    choices: [
      {
        id: "report",
        text: "Belediye ekiplerine gider bakımını bildir.",
        correct: true,
      },
      {
        id: "clean",
        text: "Giderin içine elimi sokup temizlerim.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Yağmur suyu nereden akıp gidebilir?",
      "AFİ: Alt yoldaki ızgarayı yüksek meydandan izle.",
      "AFİ: Gideri meydandan incele, müdahale etmeden belediye ekiplerine bildir.",
    ],
    x: 1230,
    y: 960,
    width: 95,
    approach: { x: 940, y: 970 },
  },
  {
    id: "floodBridge",
    name: "Alçak taş köprü",
    asset: "bridge",
    detail:
      "Köprüyü güvenli üst yoldan izliyoruz. Alçak geçiş su yükseldiğinde kullanılamaz.",
    why: "Taşkın suyunun derinliği ve akıntısı yanıltıcıdır. Köprüye veya suya girmek yerine uyarıları izleyip güvenli yüksek güzergâhı kullanırız.",
    choices: [
      {
        id: "avoid",
        text: "Köprüden uzak dur; uyarıları ve güvenli güzergâhı izle.",
        correct: true,
      },
      {
        id: "cross",
        text: "Su yükselmeden köprüden hızla geçerim.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Her kısa yol güvenli midir?",
      "AFİ: Alçak köprünün suya göre yüksekliğini düşün.",
      "AFİ: Köprüyü meydandan incele; taşkında köprü ve su geçilmez.",
    ],
    x: 1550,
    y: 1030,
    width: 360,
    approach: { x: 1020, y: 830 },
  },
] as const;
export const PREPAREDNESS = [
  {
    id: "maintenance",
    label: "Yetkili ekiplerin gider ve dere çevresi bakımı",
    result:
      "Gider çevresindeki yerel birikim azalabilir; dere seviyesi yine yükselir.",
  },
  {
    id: "planning",
    label: "Riskli kullanım değerlendirmesi ve geçiş güvenliği planı",
    result:
      "Yetkili planlama ve kapatma işaretleri kullanımı yönlendirir; riskli yapı otomatik taşınmaz.",
  },
  {
    id: "warning",
    label: "Erken uyarı ve güvenli uzaklaşma güzergâhı bilgisi",
    result:
      "Mahalleli uyarıyı daha önce alıp yüksek güvenli noktada bekleyebilir.",
  },
] as const;
export const FLOOD_OBJECTIVES = {
  notStarted: "Hasan Amca ile tanış",
  meetHasan: "Hasan Amca ile konuş",
  investigate3: "Üç riski güvenli meydandan incele",
  choosePreparedness: "Hazırlık panosunda güvenli önerileri seç",
  beforeSimulation: "Önce: aynı yoğun yağışı gözlemle",
  afterSimulation: "Sonra: seçilen hazırlıklarla aynı yağışı izle",
  compare: "Önce ve sonrayı karşılaştır",
  completed: "Dere Mahallesi kısa raporu hazır",
};
/** Identical forcing for both runs; preparedness cannot reduce rainfall or river rise. */
export function floodForcing(seconds: number) {
  const elapsed = Math.max(0, Math.min(RAIN_SCENARIO.durationSeconds, seconds));
  return {
    elapsed,
    intensity: RAIN_SCENARIO.intensity,
    riverLevel:
      0.2 + RAIN_SCENARIO.riverRise * (elapsed / RAIN_SCENARIO.durationSeconds),
    bridgeClosed: true as const,
  };
}
export function simulationFrame(
  mode: "before" | "after",
  seconds: number,
  measures: readonly PreparednessId[],
) {
  const forcing = floodForcing(seconds);
  return {
    ...forcing,
    localAccumulation:
      forcing.riverLevel *
      (mode === "after" && measures.includes("maintenance") ? 0.45 : 1),
    informedEarlier: mode === "after" && measures.includes("warning"),
    passageClosed: true as const,
  };
}

export const FLOOD_INTRO = {
  hasan:
    "Hasan Amca: “Yağmur çok yağınca dere bazen kabarır. Sence hangi yerlere dikkat etmeliyiz?”",
  afi: "AFİ: Üç riski yüksek, güvenli meydandan gözlemleyelim. Dereye veya köprüye yaklaşmamıza gerek yok.",
  speech:
    "Hasan Amca: Yağmur çok yağınca dere bazen kabarır. Önce güvenli meydandan gözlemleyelim.",
};
