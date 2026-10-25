// Trusted Node-only practice host for Vite dev/preview. Never imported by src/.
// No classroom records or Supabase credentials; all scores remain explicitly practice.
import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import { FinalAssessmentFlow } from "../src/game/finalAssessmentFlow.ts";
import type {
  FinalAnswer,
  FinalQuestion,
} from "../src/data/finalAssessment.ts";
interface Room {
  flow: FinalAssessmentFlow;
  expires: number;
  calls: number;
  window: number;
  maps: Map<
    string,
    { source: Record<string, string>; target: Record<string, string> }
  >;
}
const rooms = new Map<string, Room>();
function presentation(room: Room) {
  const s = room.flow.snapshot(),
    q = s.question;
  if (!q) return { ...s, source: "practice-server" };
  let map = room.maps.get(q.id);
  if (!map) {
    map = { source: {}, target: {} };
    if (q.type === "matching")
      for (const p of q.pairs) {
        map.source[p.id] = randomUUID();
        map.target[p.id] = randomUUID();
      }
    else if (q.type === "drag_drop") {
      for (const p of q.items) map.source[p.id] = randomUUID();
      for (const z of q.zones) map.target[z.id] = randomUUID();
    }
    room.maps.set(q.id, map);
  }
  const {
    correct: _,
    explanation,
    ...safe
  } = q as FinalQuestion & { correct?: boolean };
  const pub: any = { ...safe, explanation: s.record ? explanation : "" };
  if (q.type === "matching") {
    pub.pairs = q.pairs.map((p) => ({ id: map!.source[p.id], left: p.left }));
    pub.targets = s.cardOrder.map((id) => ({
      id: map!.target[id],
      right: q.pairs.find((p) => p.id === id)!.right,
    }));
  }
  if (q.type === "drag_drop") {
    pub.items = q.items.map((p) => ({ id: map!.source[p.id], text: p.text }));
    pub.zones = q.zones.map((z) => ({ id: map!.target[z.id], label: z.label }));
  }
  const encode = (a: FinalAnswer | null) =>
    !a || typeof a === "boolean"
      ? a
      : Object.fromEntries(
          Object.entries(a).map(([k, v]) => [map!.source[k], map!.target[v]]),
        );
  const redact = (r: any) => (r ? { ...r, answers: undefined } : null);
  return {
    ...s,
    question: pub,
    draft: null,
    record: s.record
      ? {
          ...s.record,
          answer: encode(s.record.answer),
          practiceAnswer: encode(s.record.practiceAnswer),
        }
      : null,
    cardOrder:
      q.type === "matching"
        ? pub.targets.map((t: any) => t.id)
        : q.type === "drag_drop"
          ? s.cardOrder.map((id) => map!.source[id])
          : [],
    first: redact(s.first),
    last: redact(s.last),
    best: redact(s.best),
    source: "practice-server",
  };
}
export async function practiceMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  if (req.url !== "/api/guvenkent-practice") {
    next();
    return;
  }
  const send = (status: number, v: unknown) => {
    res.writeHead(status, {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(JSON.stringify(v));
  };
  if (req.method !== "POST") {
    send(405, { error: "Yalnız POST" });
    return;
  }
  // Same-origin POST; no cross-origin practice sessions.
  if (
    req.headers.origin &&
    req.headers.origin !== `http://${req.headers.host}` &&
    req.headers.origin !== `https://${req.headers.host}`
  ) {
    send(403, { error: "Origin rejected" });
    return;
  }
  try {
    let text = "";
    for await (const chunk of req) {
      text += chunk;
      if (text.length > 16000) {
        send(413, { error: "İstek çok büyük" });
        return;
      }
    }
    const body = JSON.parse(text);
    if (!body || typeof body.action !== "string") throw Error("Geçersiz istek");
    for (const [k, r] of rooms) if (r.expires < Date.now()) rooms.delete(k);
    let token = String(req.headers["x-practice-session"] ?? ""),
      room = rooms.get(token);
    if (body.action === "connect" && !room) {
      if (rooms.size >= 200) throw Error("Alıştırma sunucusu dolu");
      token = randomUUID() + randomUUID();
      room = {
        flow: new FinalAssessmentFlow(),
        expires: Date.now() + 3600000,
        calls: 0,
        window: Date.now(),
        maps: new Map(),
      };
      rooms.set(token, room);
    }
    if (!room) throw Error("Alıştırma oturumu sona erdi");
    if (Date.now() - room.window > 60000) {
      room.calls = 0;
      room.window = Date.now();
    }
    if (++room.calls > 240) throw Error("Çok sık istek");
    const f = room.flow;
    const decode = (answer: unknown): FinalAnswer => {
      if (typeof answer === "boolean") return answer;
      const q = f.snapshot().question;
      if (!q || !answer || typeof answer !== "object" || Array.isArray(answer))
        throw Error("Yanıt eksik");
      const map = room!.maps.get(q.id)!;
      return Object.fromEntries(
        Object.entries(answer).map(([k, v]) => {
          const source = Object.keys(map.source).find(
              (id) => map.source[id] === k,
            ),
            target = Object.keys(map.target).find((id) => map.target[id] === v);
          if (!source || !target) throw Error("Geçersiz kart");
          return [source, target];
        }),
      );
    };
    switch (body.action) {
      case "connect":
      case "resume":
        break;
      case "start":
        f.start(crypto.getRandomValues(new Uint32Array(1))[0]);
        break;
      case "retry":
        f.retry(crypto.getRandomValues(new Uint32Array(1))[0]);
        room.maps.clear();
        break;
      case "submit":
        f.submit(decode(body.answer));
        break;
      case "practice":
        f.practice(decode(body.answer));
        break;
      case "hint":
        f.hint();
        break;
      case "move":
        if (body.delta !== 1 && body.delta !== -1) throw Error("Geçersiz yön");
        f.move(body.delta);
        break;
      case "finalize":
        f.finalize();
        break;
      default:
        throw Error("Geçersiz işlem");
    }
    send(200, { token, state: presentation(room) });
  } catch (e) {
    send(400, {
      error: e instanceof Error ? e.message : "Alıştırma isteği tamamlanamadı",
    });
  }
}
