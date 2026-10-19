import { useEffect, useRef } from "react";
import type { GameSession, GameStatus } from "../game/story";
import {
  LANDSLIDE_RISKS,
  LANDSLIDE_INTRO,
  LANDSLIDE_MEASURES,
  LANDSLIDE_SAFETY,
} from "../data/landslide";
export function LandslidePanel({
  session,
  status,
  onFocus,
}: {
  session: GameSession;
  status: GameStatus;
  onFocus: () => void;
}) {
  const f = session.landslide,
    s = status.landslide,
    ref = useRef<HTMLDivElement>(null),
    risk = LANDSLIDE_RISKS.find((r) => r.id === s.openId);
  const progress = risk ? s.risks[risk.id] : null;
  useEffect(() => {
    if (f.locked)
      ref.current
        ?.querySelector<HTMLButtonElement>(
          "[data-landslide-choice]:not(:disabled)",
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
      "Uzman incelemesi",
      "Önceden planlanmamış",
      s.measures.includes("survey")
        ? "Zemin / arazi kullanım değerlendirmesi"
        : "İnceleme planı seçilmedi",
    ],
    [
      "Erken uyarı",
      "Duyuru daha geç",
      s.measures.includes("warning")
        ? "Önceden bilgi ve güvenli güzergâh"
        : "Genel duyuru",
    ],
    [
      "Riskli yol",
      "Kapalı; duyuru gecikir",
      s.measures.includes("warning")
        ? "Kapalı; kısıtlama önceden duyurulur"
        : "Kapalı; geçilmez",
    ],
    [
      "Olası etki",
      "Risk sürer",
      s.measures.includes("engineering")
        ? "Yerel etkiler azalabilir; risk sürer"
        : "Mühendislik planı seçilmedi; risk sürer",
    ],
  ];
  return (
    <div
      ref={ref}
      className={`inspection-card landslide-panel ${simulation ? "landslide-simulation-panel" : ""} ${s.phase === "compare" ? "landslide-comparison" : ""}`}
      role="dialog"
      aria-labelledby="landslide-title"
    >
      {s.openId && (
        <button
          className="inspection-close subtle"
          aria-label="Yamaç incelemesini kapat"
          onClick={close}
        >
          ×
        </button>
      )}
      <small>AFİ · YAMAÇ MAHALLESİ · EĞİTİM SİMÜLASYONU</small>
      <h3 id="landslide-title">
        {risk?.name ??
          (s.openId === "murat"
            ? "Jeoloji Mühendisi Murat"
            : s.openId === "preparedness"
              ? "Birlikte hazırlanalım"
              : simulation
                ? after
                  ? "Hazırlık sonrası"
                  : "Hazırlık öncesi"
                : s.phase === "compare"
                  ? "Aynı koşullar, farklı hazırlık"
                  : "Yamaç Mahallesi kısa raporu")}
      </h3>
      {s.openId === "murat" && (
        <>
          <p>{LANDSLIDE_INTRO.murat}</p>
          <p>{LANDSLIDE_INTRO.afi}</p>
          <button
            data-landslide-choice
            className="primary"
            onClick={() =>
              act(() => {
                const first = f.phase === "meetMurat";
                f.meet();
                if (first) session.say([LANDSLIDE_RISKS[0].hint[0]]);
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
            <img src={`/assets/landslide/${risk.asset}.png`} alt={risk.name} />
            <p>{risk.detail}</p>
          </div>
          {progress === "identified" && (
            <div className="inspection-choices">
              {risk.choices.map((c) => (
                <button
                  key={c.id}
                  data-landslide-choice
                  onClick={() => act(() => f.answer(c.id))}
                >
                  {c.text}
                </button>
              ))}
            </div>
          )}
          {progress === "decided" && (
            <button
              data-landslide-choice
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
              <button data-landslide-choice onClick={close}>
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
            En az bir uzman hazırlığı seç. İki canlandırmada yağış ve zemin
            aynı; değişen yalnızca hazırlıklarımız.
          </p>
          <div className="inspection-choices">
            {LANDSLIDE_MEASURES.map((p) => (
              <button
                key={p.id}
                data-landslide-choice
                aria-pressed={s.measures.includes(p.id)}
                onClick={() => act(() => f.toggle(p.id))}
              >
                {s.measures.includes(p.id) ? "✓ " : ""}
                {p.label}
              </button>
            ))}
          </div>
          <button
            data-landslide-choice
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
          <p className="landslide-timer">
            {s.elapsed}/40 sn · Aynı yağış / zemin ·{" "}
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
            Aynı şiddetli / uzun yağış, duyarlı zemin, dik eğim ve başlangıç.
            Riskli yol kapalı; risk sürer.
          </p>
          {after && (
            <p className="landslide-effect">
              {LANDSLIDE_MEASURES.filter((p) => s.measures.includes(p.id))
                .map((p) => p.result)
                .join(" ")}
            </p>
          )}
          {after && (
            <p className="landslide-effect-compact">
              {s.measures.length} hazırlık seçildi. Etki azalabilir; zayıf yamaç
              kesin sağlamlaşmaz, risk sürer.
            </p>
          )}
          <div className="landslide-simulation-actions">
            <button
              data-landslide-choice
              className="subtle"
              disabled={done}
              onClick={() => act(() => f.summary())}
            >
              Geç / özeti göster
            </button>
            <button
              data-landslide-choice
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
            İki deneme: 40 sn; aynı yağış, zemin duyarlılığı, eğim ve başlangıç
            koşulları.
          </p>
          <div
            className="landslide-compare-grid"
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
            data-landslide-choice
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
            Murat: Uzman incelemesi ve doğru yerleşim planı önemlidir. Önlemler
            riski sıfırlamaz; resmî uyarıları izlemeliyiz.
          </p>
          <p>
            3/3 risk incelendi · {s.measures.length} güvenli öneri. Seçimler
            yalnızca açık oturumda; sunucuya kaydedilmedi.
          </p>
          <button
            data-landslide-choice
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
      <p className="inspection-footnote">{LANDSLIDE_SAFETY}</p>
    </div>
  );
}
