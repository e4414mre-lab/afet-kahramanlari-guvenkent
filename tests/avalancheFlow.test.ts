import test from "node:test";
import assert from "node:assert/strict";
import { AvalancheFlow } from "../src/game/avalancheFlow.ts";
import {
  AVALANCHE_RISKS,
  AVALANCHE_SCENARIO,
  AVALANCHE_MEASURES,
  avalancheForcing,
  avalancheFrame,
} from "../src/data/avalanche.ts";
import {
  AVALANCHE_HOTSPOTS,
  AVALANCHE_WALK,
  AVALANCHE_OBSTACLES,
} from "../src/game/avalancheLayout.ts";
import { findWalkPath } from "../src/game/navigation.ts";
import { blocked } from "../src/game/townHallData.ts";
function researched() {
  const f = new AvalancheFlow();
  f.setVoiceVolume(0.25);
  assert.equal(f.snapshot().voiceVolume, 0.25);
  f.setVoiceVolume(0.5);
  f.enter();
  f.open("zeynep");
  f.meet();
  for (const r of AVALANCHE_RISKS) {
    f.open(r.id);
    f.answer(r.choices[0].id);
    f.review();
  }
  return f;
}
test("Zeynep and all three explained findings gate preparedness; every wrong choice explains without advancing", () => {
  const f = new AvalancheFlow();
  f.enter();
  f.open("snowSlope");
  assert.equal(f.openId, "zeynep");
  f.meet();
  f.open("preparedness");
  assert.equal(f.openId, null);
  for (const r of AVALANCHE_RISKS) {
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
  assert.equal(f.phase, "selectPreparedness");
  assert.equal(f.investigated, 3);
  f.open("preparedness");
  f.start();
  assert.equal(f.phase, "selectPreparedness");
  f.toggle("monitoring");
  f.start();
  assert.equal(f.phase, "beforeSimulation");
});
test("same snowpack, weather, slope, wind, initial surface and seed at every time; risk/closure persist", () => {
  for (let t = 0; t <= 40; t += 0.5) {
    const a = avalancheFrame("before", t, []),
      b = avalancheFrame("after", t, ["monitoring", "closure", "education"]);
    for (const k of [
      "scenarioId",
      "scenarioSeed",
      "durationSeconds",
      "snowpack",
      "weather",
      "slope",
      "wind",
      "initialSurface",
      "elapsed",
    ] as const)
      assert.deepEqual(a[k], b[k]);
    assert.equal(a.roadClosed, true);
    assert.equal(b.roadClosed, true);
    assert.equal(b.residualRisk, true);
    assert.equal(b.dangerAccessible, false);
    assert.equal(b.snowActivity, a.snowActivity);
  }
  assert.equal(avalancheFrame("before", 8, []).residentsDirected, false);
  assert.equal(avalancheFrame("after", 8, ["closure"]).residentsDirected, true);
  assert.equal(avalancheFrame("before", 0, []).residentProgress, 0);
  assert.equal(avalancheFrame("after", 0, ["closure"]).residentProgress, 0);
  assert.equal(avalancheFrame("before", 8, []).residentProgress, 0);
  assert.equal(avalancheFrame("after", 8, ["closure"]).residentProgress, 1);
  const f = researched();
  f.open("preparedness");
  AVALANCHE_MEASURES.forEach((m) => f.toggle(m.id));
  f.start();
  f.tick(39);
  f.next();
  assert.equal(f.phase, "beforeSimulation");
  f.tick(1);
  assert.deepEqual(f.snapshot().forcing, avalancheForcing(40));
  f.next();
  assert.equal(f.elapsed, 0);
  assert.deepEqual(f.snapshot().scenario, AVALANCHE_SCENARIO);
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
  copy.risks.iceRoad = "unseen";
  copy.measures.pop();
  assert.equal(f.investigated, 3);
  assert.equal(f.measures.length, 3);
});
test("all observation approaches reachable on safe terrace; no paths to closed road, snowy slope or remote trail sign", () => {
  const spawn = { x: 900, y: 970 };
  for (const h of AVALANCHE_HOTSPOTS)
    assert.ok(
      findWalkPath(spawn, h, AVALANCHE_WALK, AVALANCHE_OBSTACLES),
      h.id,
    );
  for (const r of AVALANCHE_RISKS)
    assert.equal(
      findWalkPath(
        spawn,
        { x: r.x, y: r.y },
        AVALANCHE_WALK,
        AVALANCHE_OBSTACLES,
      ),
      null,
      r.id,
    );
  for (const p of [
    { x: 1500, y: 870 },
    { x: 1700, y: 1050 },
  ])
    assert.equal(
      findWalkPath(spawn, p, AVALANCHE_WALK, AVALANCHE_OBSTACLES),
      null,
    );
  assert.ok(blocked(820, 710, AVALANCHE_OBSTACLES));
  const f = new AvalancheFlow();
  const a = f.hint(),
    b = f.hint(),
    c = f.hint();
  assert.notEqual(a, b);
  assert.notEqual(b, c);
  assert.equal(f.hint(), c);
});
test("avalanche unlocks after real completed home drill independently of flood and forest", async () => {
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
  s.requestAvalanche();
  assert.equal(s.avalancheEntryRequested, false);
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
  assert.equal(s.avalancheUnlocked, true);
  assert.equal(s.forest.completionCount, 0);
  assert.equal(s.flood.completionCount, 0);
  s.requestAvalanche();
  assert.equal(s.avalancheEntryRequested, true);
  s.avalancheEntryRequested = false;
  s.scene = "Flood";
  s.requestAvalanche();
  assert.equal(s.avalancheEntryRequested, false);
});
