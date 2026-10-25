// Shared input checks; importable in Node security tests, no Deno dependency.
export const ACTION_KEYS: Record<string, string[]> = {
  class_preview: ["joinToken"],
  join_class: ["joinToken", "nickname"],
  resume_session: [],
  revoke_session: [],
  save_progress: ["chapter", "state"],
  start_attempt: [],
  get_attempt: ["attemptId"],
  submit_answer: ["attemptId", "questionId", "answer", "idempotencyKey"],
  practice_answer: ["attemptId", "questionId", "answer"],
  finalize_attempt: ["attemptId"],
  assessment_history: [],
};
export function validateRequest(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw Error("Geçersiz istek");
  const b = input as Record<string, unknown>;
  if (typeof b.action !== "string" || !Object.hasOwn(ACTION_KEYS, b.action))
    throw Error("Geçersiz işlem");
  const keys = ["action", ...ACTION_KEYS[b.action]];
  if (
    Object.keys(b).some((k) => !keys.includes(k)) ||
    keys.some((k) => !Object.hasOwn(b, k))
  )
    throw Error("Beklenmeyen veya eksik alan");
  for (const k of keys.filter((k) => k !== "answer"))
    if (typeof b[k] !== "string" || (b[k] as string).length > 200)
      throw Error("Geçersiz alan");
  for (const k of ["attemptId", "idempotencyKey"])
    if (
      k in b &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        b[k] as string,
      )
    )
      throw Error("Geçersiz kimlik");
  if ("joinToken" in b && !/^[a-f0-9]{64}$/.test(b.joinToken as string))
    throw Error("Geçersiz bağlantı");
  if ("nickname" in b) {
    const n = (b.nickname as string).normalize("NFKC").trim();
    if (/[\p{Cc}\p{Cf}]/u.test(n) || [...n].length < 2 || [...n].length > 30)
      throw Error("2–30 karakterlik takma ad kullan");
    b.nickname = n;
  }
  if (
    "answer" in b &&
    typeof b.answer !== "boolean" &&
    (!b.answer ||
      typeof b.answer !== "object" ||
      Array.isArray(b.answer) ||
      Object.keys(b.answer).length > 3 ||
      Object.entries(b.answer).some(
        ([k, v]) => k.length > 80 || typeof v !== "string" || v.length > 80,
      ))
  )
    throw Error("Geçersiz yanıt");
  return b;
}
