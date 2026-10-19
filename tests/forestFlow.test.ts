import test from "node:test";
import assert from "node:assert/strict";
import { ForestFlow } from "../src/game/forestFlow.ts";
import {
  FOREST_RISKS,
  FOREST_MEASURES,
  FOREST_WEATHER,
  forestForcing,
  forestFrame,
  SMOKE_EXPLANATION,
} from "../src/data/forestFire.ts";
import {
  FOREST_HOTSPOTS,
  FOREST_WALK,
  FOREST_OBSTACLES,
} from "../src/game/forestLayout.ts";
import { findWalkPath } from "../src/game/navigation.ts";
import { blocked } from "../src/game/townHallData.ts";
function researched() {
  const f = new ForestFlow();
  f.enter();
  f.open("elif");
  f.meet();
  for (const r of FOREST_RISKS) {
    f.open(r.id);
    f.answer(r.choices[0].id);
    f.review();
  }
  return f;
}
test("Elif, all three explained findings and a safe smoke decision gate measures; no duplicate findings", () => {
  const f = new ForestFlow();
  f.enter();
  f.open("forestEmbers");
  assert.equal(f.openId, "elif");
  f.meet();
  f.open("preparedness");
  assert.equal(f.openId, null);
  for (const r of FOREST_RISKS) {
    f.open(r.id);
    f.answer(r.choices[1].id);
    assert.equal(f.retry, true);
    assert.equal(f.risks[r.id], "identified");
    assert.ok(f.feedback.includes(r.why));
    f.review();
    assert.notEqual(f.risks[r.id], "reviewed");
    f.answer(r.choices[0].id);
    assert.equal(f.retry, false);
    f.review();
    f.review();
  }
  assert.equal(f.phase, "smokeDecision");
  assert.equal(f.investigated, 3);
  for (const c of ["approach", "fight"]) {
    f.answerSmoke(c);
    assert.equal(f.retry, true);
    assert.equal(f.smokeSolved, false);
    assert.ok(f.feedback.includes(SMOKE_EXPLANATION));
    f.finishSmoke();
    assert.equal(f.phase, "smokeDecision");
  }
  f.answerSmoke("safe");
  f.finishSmoke();
  assert.equal(f.phase, "chooseMeasures");
  f.open("preparedness");
  f.start();
  assert.equal(f.phase, "chooseMeasures");
  f.toggle("routes");
  f.start();
  assert.equal(f.phase, "beforeSimulation");
});
test("same wind, temperature, dryness, seed and duration regardless of preparation; risk persists", () => {
  for (let t = 0; t <= 40; t += 0.5) {
    const a = forestFrame("before", t, []),
      b = forestFrame("after", t, ["routes", "watch", "maintenance"]);
    for (const k of [
      "windDirection",
      "windKmh",
      "temperatureC",
      "dryness",
      "seed",
      "elapsed",
      "durationSeconds",
    ] as const)
      assert.equal(a[k], b[k]);
    assert.equal(b.residualRisk, true);
    assert.equal(b.dangerAccessible, false);
  }
  const before = forestFrame("before", 8, []),
    after = forestFrame("after", 8, ["routes", "watch"]);
  assert.equal(before.visitorsDirected, false);
  assert.equal(after.visitorsDirected, true);
  assert.equal(before.expertsNotified, false);
  assert.equal(after.expertsNotified, true);
  const f = researched();
  f.answerSmoke("safe");
  f.finishSmoke();
  f.open("preparedness");
  FOREST_MEASURES.forEach((m) => f.toggle(m.id));
  f.start();
  f.tick(39);
  f.next();
  assert.equal(f.phase, "beforeSimulation");
  f.tick(1);
  assert.deepEqual(f.snapshot().forcing, forestForcing(40));
  f.next();
  assert.equal(f.elapsed, 0);
  assert.deepEqual(f.snapshot().scenario, FOREST_WEATHER);
  f.summary();
  f.next();
  f.next();
  assert.equal(f.completionCount, 1);
  f.replay();
  f.start();
  f.summary();
  f.next();
  f.summary();
  f.next();
  f.next();
  f.next();
  assert.equal(f.completionCount, 1);
  assert.deepEqual(
    JSON.parse(JSON.stringify(f.exportPreparation())),
    f.exportPreparation(),
  );
  const copy = f.snapshot();
  copy.measures.pop();
  copy.risks.forestBrush = "unseen";
  assert.equal(f.investigated, 3);
  assert.equal(f.measures.length, 3);
});
test("all observation approaches reachable, no route into ridge or embers, NPC and board footprints blocked", () => {
  const spawn = { x: 900, y: 970 };
  for (const h of FOREST_HOTSPOTS)
    assert.ok(findWalkPath(spawn, h, FOREST_WALK, FOREST_OBSTACLES), h.id);
  for (const p of [
    { x: 1560, y: 250 },
    { x: 1400, y: 570 },
    { x: 1370, y: 920 },
  ])
    assert.equal(findWalkPath(spawn, p, FOREST_WALK, FOREST_OBSTACLES), null);
  assert.ok(blocked(820, 710, FOREST_OBSTACLES));
  assert.ok(blocked(585, 500, FOREST_OBSTACLES));
  const f = new ForestFlow();
  const a = f.hint(),
    b = f.hint(),
    c = f.hint();
  assert.notEqual(a, b);
  assert.notEqual(b, c);
  assert.equal(f.hint(), c);
});
test("forest and flood unlock independently after real drill completion; requests cannot bypass the gate", async () => {
  const { GameSession } = await import("../src/game/story.ts");
  const { HOME_ITEMS } = await import("../src/game/homeFlow.ts");
  const s = new GameSession(
    {
      voice: false,
      text: false,
      music: false,
      ambience: false,
      effects: false,
      reducedMotion: true,
    },
    () => {},
  );
  s.requestForest();
  assert.equal(s.forestEntryRequested, false);
  assert.equal(s.forestUnlocked, false);
  const h = s.home;
  h.intro();
  for (const i of HOME_ITEMS) {
    h.open(i.id);
    h.answer(true);
    h.fix();
    h.close();
  }
  h.open("homeTable");
  h.start();
  h.decide("protect");
  h.tick(6);
  h.decide("evacuate");
  h.exit();
  h.gather();
  assert.equal(s.forestUnlocked, true);
  assert.equal(s.flood.completionCount, 0);
  s.requestForest();
  assert.equal(s.forestEntryRequested, true);
  s.scene = "Flood";
  s.forestEntryRequested = false;
  s.requestForest();
  assert.equal(s.forestEntryRequested, false);
});
