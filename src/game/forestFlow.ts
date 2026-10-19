import {
  FOREST_RISKS,
  FOREST_OBJECTIVES,
  FOREST_MEASURES,
  FOREST_WEATHER,
  SMOKE_CHOICES,
  SMOKE_EXPLANATION,
  forestForcing,
  type ForestRiskId,
  type ForestMeasureId,
} from "../data/forestFire.ts";
export type ForestPhase = keyof typeof FOREST_OBJECTIVES;
export type RiskProgress =
  | "unseen"
  | "identified"
  | "decisionMade"
  | "reviewed";
export type ForestPreparationRecord = {
  version: 1;
  region: "camlik";
  measures: ForestMeasureId[];
  scenario: typeof FOREST_WEATHER;
};
export class ForestFlow {
  phase: ForestPhase = "notStarted";
  risks: Record<ForestRiskId, RiskProgress> = {
    forestEmbers: "unseen",
    forestBrush: "unseen",
    forestSign: "unseen",
  };
  openId: ForestRiskId | "elif" | "preparedness" | "smoke" | null = null;
  feedback = "";
  retry = false;
  hintLevel = 0;
  smokeSolved = false;
  elapsed = 0;
  completionCount = 0;
  measures: ForestMeasureId[] = [];
  travel: "city" | null = null;
  get investigated() {
    return Object.values(this.risks).filter((s) => s === "reviewed").length;
  }
  get simulation() {
    return (
      this.phase === "beforeSimulation" || this.phase === "afterSimulation"
    );
  }
  get locked() {
    return (
      !!this.openId ||
      this.simulation ||
      this.phase === "compare" ||
      this.phase === "completed"
    );
  }
  enter() {
    if (this.phase === "notStarted") this.phase = "meetElif";
  }
  open(id: ForestRiskId | "elif" | "preparedness" | "smoke") {
    if (
      this.simulation ||
      this.phase === "compare" ||
      this.phase === "completed"
    )
      return;
    this.feedback = "";
    this.retry = false;
    if (this.openId !== id) this.hintLevel = 0;
    if (id === "elif") {
      this.openId = id;
      return;
    }
    if (this.phase === "meetElif") {
      this.openId = "elif";
      return;
    }
    if (id === "smoke") {
      if (this.phase === "smokeDecision") this.openId = "smoke";
      return;
    }
    if (id === "preparedness") {
      if (this.investigated < 3 || !this.smokeSolved) {
        this.feedback =
          "Önce üç riski güvenli seyir yolundan incele, sonra duman kararını tamamla.";
        return;
      }
    } else if (this.risks[id] === "unseen") this.risks[id] = "identified";
    this.openId = id;
  }
  meet() {
    if (this.openId !== "elif") return;
    if (this.phase === "meetElif") this.phase = "inspectRisks";
    this.close();
  }
  close() {
    this.openId = null;
    this.feedback = "";
    this.retry = false;
  }
  answer(choice: string) {
    const item = FOREST_RISKS.find((r) => r.id === this.openId);
    if (!item || this.risks[item.id] !== "identified") return;
    const c = item.choices.find((c) => c.id === choice);
    if (!c) return;
    this.retry = !c.correct;
    this.feedback =
      (c.correct ? "Güvenli karar. " : "Tekrar düşünelim. ") + item.why;
    if (c.correct) this.risks[item.id] = "decisionMade";
  }
  review() {
    const id = this.openId;
    if (
      !id ||
      id === "elif" ||
      id === "preparedness" ||
      id === "smoke" ||
      this.risks[id] !== "decisionMade"
    )
      return;
    this.risks[id] = "reviewed";
    this.close();
    if (this.investigated === 3) {
      this.phase = "smokeDecision";
      this.openId = "smoke";
    }
  }
  answerSmoke(choice: string) {
    if (
      this.phase !== "smokeDecision" ||
      this.openId !== "smoke" ||
      this.smokeSolved
    )
      return;
    const c = SMOKE_CHOICES.find((c) => c.id === choice);
    if (!c) return;
    this.retry = !c.correct;
    this.feedback =
      (c.correct ? "Güvenli karar. " : "Tekrar düşünelim. ") +
      SMOKE_EXPLANATION;
    if (c.correct) this.smokeSolved = true;
  }
  finishSmoke() {
    if (this.phase === "smokeDecision" && this.smokeSolved) {
      this.close();
      this.phase = "chooseMeasures";
    }
  }
  toggle(id: ForestMeasureId) {
    if (
      this.phase !== "chooseMeasures" ||
      this.openId !== "preparedness" ||
      !FOREST_MEASURES.some((p) => p.id === id)
    )
      return;
    this.measures = this.measures.includes(id)
      ? this.measures.filter((v) => v !== id)
      : [...this.measures, id];
    this.retry = false;
    this.feedback =
      "Öneriler yetkili ekipler ve yetişkinler içindir; bu oyunda gerçek bildirim gönderilmez.";
  }
  start() {
    if (this.phase !== "chooseMeasures" || !this.measures.length) return;
    this.close();
    this.elapsed = 0;
    this.phase = "beforeSimulation";
  }
  tick(dt: number) {
    if (this.simulation)
      this.elapsed = Math.min(40, this.elapsed + Math.max(0, dt));
  }
  summary() {
    if (this.simulation) this.elapsed = 40;
  }
  next() {
    if (this.phase === "beforeSimulation" && this.elapsed === 40) {
      this.phase = "afterSimulation";
      this.elapsed = 0;
    } else if (this.phase === "afterSimulation" && this.elapsed === 40)
      this.phase = "compare";
    else if (this.phase === "compare") {
      this.phase = "completed";
      this.completionCount = 1;
    }
  }
  replay() {
    if (this.phase === "completed") {
      this.phase = "chooseMeasures";
      this.openId = "preparedness";
      this.elapsed = 0;
      this.feedback = "";
      this.retry = false;
    }
  }
  hint() {
    if (this.phase === "smokeDecision")
      return "AFİ: Dumanı araştırmak için yaklaşma; güvenli uzaklaşma yönlendirmesine uy ve yetişkine konum bilgisiyle bildir.";
    const r =
      FOREST_RISKS.find((r) => r.id === this.openId) ??
      FOREST_RISKS.find((r) => this.risks[r.id] !== "reviewed");
    const level = Math.min(2, this.hintLevel++);
    return r
      ? r.hint[level]
      : [
          "AFİ: Hazırlıkları birlikte düşünelim.",
          "AFİ: Kulübenin yanındaki ahşap bilgi panosuna bak.",
          "AFİ: Hazırlık panosunu incele, en az bir güvenli öneri seç; aynı havada iki canlandırmayı karşılaştır.",
        ][level];
  }
  exportPreparation(): ForestPreparationRecord {
    return {
      version: 1,
      region: "camlik",
      measures: [...this.measures],
      scenario: { ...FOREST_WEATHER },
    };
  }
  snapshot() {
    const common = {
      risks: { ...this.risks },
      smokeSolved: this.smokeSolved,
      openId: this.openId,
      feedback: this.feedback,
      retry: this.retry,
      investigated: this.investigated,
      measures: [...this.measures],
      elapsed: Math.floor(this.elapsed),
      completionCount: this.completionCount,
      hintLevel: Math.min(3, this.hintLevel),
      scenario: { ...FOREST_WEATHER },
      forcing: forestForcing(this.elapsed),
      preparation: this.exportPreparation(),
    };
    if (this.phase === "beforeSimulation" || this.phase === "afterSimulation")
      return { ...common, phase: this.phase, simulation: true as const };
    return { ...common, phase: this.phase, simulation: false as const };
  }
}
/** Discriminated public state: simulation phases carry simulation:true. */
export type ForestState = ReturnType<ForestFlow["snapshot"]>;
