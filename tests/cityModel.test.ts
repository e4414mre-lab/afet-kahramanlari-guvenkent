import test from "node:test";
import assert from "node:assert/strict";
import { interact, nearest, LOCATIONS } from "../src/game/cityModel.ts";
test("school cannot complete a quest before the municipality briefing", () => {
  assert.equal(interact("meet", "school").quest, "meet");
  const accepted = interact("meet", "townHall");
  assert.equal(accepted.quest, "school");
  assert.equal(accepted.dialogue, "AFİ: Okulumuzun çevresini tanıyalım.");
  assert.equal(interact(accepted.quest, "school").quest, "complete");
});
test("repeated interaction cannot erase completed progress", () => {
  assert.equal(interact("complete", "townHall").quest, "complete");
  assert.equal(interact("complete", "school").quest, "complete");
});
test("interaction is available only near a defined entrance", () => {
  for (const p of LOCATIONS) assert.equal(nearest(p)?.id, p.id);
  assert.equal(nearest({ x: 750, y: 850 }), undefined);
  assert.equal(
    nearest({ x: LOCATIONS[0].x + LOCATIONS[0].radius + 1, y: LOCATIONS[0].y }),
    undefined,
  );
});
