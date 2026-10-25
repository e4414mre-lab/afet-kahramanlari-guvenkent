export type AvalancheRiskId = "iceRoad" | "snowSlope" | "routeSign";
export type AvalancheMeasureId = "monitoring" | "closure" | "education";
export const AVALANCHE_SAFETY =
  "Eğitim canlandırması; gerçek çığ tahmini veya güvenlik garantisi değildir. Kapalı yola ve karlı yamaca girme; yetişkinlere bildir, resmî uyarıları izle. Hazırlık yapılsa da risk sürer.";
export const AVALANCHE_SCENARIO = Object.freeze({
  scenarioId: "karlitepe-winter-01",
  scenarioSeed: 97,
  durationSeconds: 40,
  snowpack: "high",
  slope: "steep",
  weather: "cold",
  wind: "aynı rüzgâr",
  initialSurface: "aynı kar örtüsü ve ziyaretçi başlangıç konumu",
});
export const AVALANCHE_RISKS = [
  {
    id: "iceRoad",
    name: "Kapalı karlı yamaç yolu",
    asset: "barrier",
    detail:
      "Uzak patikanın girişinde levha ve fiziksel bariyer var. Güvenli karşılama alanından gözlemliyoruz.",
    why: "Kestirme olması kapalı yolu güvenli yapmaz. Bariyeri geçme; yetkili duyurusuna uy ve uzmanların belirttiği güvenli alternatif rotayı kullan.",
    choices: [
      {
        id: "respect",
        text: "Kapalı yola girme; resmî uyarıya ve güvenli alternatif rotaya uy.",
        correct: true,
      },
      {
        id: "shortcut",
        text: "Kestirme olduğu için bariyeri geçerim.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Çığ, kar kütlesinin eğimli arazide aşağı hareket etmesidir. İlk gözlemimiz kapalı yol; güvenli platformda kalalım.",
      "AFİ: Uzak yolun girişindeki bariyeri ve levhayı gözlemle.",
      "AFİ: Kapalı yolu incele; bariyeri geçmeden yetkili duyurusuna ve alternatif rotaya uy.",
    ],
    x: 1750,
    y: 420,
    width: 175,
    approach: { x: 930, y: 760 },
  },
  {
    id: "snowSlope",
    name: "Dik ve kar yüklü yamaç",
    asset: "slope",
    detail:
      "Yamaç dik ve üzerinde kar birikmiş. Çok kar görmek tek başına kesin çığ olacağı anlamına gelmez.",
    why: "Karın görünüşünden güvenli olduğuna karar veremeyiz; uzmanlar koşulları birlikte değerlendirir. Yamaca çıkıp basarak deneme yapma; kapalı alanlardan uzak dur ve resmî uyarıları izle.",
    choices: [
      {
        id: "expert",
        text: "Uzak dur; uzman değerlendirmesine ve resmî uyarılara uy.",
        correct: true,
      },
      {
        id: "test",
        text: "Karın sağlamlığını yamaca çıkıp basarak denerim.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Karlı yamacı uzaktan gözlemlemek yeterli; üzerine çıkmıyoruz.",
      "AFİ: Eğim ile biriken karı birlikte düşün; görünüş kesin teşhis değildir.",
      "AFİ: Dik yamacı incele; denemek yerine uzman değerlendirmesini ve resmî uyarıları izle.",
    ],
    x: 1750,
    y: 780,
    width: 220,
    approach: { x: 850, y: 580 },
  },
  {
    id: "routeSign",
    name: "Eksik rota ve uyarı bilgisi",
    asset: "sign",
    detail:
      "Uzak patika girişindeki yön panosunun bir parçası eksik; rota bilgisi okunmuyor. Bilmediğimiz patikaya girmiyoruz.",
    why: "Telefon haritası güncel çığ ve kapatma duyurusunun yerine geçmez. Resmî hava ve çığ duyurularını izle; yetişkin veya uzmandan güvenli rota bilgisi al ve eksik levhayı yetkililere bildir.",
    choices: [
      {
        id: "ask",
        text: "Resmî duyuruları izle; uzmandan güvenli rota iste ve eksik levhayı bildir.",
        correct: true,
      },
      {
        id: "phone",
        text: "Telefon haritasına bakıp uyarıları yok sayarak tek başıma girerim.",
        correct: false,
      },
    ],
    hint: [
      "AFİ: Rota bilgisi eksikken yola çıkmak güvenli mi?",
      "AFİ: Patika girişindeki eksik yön levhasına güvenli alandan bak.",
      "AFİ: Bilgi panosunu incele; uyarıları yok saymadan yetişkin ve uzmandan güncel rota bilgisi al.",
    ],
    x: 1150,
    y: 1050,
    width: 160,
    approach: { x: 1050, y: 960 },
  },
] as const;
export const AVALANCHE_MEASURES = [
  {
    id: "monitoring",
    label: "Yetkili çığ izleme, saha değerlendirmesi ve güncel uyarılar",
    result:
      "Yetkili ekiplerin değerlendirmesi ve güncel duyurular izlenir; çocuk ölçüm yapmaz.",
  },
  {
    id: "closure",
    label: "Riskli geçişlerin kapatılması ve güvenli alternatif rota duyurusu",
    result:
      "Kapalı yola girilmez; ziyaretçiler güvenli alternatif güzergâha daha erken yönlendirilir.",
  },
  {
    id: "education",
    label: "Ziyaretçilere kış koşulları ve güvenli davranış bilgilendirmesi",
    result:
      "Ziyaretçi uyarıları ve güvenli davranışı önceden öğrenir; hazırlık çığ tehlikesini sıfırlamaz.",
  },
] as const;
export const AVALANCHE_INTRO = {
  zeynep:
    "Zeynep: Ben Çığ Uzmanı Zeynep. Karlı yamaçları birlikte güvenli karşılama alanından gözlemleyeceğiz.",
  afi: "AFİ: Kapalı yola girmiyoruz; uyarı levhalarını okuyup güvenli rotayı seçiyoruz.",
};
export const AVALANCHE_OBJECTIVES = {
  notStarted: "Çığ Uzmanı Zeynep ile tanış",
  meetZeynep: "Çığ Uzmanı Zeynep ile konuş",
  inspectThreeRisks: "Üç riski güvenli platformdan incele",
  selectPreparedness: "Bilgi panosunda uzman hazırlıklarını seç",
  beforeSimulation: "Önce: aynı kar ve kış koşulları",
  afterSimulation: "Sonra: aynı koşullarda hazırlıkları izle",
  compare: "Uyarı ve güvenli rota farkını karşılaştır",
  completed: "Karlıtepe kısa raporu hazır",
};
export function avalancheForcing(seconds: number) {
  return {
    ...AVALANCHE_SCENARIO,
    elapsed: Math.max(0, Math.min(40, seconds)),
    dangerAccessible: false as const,
    roadClosed: true as const,
  };
}
export function avalancheFrame(
  mode: "before" | "after",
  seconds: number,
  measures: readonly AvalancheMeasureId[],
) {
  const forcing = avalancheForcing(seconds),
    after = mode === "after",
    early = after && measures.includes("closure");
  return {
    ...forcing,
    monitoringPlanned: after && measures.includes("monitoring"),
    closurePlanned: after && measures.includes("closure"),
    educationReady: after && measures.includes("education"),
    residentsDirected: forcing.elapsed >= (early ? 4 : 28),
    residentProgress: Math.max(
      0,
      Math.min(1, (forcing.elapsed - (early ? 4 : 28)) / 3),
    ),
    snowActivity: forcing.elapsed / 40,
    residualRisk: true as const,
  };
}
