import { validateRequest } from "../_shared/request.ts";
// Supabase Edge runtime. No teacher role is accepted from request data.
const env = (name: string) => Deno.env.get(name) ?? "";
const url = env("SUPABASE_URL"),
  key = env("SUPABASE_SERVICE_ROLE_KEY");
async function hash(value: string) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
    (b) => b.toString(16).padStart(2, "0"),
  ).join("");
}
Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin") ?? "",
    allowed = env("ALLOWED_ORIGINS")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    Vary: "Origin",
    ...(allowed.includes(origin)
      ? {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Headers":
            "content-type,apikey,authorization,x-student-session",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
        }
      : {}),
  };
  const response = (status: number, v: unknown) =>
    new Response(JSON.stringify(v), { status, headers });
  if (!origin || !allowed.includes(origin))
    return response(403, { error: "İzin verilmeyen kaynak." });
  if (req.method === "OPTIONS")
    return new Response(null, { status: 204, headers });
  if (req.method !== "POST")
    return response(405, { error: "Yalnız POST desteklenir." });
  if (!url || !key)
    return response(503, {
      error: "Supabase sunucu yapılandırması tamamlanmadı.",
    });
  try {
    if (Number(req.headers.get("content-length") ?? 0) > 16000)
      return response(413, { error: "İstek çok büyük." });
    // Read with a hard byte limit, including chunked bodies.
    const reader = req.body?.getReader();
    let size = 0;
    const chunks: Uint8Array[] = [];
    if (reader)
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 16000) {
          await reader.cancel();
          return response(413, { error: "İstek çok büyük." });
        }
        chunks.push(value);
      }
    const bytes = new Uint8Array(size);
    let at = 0;
    for (const c of chunks) {
      bytes.set(c, at);
      at += c.length;
    }
    const b = validateRequest(JSON.parse(new TextDecoder().decode(bytes))),
      action = String(b.action);
    async function rpc(name: string, args: Record<string, unknown>) {
      const r = await fetch(url + "/rest/v1/rpc/" + name, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: "Bearer " + key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
        signal: AbortSignal.timeout(12000),
      });
      const data = await r.json();
      if (!r.ok) throw { code: data.code };
      return data;
    }
    const joining = action === "class_preview" || action === "join_class";
    const token = req.headers.get("X-Student-Session") ?? "";
    if (!joining && !/^[a-f0-9]{64}$/.test(token))
      return response(401, { error: "Öğrenci oturumu gerekli." });
    const digest = joining ? "" : await hash(token);
    // A separate committed transaction counts failed actions too (no rollback bypass).
    await rpc("gk_api_throttle", {
      p_scope: joining ? "join" : "session:" + digest,
    });
    let args: Record<string, unknown> = { p_session_hash: digest },
      name = "gk_" + action;
    if (joining)
      args = {
        p_join_hash: await hash(String(b.joinToken)),
        ...(action === "join_class" ? { p_nickname: b.nickname } : {}),
      };
    else if (action === "save_progress")
      args = { ...args, p_chapter: b.chapter, p_state: b.state };
    else if (
      [
        "get_attempt",
        "submit_answer",
        "practice_answer",
        "finalize_attempt",
      ].includes(action)
    )
      args = { ...args, p_attempt: b.attemptId };
    if (action === "submit_answer" || action === "practice_answer")
      args = {
        ...args,
        p_question: b.questionId,
        p_answer: b.answer,
        ...(action === "submit_answer"
          ? { p_idempotency: b.idempotencyKey }
          : {}),
      };
    return response(200, await rpc(name, args));
  } catch (e) {
    const code = (e as { code?: string })?.code;
    return response(
      code === "28000"
        ? 401
        : code === "42501"
          ? 403
          : code === "54000"
            ? 429
            : 400,
      {
        error:
          code === "28000"
            ? "Bağlantı veya oturumun süresi dolmuş."
            : code === "54000"
              ? "Çok sık istek. Biraz bekle."
              : "İşlem sonucu doğrulanamadı. Aynı denemeyi yeniden eşitle; tekrar puan eklenmez.",
      },
    );
  }
});
