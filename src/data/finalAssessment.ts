import rawBank from "../../docs/data/final-question-bank-v1.1.json" with { type: "json" };
export const HAZARDS = [
  "earthquake",
  "flood",
  "wildfire",
  "landslide",
  "avalanche",
] as const;
export const TYPES = ["true_false", "matching", "drag_drop"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Hazard = (typeof HAZARDS)[number];
export type ActivityType = (typeof TYPES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export const HAZARD_NAMES: Record<Hazard, string> = {
  earthquake: "Deprem",
  flood: "Sel ve taşkın",
  wildfire: "Orman yangını",
  landslide: "Heyelan",
  avalanche: "Çığ",
};
export const TYPE_NAMES: Record<ActivityType, string> = {
  true_false: "Doğru–Yanlış",
  matching: "Eşleştirme",
  drag_drop: "Kartları yerleştir",
};
export const HAZARD_ART: Record<Hazard, string> = {
  earthquake: "/assets/home/room.png",
  flood: "/assets/flood/area.png",
  wildfire: "/assets/forest/area.png",
  landslide: "/assets/landslide/area.png",
  avalanche: "/assets/avalanche/area.png",
};
interface BaseQuestion {
  id: string;
  hazard: Hazard;
  type: ActivityType;
  difficulty: Difficulty;
  points: 20;
  explanation: string;
}
export type TrueFalseQuestion = BaseQuestion & {
  type: "true_false";
  statement: string;
  correct: boolean;
};
export type MatchingQuestion = BaseQuestion & {
  type: "matching";
  instruction: string;
  pairs: { id: string; left: string; right: string }[];
};
export type DragQuestion = BaseQuestion & {
  type: "drag_drop";
  instruction: string;
  zones: { id: string; label: string }[];
  items: { id: string; text: string; correctZone: string }[];
};
export type FinalQuestion = TrueFalseQuestion | MatchingQuestion | DragQuestion;
export interface QuestionBank {
  version: string;
  language: "tr";
  educationalReviewRequired: true;
  questions: FinalQuestion[];
}
export function validateBank(value: unknown): QuestionBank {
  const fail = (s: string): never => {
    throw new Error("Soru havuzu geçersiz: " + s);
  };
  const obj = (v: unknown): Record<string, unknown> => {
    if (!v || typeof v !== "object" || Array.isArray(v))
      return fail("nesne bekleniyor");
    return v as Record<string, unknown>;
  };
  const str = (v: unknown): string => {
    if (typeof v !== "string" || !v.trim() || v.length > 4000)
      return fail("metin eksik");
    return v;
  };
  const arr = (v: unknown, n: number): unknown[] => {
    if (!Array.isArray(v) || v.length !== n) return fail("kayıt sayısı");
    return v;
  };
  const unique = (s: string[]) => {
    if (new Set(s).size !== s.length) fail("yinelenen değer");
  };
  const b = obj(value);
  str(b.version);
  if (b.language !== "tr" || b.educationalReviewRequired !== true)
    fail("dil veya inceleme bilgisi");
  const questions = arr(b.questions, 60).map((v) => {
    const q = obj(v);
    str(q.id);
    str(q.explanation);
    if (
      !HAZARDS.includes(q.hazard as Hazard) ||
      !TYPES.includes(q.type as ActivityType) ||
      !DIFFICULTIES.includes(q.difficulty as Difficulty) ||
      q.points !== 20
    )
      fail("tür/afet/zorluk/puan");
    if (q.type === "true_false") {
      str(q.statement);
      if (typeof q.correct !== "boolean") fail("doğru–yanlış yanıtı");
    } else if (q.type === "matching") {
      str(q.instruction);
      const pairs = arr(q.pairs, 3).map(obj);
      for (const key of ["id", "left", "right"])
        unique(pairs.map((p) => str(p[key])));
    } else {
      str(q.instruction);
      const zones = arr(q.zones, 2).map(obj),
        items = arr(q.items, 2).map(obj);
      const ids = zones.map((z) => str(z.id));
      unique(ids);
      unique(zones.map((z) => str(z.label)));
      unique(items.map((i) => str(i.id)));
      unique(items.map((i) => str(i.text)));
      items.forEach((i) => {
        if (!ids.includes(str(i.correctZone))) fail("hedef yok");
      });
    }
    return structuredClone(q) as unknown as FinalQuestion;
  });
  unique(questions.map((q) => q.id));
  for (const h of HAZARDS)
    for (const t of TYPES) {
      const g = questions.filter((q) => q.hazard === h && q.type === t);
      if (
        g.length !== 4 ||
        g.filter((q) => q.difficulty === "easy").length !== 1 ||
        g.filter((q) => q.difficulty === "medium").length !== 2 ||
        g.filter((q) => q.difficulty === "hard").length !== 1
      )
        fail("grup dağılımı");
    }
  return {
    version: str(b.version),
    language: "tr",
    educationalReviewRequired: true,
    questions,
  };
}
export const FINAL_BANK = validateBank(rawBank);
/** Stable unsigned PRNG: selection and card order can be reproduced from the recorded seed. */
export function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffled<T>(input: readonly T[], random: () => number): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
export function selectExam(
  seed: number,
  bank: QuestionBank = FINAL_BANK,
): FinalQuestion[] {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff)
    throw new Error("Geçersiz sınav tohumu");
  const random = seededRandom(seed),
    levels = shuffled<Difficulty>(
      [
        ...Array(5).fill("easy"),
        ...Array(6).fill("medium"),
        ...Array(4).fill("hard"),
      ],
      random,
    );
  const groups = HAZARDS.flatMap((h) => TYPES.map((t) => ({ h, t })));
  const chosen = groups.map(({ h, t }, i) => {
    const pool = bank.questions.filter(
      (q) => q.hazard === h && q.type === t && q.difficulty === levels[i],
    );
    if (!pool.length)
      throw new Error("Zorluk hedefi bu havuzla karşılanamıyor");
    return pool[Math.floor(random() * pool.length)];
  });
  return structuredClone(shuffled(chosen, random));
}
export type FinalAnswer = boolean | Record<string, string>;
export function scoreAnswer(
  q: FinalQuestion,
  answer: FinalAnswer,
): { points: number; correct: number; total: number } {
  if (q.type === "true_false") {
    if (typeof answer !== "boolean") throw new Error("Bir yanıt seç");
    const correct = Number(answer === q.correct);
    return { points: 20 * correct, correct, total: 1 };
  }
  if (typeof answer !== "object" || answer === null || Array.isArray(answer))
    throw new Error("Kartları tamamla");
  const ids =
      q.type === "matching"
        ? q.pairs.map((p) => p.id)
        : q.items.map((i) => i.id),
    targets =
      q.type === "matching"
        ? q.pairs.map((p) => p.id)
        : q.zones.map((z) => z.id);
  if (
    Object.keys(answer).length !== ids.length ||
    ids.some((id) => !targets.includes(answer[id]))
  )
    throw new Error("Bütün kartları yerleştir");
  if (q.type === "matching" && new Set(Object.values(answer)).size !== 3)
    throw new Error("Her davranışı bir kez kullan");
  const correct =
    q.type === "matching"
      ? q.pairs.filter((p) => answer[p.id] === p.id).length
      : q.items.filter((i) => answer[i.id] === i.correctZone).length;
  return {
    points: Math.round((20 * correct) / ids.length),
    correct,
    total: ids.length,
  };
}
export function questionHints(q: FinalQuestion): string[] {
  return [
    `AFİ: ${HAZARD_NAMES[q.hazard]} bölümünde güvenli gözlem ve yetişkin desteği hakkında öğrendiklerimizi hatırla.`,
    q.type === "true_false"
      ? "İfadeyi bütünüyle oku. Çocuk tehlikeye giriyor mu? Hazırlık riski tamamen yok eder mi?"
      : q.type === "matching"
        ? "Her durumu ayrı düşün. Güvenli konumda kalmak, yetişkine bildirmek ve resmî yönlendirme birbirinden farklı ihtiyaçlara yanıt verir."
        : "Önce hedef başlığını oku. Bir kartın başlığa uymaması her zaman tehlikeli olduğu anlamına gelmez.",
    q.explanation,
  ];
}
