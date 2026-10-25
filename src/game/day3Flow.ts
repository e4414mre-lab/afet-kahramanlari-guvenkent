import {
  MEASURES,
  REGIONS,
  REASONS,
  STARTING_BUDGET,
  calculateRemainingBudget,
  toggleMeasure,
  buildRegionalOutcomes,
  type MeasureId,
  type RegionId,
} from "../data/day3.ts";
export type Day3Step =
  | "briefing"
  | "consulting"
  | "planning"
  | "simulating"
  | "comparing"
  | "replanning"
  | "finalized";
export class Day3Flow {
  active = false;
  open = false;
  step: Day3Step = "briefing";
  region: RegionId = "flood";
  selectedIds: MeasureId[] = [];
  reasons: Partial<Record<MeasureId, string>> = {};
  pending: MeasureId | null = null;
  consulted: RegionId[] = [];
  viewed: RegionId[] = [];
  elapsed = 0;
  feedback = "";
  finalReason = "";
  completionCount = 0;
  history: {
    revision: number;
    selectedIds: MeasureId[];
    remainingBudget: number;
    reasons: Partial<Record<MeasureId, string>>;
    outcomes: ReturnType<typeof buildRegionalOutcomes>;
  }[] = [];
  get remainingBudget() {
    return calculateRemainingBudget(this.selectedIds);
  }
  get editable() {
    return this.step === "planning" || this.step === "replanning";
  }
  enter() {
    this.active = true;
    this.open = false;
  }
  show() {
    this.open = true;
    this.feedback = "";
  }
  close() {
    this.open = false;
    this.pending = null;
  }
  beginConsulting() {
    if (this.step === "briefing") this.step = "consulting";
  }
  viewRegion(id: RegionId) {
    if (!REGIONS.some((r) => r.id === id)) return;
    if (this.editable && this.region !== id) {
      this.pending = null;
      this.feedback = "";
    }
    this.region = id;
    if (this.step === "consulting" && !this.consulted.includes(id))
      this.consulted.push(id);
    if (this.step === "comparing" && !this.viewed.includes(id))
      this.viewed.push(id);
  }
  consult() {
    this.viewRegion(this.region);
  }
  plan() {
    if (this.step === "consulting" && this.consulted.length === 4)
      this.step = "planning";
  }
  choose(id: MeasureId) {
    if (!this.editable) return;
    try {
      const next = toggleMeasure(this.selectedIds, id);
      if (this.selectedIds.includes(id)) {
        this.selectedIds = next;
        delete this.reasons[id];
        this.pending = null;
        this.feedback = "Önlem geri alındı; planlama puanları iade edildi.";
      } else {
        this.pending = id;
        this.feedback =
          "Neden bunu önceliklendirdin? Tek bir doğru strateji yok.";
      }
    } catch (e) {
      this.feedback =
        e instanceof Error ? e.message : "Plan hesaplanamadı; tekrar dene.";
      this.pending = null;
    }
  }
  explain(reason: string) {
    if (!this.editable || !this.pending || !REASONS.some((r) => r === reason))
      return;
    const id = this.pending;
    try {
      this.selectedIds = toggleMeasure(this.selectedIds, id);
      this.reasons[id] = reason;
      this.feedback = "Önlem ve gerekçen plana eklendi.";
    } catch {
      this.feedback =
        "Kalan planlama puanı yetmiyor. Bir seçimi geri alıp yeniden dene.";
    }
    this.pending = null;
  }
  apply() {
    if (!this.editable || this.pending) return;
    try {
      const remainingBudget = this.remainingBudget;
      if (this.selectedIds.some((id) => !this.reasons[id])) {
        this.feedback = "Seçimlerinin gerekçelerini tamamla.";
        return;
      }
      this.history.push({
        revision: this.history.length + 1,
        selectedIds: [...this.selectedIds],
        remainingBudget,
        reasons: { ...this.reasons },
        outcomes: buildRegionalOutcomes(this.selectedIds),
      });
      this.elapsed = 0;
      this.viewed = [];
      this.step = "simulating";
      this.feedback = "";
    } catch {
      this.feedback = "Plan uygulanamadı; seçimleri geri alıp yeniden dene.";
    }
  }
  tick(dt: number) {
    if (this.step === "simulating" && Number.isFinite(dt) && dt >= 0)
      this.elapsed = Math.min(12, this.elapsed + dt);
  }
  summary() {
    if (this.step === "simulating") {
      this.elapsed = 12;
      this.step = "comparing";
      this.viewed = [this.region];
    }
  }
  compare() {
    if (this.step === "simulating" && this.elapsed >= 12) this.summary();
  }
  replan() {
    if (this.step === "comparing" || this.step === "finalized") {
      this.step = "replanning";
      this.pending = null;
      this.feedback =
        "Son denemenin önlemleri korunuyor. İstediğini geri alıp farklı bir plan dene.";
    }
  }
  setFinalReason(reason: string) {
    if (this.step === "comparing" && REASONS.some((r) => r === reason))
      this.finalReason = reason;
  }
  finalize() {
    if (
      this.step === "comparing" &&
      this.viewed.length === 4 &&
      this.finalReason
    ) {
      this.step = "finalized";
      this.completionCount = 1;
      this.feedback = "";
    }
  }
  snapshot() {
    const covered = new Set(
      this.selectedIds.map((id) => MEASURES.find((m) => m.id === id)!.region),
    );
    return {
      active: this.active,
      open: this.open,
      step: this.step,
      region: this.region,
      selectedIds: [...this.selectedIds],
      reasons: { ...this.reasons },
      pending: this.pending,
      remainingBudget: this.remainingBudget,
      startingBudget: STARTING_BUDGET,
      studentScore: null,
      plannedMeasures: [...this.selectedIds],
      consulted: [...this.consulted],
      viewed: [...this.viewed],
      elapsed: Math.floor(this.elapsed),
      feedback: this.feedback,
      finalReason: this.finalReason,
      planRevision: this.history.length,
      completionCount: this.completionCount,
      missingRegions: REGIONS.filter((r) => !covered.has(r.id)).map(
        (r) => r.name,
      ),
      history: this.history.map((h) => structuredClone(h)),
      outcomes: buildRegionalOutcomes(
        this.selectedIds,
        this.step === "simulating" ? (45 * Math.floor(this.elapsed)) / 12 : 45,
      ),
    };
  }
}
export type Day3State = ReturnType<Day3Flow["snapshot"]>;
