import {
  CLASSROOM_OBJECTS,
  type ClassroomObjectId,
  type Placement,
} from "./classroomData.ts";
import type { HuntSnapshot } from "./riskHunt.ts";
import type { Hotspot, Obstacle } from "./townHallData.ts";
export const SCHOOL_WORLD = { width: 1920, height: 1280 };
export const SCHOOL_WALK = { left: 300, right: 1620, top: 600, bottom: 1100 };
export const DESKS = [
  { x: 740, y: 810 },
  { x: 1100, y: 810 },
  { x: 740, y: 990 },
  { x: 1100, y: 990 },
];
export const SCHOOL_OBSTACLES: readonly Obstacle[] = [
  ...DESKS.map((p) => ({
    left: p.x - 75,
    right: p.x + 75,
    top: p.y - 45,
    bottom: p.y + 5,
  })),
  { left: 299, right: 800, top: 1020, bottom: 1101 },
  { left: 1120, right: 1621, top: 1020, bottom: 1101 },
  { left: 300, right: 375, top: 735, bottom: 790 },
  { left: 1530, right: 1621, top: 715, bottom: 775 },
];
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
        x: 550,
        y: 990,
        hitY: 945,
        approach: { x: 550, y: 925 },
      };
    if (id === "heavy_boxes") return { ...original, y: 540, hitY: 490 };
    if (id === "window_heavy")
      return { ...original, x: 430, y: 790, approach: { x: 550, y: 830 } };
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
      hit: { x: 1000, y: 1190, width: 190, height: 95 },
    },
  ];
}
export const SCHOOL_ASSETS: readonly (readonly [string, string])[] = [
  ["school-room", "room"],
  ["school-desk", "desk"],
  ["school-teacher", "teacher_desk"],
  ...CLASSROOM_OBJECTS.map((o) => [`school-${o.asset}`, o.asset] as const),
];
