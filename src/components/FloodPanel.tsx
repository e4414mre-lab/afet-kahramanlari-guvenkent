import { useEffect, useRef } from "react";
import type { GameSession, GameStatus } from "../game/story";
import {
  FLOOD_RISKS,
  FLOOD_INTRO,
  PREPAREDNESS,
  FLOOD_SAFETY,
} from "../data/flood";
export function FloodPanel({
  session,
  status,
  onFocus,
}: {
  session: GameSession;
  status: GameStatus;
  onFocus: () => void;
}) {
  const f = session.flood,
    s = status.flood,
    ref = useRef<HTMLDivElement>(null),
    risk = FLOOD_RISKS.find((r) => r.id === s.openId);
  const progress = risk ? s.risks[risk.id] : null;
  useEffect(() => {
    if (f.locked)
      ref.current
        ?.querySelector<HTMLButtonElement>("[data-flood-choice]:not(:disabled)")
        ?.focus({ preventScroll: true });
  }, [s.phase, s.openId, progress, s.elapsed === 45]);
  if (!f.locked) return null;
  const act = (fn: () => void) => {
    fn();
    session.notify();
  };
  const close = () =>
    act(() => {
      f.close();
      onFocus();
    });
  const simulation = s.simulation,
    done = s.elapsed >= 45,
    after = s.phase === "afterSimulation";
  const comparisons = [
    [
      "Hazırlık",
      "Önlem seçilmeden",
      s.measures.length + " güvenli öneri / yetkili uygulama canlandırması",
    ],
    [
      "Uyarıya erişim",
      "Yağış sırasında genel uyarı",
      s.measures.includes("warning")
        ? "Önceden bilgilendirme ve yüksek güzergâh"
        : "Genel uyarı; erken bilgilendirme seçilmedi",
    ],
    ["Su olan yol / alçak köprü", "Kapalı, geçilmez", "Kapalı, yine geçilmez"],
    [
      "Olası zarar azaltma",
      "Yerel birikim ve hazırlıksızlık riski",
      [
        s.measures.includes("maintenance")
          ? "Yerel birikim azalabilir."
          : "Bakım seçilmedi.",
        s.measures.includes("planning") ? "Geçiş planı var." : "",
        s.measures.includes("warning") ? "Erken bilgi var." : "",
        "Risk sürer.",
      ].join(" "),
    ],
  ];
  return (
    <div
      ref={ref}
      className={`inspection-card flood-panel ${simulation ? "flood-simulation-panel" : ""} ${s.phase === "compare" ? "flood-comparison" : ""}`}
      role="dialog"
      aria-labelledby="flood-title"
    >
      {s.openId && (
        <button
          className="inspection-close subtle"
          aria-label="Dere incelemesini kapat"
          onClick={close}
        >
          ×
        </button>
      )}
      <small>AFİ · DERE MAHALLESİ · EĞİTİM SİMÜLASYONU</small>
      <h3 id="flood-title">
        {risk?.name ??
          (s.openId === "hasan"
            ? "Hasan Amca"
            : s.openId === "preparedness"
              ? "Birlikte hazırlanalım"
              : simulation
                ? after
                  ? "Hazırlık sonrası"
                  : "Hazırlık öncesi"
                : s.phase === "compare"
                  ? "Aynı yağış, farklı hazırlık"
                  : "Dere Mahallesi kısa raporu")}
      </h3>
      {s.openId === "hasan" && (
        <>
          <p>{FLOOD_INTRO.hasan}</p>
          <p>{FLOOD_INTRO.afi}</p>
          <button
            data-flood-choice
            className="primary"
            onClick={() =>
              act(() => {
                f.meet();
                onFocus();
              })
            }
          >
            Güvenli meydandan araştır
          </button>
        </>
      )}
      {risk && (
        <>
          <div className="home-object">
            <img src={`/assets/flood/${risk.asset}.png`} alt={risk.name} />
            <p>{risk.detail}</p>
          </div>
          {progress === "identified" && (
            <div className="inspection-choices">
              {risk.choices.map((c) => (
                <button
                  key={c.id}
                  data-flood-choice
                  onClick={() => act(() => f.answer(c.id))}
                >
                  {c.text}
                </button>
              ))}
            </div>
          )}
          {progress === "decisionMade" && (
            <button
              data-flood-choice
              className="primary"
              onClick={() =>
                act(() => {
                  f.review();
                  onFocus();
                })
              }
            >
              Gerekçeyi not et
            </button>
          )}
          {progress === "reviewed" && (
            <>
              <p>{risk.why}</p>
              <button data-flood-choice onClick={close}>
                Araştırmaya dön
              </button>
            </>
          )}
          <button
            className="subtle"
            onClick={() =>
              act(() => {
                f.feedback = f.hint();
                f.retry = false;
              })
            }
          >
            AFİ ipucu
          </button>
        </>
      )}
      {s.openId === "preparedness" && (
        <>
          <p>
            En az bir öneri seç. Önce ve sonra aynı yoğun yağışı izleyeceğiz;
            değişen yalnızca hazırlıklarımız.
          </p>
          <div className="inspection-choices">
            {PREPAREDNESS.map((p) => (
              <button
                key={p.id}
                data-flood-choice
                aria-pressed={s.measures.includes(p.id)}
                onClick={() => act(() => f.toggle(p.id))}
              >
                {s.measures.includes(p.id) ? "✓ " : ""}
                {p.label}
              </button>
            ))}
            <button onClick={() => act(() => f.unsafePreparation())}>
              Taşkında alçak köprüden hızlıca geçmek
            </button>
          </div>
          <button
            data-flood-choice
            className="primary"
            disabled={!s.measures.length}
            onClick={() => act(() => f.start())}
          >
            Aynı yağışı karşılaştır
          </button>
        </>
      )}
      {simulation && (
        <>
          <p className="flood-timer">
            {s.elapsed}/45 sn · Yoğun yağış ·{" "}
            {after
              ? "Seçilen hazırlıklar uygulanıyor"
              : "Hazırlık önlemleri yok"}
          </p>
          <progress
            max={45}
            value={s.elapsed}
            aria-label="Eğitim simülasyonu süresi"
          />
          <p>
            Alçak yol ve köprü kapalı. Dere seviyesi her iki denemede de
            yükselir.
          </p>
          {after && (
            <p className="flood-effect">
              {PREPAREDNESS.filter((p) => s.measures.includes(p.id))
                .map((p) => p.result)
                .join(" ")}
            </p>
          )}
          {after && (
            <p className="flood-effect-compact">
              {s.measures.length} hazırlık seçildi. Yerel zarar azalabilir; dere
              yükselmesi ve geçiş yasağı sürer.
            </p>
          )}
          <div className="flood-simulation-actions">
            <button
              data-flood-choice
              className="subtle"
              disabled={done}
              onClick={() => act(() => f.summary())}
            >
              Geç / özeti göster
            </button>
            <button
              data-flood-choice
              className="primary"
              disabled={!done}
              onClick={() => act(() => f.next())}
            >
              {after ? "Karşılaştırmayı aç" : "Aynı yağışı hazırlıkla izle"}
            </button>
          </div>
        </>
      )}
      {s.phase === "compare" && (
        <>
          <p>İki deneme: 45 sn yoğun yağış, aynı dere yükselmesi.</p>
          <div
            className="flood-compare-grid"
            role="table"
            aria-label="Önce sonra karşılaştırması"
          >
            <div role="row">
              <strong role="columnheader">Gözlem</strong>
              <strong role="columnheader">Önce</strong>
              <strong role="columnheader">Sonra</strong>
            </div>
            {comparisons.map(([label, before, after]) => (
              <div role="row" key={label}>
                <strong role="cell">{label}</strong>
                <span role="cell">{before}</span>
                <span role="cell">{after}</span>
              </div>
            ))}
          </div>
          <button
            data-flood-choice
            className="primary"
            onClick={() => act(() => f.next())}
          >
            Kısa raporu al
          </button>
        </>
      )}
      {s.phase === "completed" && (
        <>
          <p>
            Hasan Amca: Hazırlıklarımız bazı zararları azaltabilir. Yine de her
            yağışta güvenlik uyarılarını izlemeliyiz.
          </p>
          <p>
            3/3 risk incelendi · {s.measures.length} güvenli öneri. Seçimler
            yalnızca açık oturumda; sunucuya kaydedilmedi.
          </p>
          <button
            data-flood-choice
            className="primary"
            onClick={() => act(() => f.replay())}
          >
            Karşılaştırmayı yeniden dene
          </button>
          <button
            onClick={() =>
              act(() => {
                f.travel = "city";
              })
            }
          >
            Meydana dön
          </button>
        </>
      )}
      {s.feedback && (
        <p
          className={`inspection-feedback ${s.retry ? "retry" : ""}`}
          role="status"
        >
          {s.feedback}
        </p>
      )}
      <p className="inspection-footnote">{FLOOD_SAFETY}</p>
    </div>
  );
}
