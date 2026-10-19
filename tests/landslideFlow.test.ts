import test from "node:test";
import assert from "node:assert/strict";
import { LandslideFlow } from "../src/game/landslideFlow.ts";
import {
  LANDSLIDE_RISKS,
  LANDSLIDE_SCENARIO,
  LANDSLIDE_MEASURES,
  landslideForcing,
  landslideFrame,
} from "../src/data/landslide.ts";
import {
  LANDSLIDE_HOTSPOTS,
  LANDSLIDE_WALK,
  LANDSLIDE_OBSTACLES,
} from "../src/game/landslideLayout.ts";
import { findWalkPath } from "../src/game/navigation.ts";
import { blocked } from "../src/game/townHallData.ts";
function researched() {
  const f = new LandslideFlow();
  f.setVoiceVolume(0.25);
  assert.equal(f.snapshot().voiceVolume, 0.25);
  f.setVoiceVolume(0.5);
  f.enter();
  f.open("murat");
  f.meet();
  for (const r of LANDSLIDE_RISKS) {
    f.open(r.id);
    f.answer(r.choices[0].id);
    f.review();
  }
  return f;
}
test("Murat and all three explained findings gate preparedness; every wrong choice explains without advancing", () => {
  const f = new LandslideFlow();
  f.enter();
  f.open("slopeHouse");
  assert.equal(f.openId, "murat");
  f.meet();
  f.open("preparedness");
  assert.equal(f.openId, null);
  for (const r of LANDSLIDE_RISKS) {
    f.open(r.id);
    assert.equal(f.risks[r.id], "identified");
    for (const c of r.choices.filter((c) => !c.correct)) {
      f.answer(c.id);
      assert.equal(f.retry, true);
      assert.equal(f.risks[r.id], "identified");
      assert.ok(f.feedback.includes(r.why));
      f.review();
      assert.notEqual(f.risks[r.id], "explained");
    }
    f.answer(r.choices[0].id);
    assert.equal(f.risks[r.id], "decided");
    assert.equal(f.retry, false);
    f.review();
    f.review();
  }
  assert.equal(f.phase, "choosePreparedness");
  assert.equal(f.investigated, 3);
  f.open("preparedness");
  f.start();
  assert.equal(f.phase, "choosePreparedness");
  f.toggle("survey");
  f.start();
  assert.equal(f.phase, "beforeSimulation");
});
test("same rainfall, soil sensitivity, slope, initial moisture/vegetation and seed at every time; risk/closure persist", () => {
  for (let t = 0; t <= 40; t += 0.5) {
    const a = landslideFrame("before", t, []),
      b = landslideFrame("after", t, ["survey", "engineering", "warning"]);
    for (const k of [
      "scenarioId",
      "seed",
      "durationSeconds",
      "rainfall",
      "soilSensitivity",
      "slope",
      "initialMoisture",
      "initialGround",
      "elapsed",
    ] as const)
      assert.deepEqual(a[k], b[k]);
    assert.equal(a.roadClosed, true);
    assert.equal(b.roadClosed, true);
    assert.equal(b.residualRisk, true);
    assert.equal(b.dangerAccessible, false);
    assert.ok(b.localRunoff <= a.localRunoff);
  }
  assert.equal(landslideFrame("before", 8, []).residentsDirected, false);
  assert.equal(landslideFrame("after", 8, ["warning"]).residentsDirected, true);
  assert.equal(landslideFrame("before", 0, []).residentProgress, 0);
  assert.equal(landslideFrame("after", 0, ["warning"]).residentProgress, 0);
  assert.equal(landslideFrame("before", 8, []).residentProgress, 0);
  assert.equal(landslideFrame("after", 8, ["warning"]).residentProgress, 1);
  const f = researched();
  f.open("preparedness");
  LANDSLIDE_MEASURES.forEach((m) => f.toggle(m.id));
  f.start();
  f.tick(39);
  f.next();
  assert.equal(f.phase, "beforeSimulation");
  f.tick(1);
  assert.deepEqual(f.snapshot().forcing, landslideForcing(40));
  f.next();
  assert.equal(f.elapsed, 0);
  assert.deepEqual(f.snapshot().scenario, LANDSLIDE_SCENARIO);
  f.summary();
  f.next();
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
  assert.equal(f.completionCount, 1);
  assert.deepEqual(
    JSON.parse(JSON.stringify(f.exportPreparation())),
    f.exportPreparation(),
  );
  const copy = f.snapshot();
  copy.risks.slopeCrack = "unseen";
  copy.measures.pop();
  assert.equal(f.investigated, 3);
  assert.equal(f.measures.length, 3);
});
test("all observation approaches reachable on safe terrace; no paths to crack, house, steep slope or slope foot", () => {
  const spawn = { x: 900, y: 970 };
  for (const h of LANDSLIDE_HOTSPOTS)
    assert.ok(
      findWalkPath(spawn, h, LANDSLIDE_WALK, LANDSLIDE_OBSTACLES),
      h.id,
    );
  for (const r of LANDSLIDE_RISKS)
    assert.equal(
      findWalkPath(
        spawn,
        { x: r.x, y: r.y },
        LANDSLIDE_WALK,
        LANDSLIDE_OBSTACLES,
      ),
      null,
      r.id,
    );
  for (const p of [
    { x: 1500, y: 870 },
    { x: 1700, y: 1050 },
  ])
    assert.equal(
      findWalkPath(spawn, p, LANDSLIDE_WALK, LANDSLIDE_OBSTACLES),
      null,
    );
  assert.ok(blocked(820, 710, LANDSLIDE_OBSTACLES));
  const f = new LandslideFlow();
  const a = f.hint(),
    b = f.hint(),
    c = f.hint();
  assert.notEqual(a, b);
  assert.notEqual(b, c);
  assert.equal(f.hint(), c);
});
test("landslide unlocks after real completed home drill independently of flood and forest", async () => {
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
  s.requestLandslide();
  assert.equal(s.landslideEntryRequested, false);
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
  assert.equal(s.landslideUnlocked, true);
  assert.equal(s.forest.completionCount, 0);
  assert.equal(s.flood.completionCount, 0);
  s.requestLandslide();
  assert.equal(s.landslideEntryRequested, true);
  s.landslideEntryRequested = false;
  s.scene = "Flood";
  s.requestLandslide();
  assert.equal(s.landslideEntryRequested, false);
});
