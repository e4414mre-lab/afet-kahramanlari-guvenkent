import test from "node:test";
import assert from "node:assert/strict";
import { RiskHunt } from "../src/game/riskHunt.ts";
import {
  RISKS,
  SAFE_OBJECTS,
  CLASSROOM_OBJECTS,
} from "../src/game/classroomData.ts";
import { GameSession } from "../src/game/story.ts";
const settings = {
  voice: false,
  text: false,
  ambience: false,
  music: false,
  effects: false,
  reducedMotion: true,
};
function resolve(h: RiskHunt, id: (typeof RISKS)[number]["id"]) {
  const r = RISKS.find((r) => r.id === id)!;
  h.open(id);
  h.answer(r.reasons.find((c) => c.correct)!.id);
  h.answer(r.solutions.find((c) => c.correct)!.id);
  h.assign();
  h.verifyAdultFix();
}
test("six required risks and four distinct safe objects each have coherent educational data", () => {
  assert.deepEqual(
    new Set(RISKS.map((r) => r.id)),
    new Set([
      "bookshelf",
      "exit_bags",
      "heavy_boxes",
      "tall_cabinet",
      "window_heavy",
      "wall_board",
    ]),
  );
  assert.equal(SAFE_OBJECTS.length, 4);
  assert.equal(new Set(CLASSROOM_OBJECTS.map((o) => o.id)).size, 10);
  for (const r of RISKS) {
    assert.equal(r.reasons.filter((c) => c.correct).length, 1);
    assert.equal(r.solutions.filter((c) => c.correct).length, 1);
    assert.ok(r.reason.length > 20);
    assert.match(r.adultFix, /Canlandırma/);
    assert.equal(r.hints.length, 3);
    for (const c of r.solutions.filter((c) => !c.correct))
      assert.match(c.feedback, /Tekrar düşünelim/);
  }
});
test("risk progresses through all five states; assignment/fix cannot bypass a decision", () => {
  const h = new RiskHunt();
  h.open("bookshelf");
  h.assign();
  h.verifyAdultFix();
  assert.equal(h.findings.bookshelf, "notFound");
  h.answer("reason");
  assert.equal(h.findings.bookshelf, "identified");
  h.verifyAdultFix();
  assert.equal(h.findings.bookshelf, "identified");
  h.answer("adult");
  assert.equal(h.findings.bookshelf, "planned");
  h.verifyAdultFix();
  assert.equal(h.findings.bookshelf, "planned");
  h.assign();
  assert.equal(h.findings.bookshelf, "assigned");
  h.verifyAdultFix();
  assert.equal(h.findings.bookshelf, "verifiedFixed");
});
test("incorrect reasons and unsafe choices give feedback without loss of progress", () => {
  const h = new RiskHunt();
  h.open("bookshelf");
  h.answer("distractor");
  assert.equal(h.snapshot().found, 0);
  assert.match(h.inspection!.feedback, /Tekrar düşünelim/);
  h.answer("reason");
  h.answer("lift");
  assert.equal(h.findings.bookshelf, "identified");
  assert.match(h.inspection!.feedback, /taşıma/);
  h.answer("unknown");
  assert.equal(h.findings.bookshelf, "identified");
});
test("safe objects never count as risks; repeated visits cannot double count", () => {
  const h = new RiskHunt();
  for (const o of SAFE_OBJECTS) {
    h.open(o.id);
    h.explainSafe();
    h.explainSafe();
  }
  assert.equal(h.snapshot().safeCount, 4);
  assert.equal(h.snapshot().found, 0);
  assert.equal(h.snapshot().fixed, 0);
  for (const r of RISKS) {
    resolve(h, r.id);
    resolve(h, r.id);
  }
  assert.equal(h.snapshot().found, 6);
  assert.equal(h.snapshot().fixed, 6);
  assert.equal(h.snapshot().complete, true);
});
test("guidance is limited to the first two risks; later hints are voluntary", () => {
  const h = new RiskHunt();
  assert.equal(h.guidedTarget(), "bookshelf");
  const first = h.hint();
  const second = h.hint();
  const third = h.hint();
  assert.notEqual(first, second);
  assert.notEqual(second, third);
  assert.equal(h.hint(), third);
  resolve(h, "bookshelf");
  assert.equal(h.guidedTarget(), "exit_bags");
  resolve(h, "exit_bags");
  assert.equal(h.guidedTarget(), null);
  assert.match(h.hint(), /AFİ/);
});
test("closing inspection preserves progress; session emits summary once after adult solutions", () => {
  const s = new GameSession(settings, () => {});
  s.scene = "SchoolClassroom";
  s.classroomIntro();
  assert.ok(s.dialogue);
  s.skip();
  s.next();
  for (const r of RISKS) {
    resolve(s.riskHunt, r.id);
    s.closeInspection();
    s.dialogue = null;
  }
  assert.equal(s.riskHunt.summaryShown, true);
  assert.equal(s.status().hunt.complete, true);
  s.inspect("bookshelf");
  s.closeInspection();
  assert.equal(s.dialogue, null);
  s.scene = "TownHall";
  s.enter();
  assert.equal(s.status().hunt.fixed, 6);
  s.scene = "SchoolClassroom";
  s.classroomIntro();
  assert.equal(s.dialogue, null);
});
