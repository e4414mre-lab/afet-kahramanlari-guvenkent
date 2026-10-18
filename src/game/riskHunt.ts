import {
  RISKS,
  CLASSROOM_OBJECTS,
  classroomObject,
  type ClassroomObjectId,
  type FindingState,
  type RiskId,
} from "./classroomData.ts";
export type Inspection = {
  id: ClassroomObjectId;
  feedback: string;
  retry: boolean;
};
export type HuntSnapshot = {
  findings: Record<RiskId, FindingState>;
  found: number;
  fixed: number;
  safeCount: number;
  complete: boolean;
  guidedTarget: RiskId | null;
};
const ORDER: readonly FindingState[] = [
  "notFound",
  "identified",
  "planned",
  "assigned",
  "verifiedFixed",
];
export class RiskHunt {
  findings: Record<RiskId, FindingState> = Object.fromEntries(
    RISKS.map((r) => [r.id, "notFound"]),
  ) as Record<RiskId, FindingState>;
  safeInspected = new Set<ClassroomObjectId>();
  inspection: Inspection | null = null;
  introShown = false;
  summaryShown = false;
  private hintLevel = 0;
  guidedTarget(): RiskId | null {
    return (
      (["bookshelf", "exit_bags"] as const).find(
        (id) => this.findings[id] !== "verifiedFixed",
      ) ?? null
    );
  }
  snapshot(): HuntSnapshot {
    const states = Object.values(this.findings);
    return {
      findings: { ...this.findings },
      found: states.filter((s) => s !== "notFound").length,
      fixed: states.filter((s) => s === "verifiedFixed").length,
      safeCount: this.safeInspected.size,
      complete: states.every((s) => s === "verifiedFixed"),
      guidedTarget: this.guidedTarget(),
    };
  }
  open(id: ClassroomObjectId) {
    if (!classroomObject(id)) return;
    this.inspection = { id, feedback: "", retry: false };
  }
  close() {
    this.inspection = null;
  }
  private progress(id: RiskId, next: FindingState) {
    if (ORDER.indexOf(next) === ORDER.indexOf(this.findings[id]) + 1) {
      this.findings[id] = next;
      this.hintLevel = 0;
      return true;
    }
    return false;
  }
  answer(choiceId: string) {
    const i = this.inspection;
    if (!i) return;
    const obj = classroomObject(i.id);
    if (!obj || obj.kind !== "risk") return;
    const stage = this.findings[obj.id];
    const choices =
      stage === "notFound"
        ? obj.reasons
        : stage === "identified"
          ? obj.solutions
          : [];
    const choice = choices.find((c) => c.id === choiceId);
    if (!choice) return;
    i.feedback = choice.correct
      ? stage === "notFound"
        ? obj.reason
        : choice.feedback
      : choice.feedback;
    i.retry = !choice.correct;
    if (choice.correct)
      this.progress(obj.id, stage === "notFound" ? "identified" : "planned");
  }
  assign() {
    const i = this.inspection;
    if (!i) return;
    const obj = classroomObject(i.id);
    if (obj?.kind === "risk" && this.progress(obj.id, "assigned")) {
      i.feedback =
        "Canlandırma: bulguyu öğretmene ilettik. Uygulamayı yetkili yetişkin yapacak.";
      i.retry = false;
    }
  }
  verifyAdultFix() {
    const i = this.inspection;
    if (!i) return;
    const obj = classroomObject(i.id);
    if (obj?.kind === "risk" && this.progress(obj.id, "verifiedFixed")) {
      i.feedback = obj.adultFix;
      i.retry = false;
    }
  }
  explainSafe() {
    const i = this.inspection;
    if (!i) return;
    const obj = classroomObject(i.id);
    if (obj?.kind === "safe") {
      this.safeInspected.add(obj.id);
      i.feedback = obj.explanation;
      i.retry = false;
    }
  }
  hint() {
    const guided = this.guidedTarget();
    const target =
      guided ??
      RISKS.find((r) => this.findings[r.id] === "notFound")?.id ??
      RISKS.find((r) => this.findings[r.id] !== "verifiedFixed")?.id;
    const obj = RISKS.find((r) => r.id === target);
    if (!obj)
      return "AFİ: Altı riski de inceledik. Güvenli çözümleri yetişkinlerle planladık.";
    const text = obj.hints[Math.min(this.hintLevel, 2)];
    this.hintLevel = Math.min(2, this.hintLevel + 1);
    return `AFİ: ${text}`;
  }
}
