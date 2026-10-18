export type QuestState = "meet" | "school" | "complete";
export type Point = { x: number; y: number };
export const WORLD = { width: 1536, height: 1024 };
// Routes stay on the open foreground plaza; painted buildings are not walkable.
export const WALK = { left: 260, right: 1240, top: 580, bottom: 865 };
export const LOCATIONS = [
  { id: "townHall", name: "Belediye", x: 400, y: 580, radius: 95 },
  { id: "school", name: "Okul", x: 1120, y: 580, radius: 95 },
] as const;
export type LocationId = (typeof LOCATIONS)[number]["id"];
export type Location = (typeof LOCATIONS)[number];
export type CityStatus = {
  quest: QuestState;
  nearby: string | null;
  dialogue: string;
};
export function nearest(point: Point): Location | undefined {
  return LOCATIONS.find(
    (p) => Math.hypot(p.x - point.x, p.y - point.y) < p.radius,
  );
}
export function interact(
  quest: QuestState,
  id: LocationId,
): { quest: QuestState; dialogue: string } {
  if (id === "townHall")
    return quest === "meet"
      ? { quest: "school", dialogue: "AFİ: Okulumuzun çevresini tanıyalım." }
      : { quest, dialogue: "AFİ: Okul meydanın sağında. Birlikte yürüyelim!" };
  return quest === "meet"
    ? { quest, dialogue: "AFİ: Önce belediyeye uğrayıp görevimizi alalım." }
    : {
        quest: "complete",
        dialogue:
          "AFİ: Okulu bulduk! Sıradaki durak sınıf risk avı; bu prototipte henüz açık değil.",
      };
}
