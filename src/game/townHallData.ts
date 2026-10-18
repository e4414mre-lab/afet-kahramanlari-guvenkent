import type { InteractionId } from "./story";
export type Hotspot = {
  id: InteractionId;
  name: string;
  x: number;
  y: number;
  radius: number;
  // Artwork hit box is independent of the foot-level approach position.
  hit: { x: number; y: number; width: number; height: number };
};
export type Obstacle = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
export const HALL_WORLD = { width: 1536, height: 1024 };
export const HALL_WALK = { left: 280, right: 1280, top: 570, bottom: 865 };
export const HALL_HOTSPOTS: readonly Hotspot[] = [
  {
    id: "mayor",
    name: "Belediye Başkanı",
    x: 1000,
    y: 620,
    radius: 86,
    hit: { x: 1000, y: 430, width: 100, height: 160 },
  },
  {
    id: "certificate",
    name: "Görev beratı",
    x: 720,
    y: 620,
    radius: 90,
    hit: { x: 720, y: 455, width: 300, height: 200 },
  },
  {
    id: "plan",
    name: "Kent planı",
    x: 400,
    y: 650,
    radius: 85,
    hit: { x: 400, y: 476, width: 205, height: 187 },
  },
  {
    id: "journal",
    name: "Görev defteri",
    x: 1160,
    y: 760,
    radius: 82,
    hit: { x: 1180, y: 650, width: 142, height: 130 },
  },
  {
    id: "exit",
    name: "Meydana çıkış",
    x: 760,
    y: 855,
    radius: 80,
    hit: { x: 760, y: 910, width: 190, height: 80 },
  },
];
export const HALL_OBSTACLES: readonly Obstacle[] = [
  // Cutaway front wall: only the central doorway leads to the steps.
  { left: 279, right: 620, top: 785, bottom: 866 },
  { left: 915, right: 1281, top: 785, bottom: 866 },
  { left: 945, right: 1055, top: 440, bottom: 610 },
  { left: 550, right: 890, top: 440, bottom: 555 },
  { left: 1110, right: 1250, top: 625, bottom: 715 },
];
export const HALL_ASSETS = [
  ["hall-room", "/assets/town-hall/room-concept.png"],
  ["hall-desk", "/assets/town-hall/desk-concept.png"],
  ["hall-mayor", "/assets/town-hall/mayor-concept.png"],
  ["hall-plan", "/assets/town-hall/plan-concept.png"],
  ["hall-journal", "/assets/town-hall/journal-concept.png"],
] as const;
export function closest(
  point: { x: number; y: number },
  hotspots: readonly Hotspot[],
): Hotspot | undefined {
  return hotspots
    .filter((h) => Math.hypot(point.x - h.x, point.y - h.y) < h.radius)
    .sort(
      (a, b) =>
        Math.hypot(point.x - a.x, point.y - a.y) -
        Math.hypot(point.x - b.x, point.y - b.y),
    )[0];
}
export function blocked(x: number, y: number, obstacles: readonly Obstacle[]) {
  return obstacles.some(
    (o) => x > o.left && x < o.right && y > o.top && y < o.bottom,
  );
}
