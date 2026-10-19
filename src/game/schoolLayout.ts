import {
  CLASSROOM_OBJECTS,
  type ClassroomObjectId,
  type Placement,
} from "./classroomData.ts";
import type { HuntSnapshot } from "./riskHunt.ts";
import type { Hotspot, Obstacle } from "./townHallData.ts";
export const SCHOOL_WORLD = { width: 1920, height: 1280 };
export const SCHOOL_WALK = { left: 300, right: 1620, top: 600, bottom: 1100 };
// Four columns of four individual seats; a broad centre aisle and side aisles
// connect the board, storage and door without crossing furniture footprints.
export const DESK_WIDTH = 120;
export const DESKS = [690, 790, 890, 990].flatMap((y) =>
  [650, 820, 1180, 1350].map((x) => ({ x, y })),
);
export const SCHOOL_OBSTACLES: readonly Obstacle[] = [
  ...DESKS.map((p) => ({
    left: p.x - 60,
    right: p.x + 60,
    top: p.y - 36,
    bottom: p.y + 8,
  })),
  { left: 299, right: 800, top: 1020, bottom: 1101 },
  { left: 1120, right: 1621, top: 1020, bottom: 1101 },
  { left: 300, right: 375, top: 735, bottom: 790 },
  { left: 1530, right: 1621, top: 715, bottom: 775 },
];
// Bags narrow the left half of the doorway; adult relocation opens it again.
const BLOCKED_EXIT: readonly Obstacle[] = [
  ...SCHOOL_OBSTACLES,
  { left: 850, right: 950, top: 1055, bottom: 1095 },
];
export function schoolObstacles(hunt: HuntSnapshot): readonly Obstacle[] {
  return hunt.findings.exit_bags === "verifiedFixed"
    ? SCHOOL_OBSTACLES : BLOCKED_EXIT;
}
export function placementFor(
  id: ClassroomObjectId,
  hunt: HuntSnapshot,
): Placement {
  const object = CLASSROOM_OBJECTS.find((o) => o.id === id)!;
  const original = object.placement;
  if (object.kind === "risk" && hunt.findings[object.id] === "verifiedFixed") {
    if (id === "exit_bags")
      return {
        ...original,
        x: 420,
        y: 985,
        hitY: 945,
        approach: { x: 500, y: 1010 },
      };
    if (id === "heavy_boxes") return { ...original, x: 540, y: 555, hitY: 520, approach: { x: 540, y: 630 } };
    if (id === "window_heavy")
      return { ...original, x: 450, y: 860, approach: { x: 510, y: 930 } };
  }
  return { ...original, approach: { ...original.approach } };
}
export function schoolHotspots(hunt: HuntSnapshot): Hotspot[] {
  return [
    ...CLASSROOM_OBJECTS.map((o) => {
      const p = placementFor(o.id, hunt);
      return {
        id: o.id,
        name: o.name,
        x: p.approach.x,
        y: p.approach.y,
        radius: 78,
        hit: { x: p.x, y: p.hitY ?? p.y - 80, width: p.width, height: 150 },
      };
    }),
    {
      id: "classroomExit",
      name: "Meydana dön",
      x: 1000,
      y: 1090,
      radius: 76,
      hit: { x: 1050, y: 1070, width: 110, height: 270 },
    },
  ];
}
export const SCHOOL_ASSETS: readonly (readonly [string, string])[] = [
  ["school-room", "room"],
  ["school-desk", "desk-facing-board"],
  ["school-teacher", "teacher_desk"],
  ["school-door", "door"],
  ["school-clock", "clock"],
  ...CLASSROOM_OBJECTS.map((o) => [`school-${o.asset}`, o.asset] as const),
];
