import {
  RAIN_SCENARIO,
  simulationFrame,
  type PreparednessId,
} from "./flood.ts";
import {
  FOREST_WEATHER,
  forestFrame,
  type ForestMeasureId,
} from "./forestFire.ts";
import {
  LANDSLIDE_SCENARIO,
  landslideFrame,
  type LandslideMeasureId,
} from "./landslide.ts";
import {
  AVALANCHE_SCENARIO,
  avalancheFrame,
  type AvalancheMeasureId,
} from "./avalanche.ts";
export const STARTING_BUDGET = 1000;
export type RegionId = "flood" | "wildfire" | "landslide" | "avalanche";
export const DAY3_SAFETY =
  "Planlama puanları temsili eğitim kaynaklarıdır; gerçek para, afet riski veya başarı puanı değildir. Uygulamaları yetkili yetişkinler yapar; hazırlık güvenlik garantisi vermez, risk sürer.";
export const REGIONS = [
  {
    id: "flood",
    name: "Dere Mahallesi",
    expert: "Hasan Amca",
    note: "Mahallede yaşayan biri olarak uyarıların herkese ulaşmasını önemsiyorum. Bu deneyim bir bilimsel taşkın tahmini değildir.",
    scenario: RAIN_SCENARIO,
  },
  {
    id: "wildfire",
    name: "Çamlık Ormanı",
    expert: "Orman Görevlisi Elif",
    note: "Erken bildirim, ziyaretçi eğitimi ve uzman bakımı birlikte önemlidir. Çocuklar yangına müdahale etmez.",
    scenario: FOREST_WEATHER,
  },
  {
    id: "landslide",
    name: "Yamaç Mahallesi",
    expert: "Jeoloji Mühendisi Murat",
    note: "Zemin incelemesi ve yol güvenliğini birlikte düşün. Drenaj ve şev kararları yetkili uzmanlara aittir.",
    scenario: LANDSLIDE_SCENARIO,
  },
  {
    id: "avalanche",
    name: "Karlıtepe",
    expert: "Çığ Uzmanı Zeynep",
    note: "Güncel resmî çığ uyarıları ve güvenli alternatif rota önemlidir. Kapalı yamaca girilmez; hazırlık tehlikeyi sıfırlamaz.",
    scenario: AVALANCHE_SCENARIO,
  },
] as const;
export const REASONS = [
  "Önce uyarı ve güvenli ulaşımı güçlendirmek istiyorum.",
  "Uzman değerlendirmesi ve bakıma öncelik veriyorum.",
  "Farklı bölgelerin ihtiyaçları arasında denge kuruyorum.",
] as const;
export const MEASURES = [
  {
    id: "F1",
    region: "flood",
    label: "Erken taşkın uyarısı",
    cost: 130,
    benefit: "Halka daha erken uyarı ve güvenli güzergâh bilgisi.",
    axis: "warning",
    model: "warning",
  },
  {
    id: "F2",
    region: "flood",
    label: "Yetkili bakım planı",
    cost: 150,
    benefit: "Gider ve dere çevresi için yetkili bakım değerlendirmesi.",
    axis: "care",
    model: "maintenance",
  },
  {
    id: "F3",
    region: "flood",
    label: "Köprü ve yol kapatma planı",
    cost: 110,
    benefit: "Riskli geçiş kapatması ve güvenli yönlendirme duyurulur.",
    axis: "access",
    model: "planning",
  },
  {
    id: "W1",
    region: "wildfire",
    label: "Erken yangın bildirimi",
    cost: 130,
    benefit: "Ziyaretçi uyarıları ve yetkililere erken haber verme.",
    axis: "warning",
    model: "watch",
  },
  {
    id: "W2",
    region: "wildfire",
    label: "Uzman bakım planı",
    cost: 150,
    benefit: "Yanıcı yük ve uygun bakım uzman ekiplerce değerlendirilir.",
    axis: "care",
    model: "maintenance",
  },
  {
    id: "W3",
    region: "wildfire",
    label: "Güvenli çıkış ve koordinasyon",
    cost: 110,
    benefit: "Ziyaretçi çıkışı ve acil koordinasyon önceden planlanır.",
    axis: "access",
    model: "routes",
  },
  {
    id: "L1",
    region: "landslide",
    label: "Zemin ve arazi değerlendirmesi",
    cost: 150,
    benefit: "Jeoloji uzmanı zemin ve arazi kullanımını değerlendirir.",
    axis: "care",
    model: "survey",
  },
  {
    id: "L2",
    region: "landslide",
    label: "Drenaj ve şev değerlendirmesi",
    cost: 160,
    benefit: "Drenaj ve şev bakımı yetkili uzmanlarca planlanır.",
    axis: "care",
    model: "engineering",
  },
  {
    id: "L3",
    region: "landslide",
    label: "Yol kapatma ve mahalle uyarıları",
    cost: 100,
    benefit: "Kapalı yol ve güvenli uzaklaşma bilgisi erken duyurulur.",
    axis: "access",
    model: "warning",
  },
  {
    id: "A1",
    region: "avalanche",
    label: "Çığ gözlem ve güncel uyarılar",
    cost: 140,
    benefit: "Resmî tehlike duyuruları ve uzman değerlendirmesi izlenir.",
    axis: "warning",
    model: "monitoring",
  },
  {
    id: "A2",
    region: "avalanche",
    label: "Alternatif güzergâh planı",
    cost: 110,
    benefit: "Kapalı rota ve güvenli alternatif yol duyurulur.",
    axis: "access",
    model: "closure",
  },
  {
    id: "A3",
    region: "avalanche",
    label: "Kış güvenliği bilgilendirmesi",
    cost: 80,
    benefit: "Ziyaretçiler kış koşulları ve güvenli davranışı öğrenir.",
    axis: "information",
    model: "education",
  },
] as const;
export type MeasureId = (typeof MEASURES)[number]["id"];
export type Measure = {
  id: string;
  region: RegionId;
  label: string;
  cost: number;
  benefit: string;
  axis: string;
  model: string;
};
function selected(
  ids: readonly string[],
  catalog: readonly Measure[] = MEASURES,
) {
  if (!Array.isArray(ids)) throw new Error("Seçimler liste olmalı.");
  for (const m of catalog)
    if (!Number.isSafeInteger(m.cost) || m.cost < 0)
      throw new Error("Geçersiz önlem maliyeti.");
  if (new Set(catalog.map((m) => m.id)).size !== catalog.length)
    throw new Error("Tekrarlı katalog kimliği.");
  return [...new Set(ids)].map((id) => {
    const m = catalog.find((m) => m.id === id);
    if (!m) throw new Error("Bilinmeyen önlem.");
    return m;
  });
}
export function calculateRemainingBudget(
  ids: readonly string[],
  catalog: readonly Measure[] = MEASURES,
) {
  const spent = selected(ids, catalog).reduce((a, m) => a + m.cost, 0);
  if (!Number.isSafeInteger(spent) || spent > STARTING_BUDGET)
    throw new Error("Plan 1.000 puanı aşamaz.");
  return STARTING_BUDGET - spent;
}
export function toggleMeasure(ids: readonly string[], id: string) {
  calculateRemainingBudget(ids);
  selected([id]);
  const next = ids.includes(id)
    ? [...new Set(ids)].filter((x) => x !== id)
    : [...new Set(ids), id];
  calculateRemainingBudget(next);
  return next as MeasureId[];
}
export function buildRegionalOutcomes(ids: readonly string[], seconds = 45) {
  calculateRemainingBudget(ids);
  if (!Number.isFinite(seconds) || seconds < 0)
    throw new Error("Geçersiz canlandırma zamanı.");
  const chosen = selected(ids);
  return REGIONS.map((r) => {
    const own = chosen.filter((m) => m.region === r.id),
      models = own.map((m) => m.model);
    const frame = (mode: "before" | "after") => {
      const ms = mode === "after" ? models : [];
      if (r.id === "flood")
        return simulationFrame(mode, seconds, ms as PreparednessId[]);
      if (r.id === "wildfire")
        return forestFrame(mode, seconds, ms as ForestMeasureId[]);
      if (r.id === "landslide")
        return landslideFrame(mode, seconds, ms as LandslideMeasureId[]);
      return avalancheFrame(mode, seconds, ms as AvalancheMeasureId[]);
    };
    const has = (id: string) => own.some((m) => m.id === id);
    const warning = has("F1") || has("W1") || has("L3") || has("A1");
    const care = own.some((m) => m.axis === "care");
    const access = own.some((m) => m.axis === "access");
    const information = own.length > 0;
    return {
      region: r.id,
      name: r.name,
      selectedIds: own.map((m) => m.id),
      before: {
        baselineScenario: { ...r.scenario },
        modelFrame: frame("before"),
      },
      after: {
        baselineScenario: { ...r.scenario },
        modelFrame: frame("after"),
      },
      rows: [
        {
          label: "Uyarı",
          before: "Yeni üçüncü gün uyarı planı yok.",
          after: warning
            ? "Güncel uyarıya erişim / erken haber verme planlandı."
            : "Yeni uyarı önlemi seçilmedi.",
        },
        {
          label: "Bakım ve inceleme",
          before: "Yeni uzman bakım planı yok.",
          after: care
            ? "Yetkili bakım veya uzman incelemesi planlandı."
            : "Yeni bakım önlemi seçilmedi.",
        },
        {
          label: "Güvenli ulaşım",
          before: "Yeni alternatif rota duyurusu yok; riskli geçişe girilmez.",
          after: access
            ? "Kapalı yol ve güvenli yönlendirme önceden duyurulur."
            : "Yeni ulaşım önlemi seçilmedi; kapalı yola girilmez.",
        },
        {
          label: "Bilgilendirme",
          before: "Yeni plan bilgisi hazırlanmadı.",
          after: has("A3")
            ? "Ziyaretçilere kış güvenliği eğitimi planlandı."
            : information
              ? "Seçilen hazırlıklar yetişkinlerce açıklanır."
              : "Bu bölgeye yeni kaynak ayrılmadı.",
        },
      ],
      residualRisk: "Risk sürer; hazırlık afet tehlikesini tamamen kaldırmaz.",
    };
  });
}
