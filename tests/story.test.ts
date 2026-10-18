import test from "node:test";
import assert from "node:assert/strict";
import { GameSession, OBJECTIVES, SAFETY } from "../src/game/story.ts";
const settings = {
  voice: false,
  text: false,
  ambience: false,
  music: false,
  effects: false,
  reducedMotion: true,
};
const fresh = () => new GameSession({ ...settings }, () => {});
function finish(s: GameSession) {
  while (s.dialogue) s.next();
}
test("full ordered story progresses only through explicit interaction/acceptance", () => {
  const s = fresh();
  assert.equal(s.quest, "notStarted");
  s.enter();
  assert.equal(s.quest, "speakToMayor");
  s.interact("mayor");
  assert.equal(s.quest, "speakToMayor");
  s.next();
  assert.match(s.dialogue!.pages[s.dialogue!.index], /temsili/);
  s.next();
  assert.equal(s.quest, "inspectCertificate");
  s.interact("certificate");
  assert.equal(s.quest, "inspectCertificate");
  s.next();
  assert.equal(s.quest, "reviewCityPlan");
  s.interact("plan");
  assert.equal(s.quest, "reviewCityPlan");
  s.next();
  assert.equal(s.quest, "goToSchool");
  s.interact("school");
  assert.equal(s.schoolVisited, true);
});
test("wrong order cannot advance the story", () => {
  const s = fresh();
  s.enter();
  for (const id of ["certificate", "plan", "school"] as const) {
    s.interact(id);
    finish(s);
    assert.equal(s.quest, "speakToMayor");
  }
  assert.equal(s.schoolVisited, false);
});
test("skip preserves the mandatory safety page and cannot accept a certificate", () => {
  const s = fresh();
  s.enter();
  s.interact("mayor");
  s.skip();
  assert.equal(s.dialogue!.index, 1);
  s.skip();
  assert.equal(s.quest, "speakToMayor");
  assert.ok(s.dialogue);
  s.next();
  s.interact("certificate");
  s.skip();
  assert.equal(s.quest, "inspectCertificate");
  assert.equal(s.dialogue, null);
  assert.match(SAFETY, /yetkisi vermez/);
});
test("journal reflects each objective without mutating progress; reentry retains state", () => {
  const s = fresh();
  s.enter();
  s.interact("mayor");
  finish(s);
  s.enter();
  assert.equal(s.quest, "inspectCertificate");
  s.interact("journal");
  assert.match(s.dialogue!.pages[0], new RegExp(OBJECTIVES.inspectCertificate));
  finish(s);
  assert.equal(s.quest, "inspectCertificate");
});
test("AFI gives three increasingly specific hints, then repeats the last", () => {
  const s = fresh();
  const hints: string[] = [];
  for (let i = 0; i < 4; i++) {
    s.hint();
    hints.push(s.dialogue!.pages[0]);
    finish(s);
  }
  assert.equal(new Set(hints).size, 3);
  assert.equal(hints[2], hints[3]);
});
test("repeated completed interactions cannot reset progress; no stored-state claim", () => {
  const s = fresh();
  s.enter();
  s.interact("mayor");
  finish(s);
  s.interact("certificate");
  finish(s);
  s.interact("plan");
  finish(s);
  for (const id of ["mayor", "certificate", "plan", "journal"] as const) {
    s.interact(id);
    finish(s);
    assert.equal(s.quest, "goToSchool");
  }
  s.interact("journal");
  assert.match(s.dialogue!.pages[0], /açık oyun oturumunda/);
});
