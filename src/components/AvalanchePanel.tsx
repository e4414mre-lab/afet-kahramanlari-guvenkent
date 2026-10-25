import { useEffect, useRef } from "react";
import type { GameSession, GameStatus } from "../game/story";
import {
  AVALANCHE_RISKS,
  AVALANCHE_INTRO,
  AVALANCHE_MEASURES,
  AVALANCHE_SAFETY,
} from "../data/avalanche";
export function AvalanchePanel({
  session,
  status,
  onFocus,
}: {
  session: GameSession;
  status: GameStatus;
  onFocus: () => void;
}) {
  const f = session.avalanche,
    s = status.avalanche,
    ref = useRef<HTMLDivElement>(null),
    risk = AVALANCHE_RISKS.find((r) => r.id === s.openId);
  const progress = risk ? s.risks[risk.id] : null;
  useEffect(() => {
    if (f.locked)
      ref.current
        ?.querySelector<HTMLButtonElement>(
          "[data-avalanche-choice]:not(:disabled)",
        )
        ?.focus({ preventScroll: true });
  }, [s.phase, s.openId, progress, s.elapsed === 40]);
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
    done = s.elapsed >= 40,
    after = s.phase === "afterSimulation";
  const comparisons = [
    [
      "Uyarıya erişim",
      "Önceden planlanmamış",
      s.measures.includes("monitoring")
        ? "Yetkili çığ değerlendirmesi ve güncel uyarılar"
        : "İnceleme planı seçilmedi",
    ],
    [
      "Güvenli güzergâh",
      "Duyuru daha geç",
      s.measures.includes("closure")
        ? "Alternatif rota önceden duyurulur"
        : "Alternatif rota bilgisi eksik",
    ],
    [
      "Riskli yol",
      "Kapalı; duyuru gecikir",
      s.measures.includes("closure")
        ? "Kapalı; kısıtlama önceden duyurulur"
        : "Kapalı; geçilmez",
    ],
    [
      "Olası etki",
      "Risk sürer",
      s.measures.includes("education")
        ? "Güvenli davranış bilinir; risk sürer"
        : "Bilgilendirme seçilmedi; risk sürer",
    ],
  ];
  return (
    <div
      ref={ref}
      className={`inspection-card avalanche-panel ${simulation ? "avalanche-simulation-panel" : ""} ${s.phase === "compare" ? "avalanche-comparison" : ""}`}
      role="dialog"
      aria-labelledby="avalanche-title"
    >
      {s.openId && (
        <button
          className="inspection-close subtle"
          aria-label="Karlıtepe incelemesini kapat"
          onClick={close}
        >
          ×
        </button>
      )}
      <small>AFİ · KARLITEPE · EĞİTİM SİMÜLASYONU</small>
      <h3 id="avalanche-title">
        {risk?.name ??
          (s.openId === "zeynep"
            ? "Çığ Uzmanı Zeynep"
            : s.openId === "preparedness"
              ? "Birlikte hazırlanalım"
              : simulation
                ? after
                  ? "Hazırlık sonrası"
                  : "Hazırlık öncesi"
                : s.phase === "compare"
                  ? "Aynı koşullar, farklı hazırlık"
                  : "Karlıtepe kısa raporu")}
      </h3>
      {s.openId === "zeynep" && (
        <>
          <p>{AVALANCHE_INTRO.zeynep}</p>
          <p>{AVALANCHE_INTRO.afi}</p>
          <button
            data-avalanche-choice
            className="primary"
            onClick={() =>
              act(() => {
                const first = f.phase === "meetZeynep";
                f.meet();
                if (first) session.say([AVALANCHE_RISKS[0].hint[0]]);
                onFocus();
              })
            }
          >
            Güvenli platformdan araştır
          </button>
        </>
      )}
      {risk && (
        <>
          <div className="home-object">
            <img src={`/assets/avalanche/${risk.asset}.png`} alt={risk.name} />
            <p>{risk.detail}</p>
          </div>
          {progress === "identified" && (
            <div className="inspection-choices">
              {risk.choices.map((c) => (
                <button
                  key={c.id}
                  data-avalanche-choice
                  onClick={() => act(() => f.answer(c.id))}
                >
                  {c.text}
                </button>
              ))}
            </div>
          )}
          {progress === "decided" && (
            <button
              data-avalanche-choice
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
          {progress === "explained" && (
            <>
              <p>{risk.why}</p>
              <button data-avalanche-choice onClick={close}>
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
            En az bir uzman hazırlığı seç. İki canlandırmada kar, hava ve eğim
            aynı; değişen yalnızca hazırlıklarımız.
          </p>
          <div className="inspection-choices">
            {AVALANCHE_MEASURES.map((p) => (
              <button
                key={p.id}
                data-avalanche-choice
                aria-pressed={s.measures.includes(p.id)}
                onClick={() => act(() => f.toggle(p.id))}
              >
                {s.measures.includes(p.id) ? "✓ " : ""}
                {p.label}
              </button>
            ))}
          </div>
          <button
            data-avalanche-choice
            className="primary"
            disabled={!s.measures.length}
            onClick={() => act(() => f.start())}
          >
            Aynı koşulları karşılaştır
          </button>
        </>
      )}
      {simulation && (
        <>
          <p className="avalanche-timer">
            {s.elapsed}/40 sn · Aynı kar / hava / eğim ·{" "}
            {after
              ? "Seçilen hazırlıklar uygulanıyor"
              : "Hazırlık önlemleri yok"}
          </p>
          <progress
            max={40}
            value={s.elapsed}
            aria-label="Eğitim simülasyonu süresi"
          />
          <p>
            Aynı kar örtüsü, soğuk hava, dik eğim ve başlangıç. Riskli yol
            kapalı; risk sürer.
          </p>
          {after && (
            <p className="avalanche-effect">
              {AVALANCHE_MEASURES.filter((p) => s.measures.includes(p.id))
                .map((p) => p.result)
                .join(" ")}
            </p>
          )}
          {after && (
            <p className="avalanche-effect-compact">
              {s.measures.length} hazırlık seçildi. Maruziyet azalabilir; kar
              kaybolmaz, risk sürer.
            </p>
          )}
          <div className="avalanche-simulation-actions">
            <button
              data-avalanche-choice
              className="subtle"
              disabled={done}
              onClick={() => act(() => f.summary())}
            >
              Geç / özeti göster
            </button>
            <button
              data-avalanche-choice
              className="primary"
              disabled={!done}
              onClick={() => act(() => f.next())}
            >
              {after ? "Karşılaştırmayı aç" : "Aynı koşulları hazırlıkla izle"}
            </button>
          </div>
        </>
      )}
      {s.phase === "compare" && (
        <>
          <p>
            İki deneme: 40 sn; aynı kar örtüsü, hava, eğim ve başlangıç
            koşulları.
          </p>
          <div
            className="avalanche-compare-grid"
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
            data-avalanche-choice
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
            Zeynep: Güncel uyarılar ve güvenli rota önemlidir. Önlemler riski
            sıfırlamaz; resmî uyarıları izlemeliyiz.
          </p>
          <p>
            3/3 risk incelendi · {s.measures.length} güvenli öneri. Seçimler
            yalnızca açık oturumda; sunucuya kaydedilmedi.
          </p>
          <button
            data-avalanche-choice
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
      <p className="inspection-footnote">{AVALANCHE_SAFETY}</p>
    </div>
  );
}
