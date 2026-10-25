import type { Hazard, ActivityType } from "../data/assessmentPresentation";
export function normalizeNickname(value: string) {
  const s = value.normalize("NFKC").trim();
  if (/[\p{Cc}\p{Cf}]/u.test(s) || [...s].length < 2 || [...s].length > 30)
    throw Error("2–30 karakterlik ad veya takma ad kullan.");
  return s;
}
export function publicConfiguration(url: unknown, key: unknown) {
  if (typeof url !== "string" || typeof key !== "string" || !url || !key)
    return null;
  try {
    const u = new URL(url);
    if (
      u.protocol !== "https:" ||
      u.username ||
      u.password ||
      u.search ||
      u.hash
    )
      return null;
    if (key.startsWith("sb_secret_")) return null;
    if (!key.startsWith("sb_publishable_")) {
      const p = JSON.parse(
        atob(key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );
      if (p.role !== "anon") return null;
    }
    return { url: u.origin, key };
  } catch {
    return null;
  }
}
export const SUPABASE = publicConfiguration(
  import.meta.env?.VITE_SUPABASE_URL,
  import.meta.env?.VITE_SUPABASE_ANON_KEY,
);
export interface ClassInfo {
  id: string;
  label: string;
  joinEnabled: boolean;
  expiresAt: string;
  archivedAt: string | null;
  studentCount: number;
}
export interface AttemptResult {
  id: string;
  total: number;
  finishedAt: string;
  bankVersion: string;
  seed: string;
  byType: { type: ActivityType; points: number; maximum: number }[];
  byHazard: { hazard: Hazard; points: number; maximum: number }[];
  answers?: {
    questionId: string;
    points: number;
    correct: number;
    total: number;
  }[];
}
export interface StudentInfo {
  id: string;
  nickname: string;
  code: string;
  createdAt: string;
  progress: { chapter: string; state: string; updatedAt: string }[];
  attempts: AttemptResult[];
  activeAttempt: { answered: number; startedAt: string; lastAnsweredAt?:string|null } | null;
}
export interface Dashboard {
  students: StudentInfo[];
  top5: {
    student_id: string;
    nickname: string;
    code: string;
    score: number;
    finished_at: string;
  }[];
}
export function bestCompleted(attempts: AttemptResult[]) {
  return (
    [...attempts].sort(
      (a, b) =>
        b.total - a.total ||
        a.finishedAt.localeCompare(b.finishedAt) ||
        a.id.localeCompare(b.id),
    )[0] ?? null
  );
}
export function rankTop5(students: StudentInfo[]) {
  return students
    .flatMap((s) => {
      const b = bestCompleted(s.attempts);
      return b
        ? [
            {
              student_id: s.id,
              nickname: s.nickname,
              code: s.code,
              score: b.total,
              finished_at: b.finishedAt,
            },
          ]
        : [];
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.finished_at.localeCompare(b.finished_at) ||
        a.student_id.localeCompare(b.student_id),
    )
    .slice(0, 5);
}
let teacherToken = "";
let refreshToken = "";
let teacherExpiry = 0;
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
async function jsonRequest(
  path: string,
  body: unknown,
  token = "",
  method = "POST",
) {
  if (!SUPABASE)
    throw new ApiError("Supabase bağlı değil. Canlı işlem yapılmadı.", 503);
  const response = await fetch(SUPABASE.url + path, {
    method,
    headers: {
      apikey: SUPABASE.key,
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new ApiError(
      response.status === 401 || response.status === 403
        ? "Oturum sona erdi veya bu işlem için yetkin yok."
        : response.status === 429
          ? "Çok sık istek gönderildi. Biraz bekle."
          : "İşlem tamamlanamadı. Bağlantıyı ve bilgilerini kontrol et.",
      response.status,
    );
  return data;
}
export async function teacherLogin(email: string, password: string) {
  const s = await jsonRequest("/auth/v1/token?grant_type=password", {
    email: email.trim(),
    password,
  });
  teacherToken = s.access_token;
  refreshToken = s.refresh_token;
  teacherExpiry = Date.now() + s.expires_in * 1000;
  try {
    await teacherRpc("gk_my_classes", {});
  } catch (e) {
    teacherToken = refreshToken = "";
    throw e;
  }
}
export async function teacherLogout() {
  try {
    if (teacherToken) await jsonRequest("/auth/v1/logout", {}, teacherToken);
  } finally {
    teacherToken = refreshToken = "";
    teacherExpiry = 0;
  }
}
export async function teacherRpc(name: string, args: unknown) {
  if (!teacherToken) throw new ApiError("Öğretmen girişi gerekli.", 401);
  if (teacherExpiry < Date.now() + 30000) {
    try {
      const s = await jsonRequest("/auth/v1/token?grant_type=refresh_token", {
        refresh_token: refreshToken,
      });
      teacherToken = s.access_token;
      refreshToken = s.refresh_token;
      teacherExpiry = Date.now() + s.expires_in * 1000;
    } catch (e) {
      teacherToken = refreshToken = "";
      throw e;
    }
  }
  return jsonRequest("/rest/v1/rpc/" + name, args, teacherToken);
}
export async function resetTeacherPassword(email:string){return jsonRequest('/auth/v1/recover?redirect_to='+encodeURIComponent(location.origin+'/?teacher-recovery=1'),{email:email.trim()})}
export async function completePasswordRecovery(
  token: string,
  password: string,
) {
  if (password.length < 12)
    throw Error("En az 12 karakterli yeni parola kullan.");
  await jsonRequest("/auth/v1/user", { password }, token, "PUT");
}
export interface StudentSession {
  studentId: string;
  nickname: string;
  code: string;
  classLabel: string;
  sessionToken: string;
  expiresAt: string;
}
let active: StudentSession | null = null;
export function currentStudent() {
  return active;
}
export async function studentApi(
  action: string,
  params: Record<string, unknown> = {},
  token = active?.sessionToken,
) {
  if (!SUPABASE)
    throw new ApiError("Supabase bağlı değil. Sınıf kaydı yapılmadı.", 503);
  const r = await fetch(SUPABASE.url + "/functions/v1/guvenkent", {
    method: "POST",
    headers: {
      apikey: SUPABASE.key,
      "Content-Type": "application/json",
      ...(token ? { "X-Student-Session": token } : {}),
    },
    body: JSON.stringify({ action, ...params }),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  const v = await r.json().catch(() => ({}));
  if (!r.ok) {
    if (r.status === 401) {
      active = null;
      sessionStorage.removeItem("gk-student-session");
    }
    throw new ApiError(v.error || "Sınıf işlemi tamamlanamadı.", r.status);
  }
  return v;
}
export async function joinClass(token: string, nickname: string) {
  const s = await studentApi("join_class", {
    joinToken: token,
    nickname: normalizeNickname(nickname),
  });
  active = s;
  sessionStorage.setItem("gk-student-session", JSON.stringify(s));
  return s as StudentSession;
}
export async function resumeStudent() {
  const raw = sessionStorage.getItem("gk-student-session");
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    const s = await studentApi("resume_session", {}, saved.sessionToken);
    active = { ...s, sessionToken: saved.sessionToken };
    return active;
  } catch (e) {
    active = null;
    sessionStorage.removeItem("gk-student-session");
    throw e;
  }
}
export async function leaveClass() {
  try {
    if (active) await studentApi("revoke_session");
  } finally {
    active = null;
    sessionStorage.removeItem("gk-student-session");
  }
}
