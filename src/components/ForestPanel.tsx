import { useEffect, useRef } from "react";
import type { GameSession, GameStatus } from "../game/story";
import {
  FOREST_RISKS,
  SMOKE_CHOICES,
  FOREST_WEATHER,
  FOREST_INTRO,
  FOREST_MEASURES,
  FOREST_SAFETY,
} from "../data/forestFire";
export function ForestPanel({
  session,
  status,
  onFocus,
}: {
  session: GameSession;
  status: GameStatus;
  onFocus: () => void;
}) {
  const f = session.forest,
    s = status.forest,
    ref = useRef<HTMLDivElement>(null),
    risk = FOREST_RISKS.find((r) => r.id === s.openId);
  const progress = risk ? s.risks[risk.id] : null;
  useEffect(() => {
    if (f.locked)
      ref.current
        ?.querySelector<HTMLButtonElement>(
          "[data-forest-choice]:not(:disabled)",
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
      "Uyarı",
      "Genel uyarı daha geç",
      s.measures.includes("routes") ? "Erken uyarı" : "Erken uyarı seçilmedi",
    ],
    [
      "Yönlendirme",
      "Ziyaretçi yönlendirmesi gecikir",
      s.measures.includes("routes")
        ? "Erken güvenli uzaklaşma"
        : "Genel yönlendirme",
    ],
    [
      "Uzman koordinasyonu",
      "Bildirim daha geç",
      s.measures.includes("watch")
        ? "Ekipler daha erken haberdar"
        : "Genel bildirim",
    ],
    [
      "Olası risk etkisi",
      "Bakımsız örtü / geç bilgi",
      s.measures.includes("maintenance")
        ? "Bakım etkiyi azaltabilir; risk sürer"
        : "Bakım seçilmedi; risk sürer",
    ],
  ];
  return (
    <div
      ref={ref}
      className={`inspection-card forest-panel ${simulation ? "forest-simulation-panel" : ""} ${s.phase === "compare" ? "forest-comparison" : ""}`}
      role="dialog"
      aria-labelledby="forest-title"
    >
      {s.openId && s.openId !== "smoke" && (
        <button
          className="inspection-close subtle"
          aria-label="Orman incelemesini kapat"
          onClick={close}
        >
          ×
        </button>
      )}
      <small>AFİ · ÇAMLIK ORMANI · EĞİTİM SİMÜLASYONU</small>
      <h3 id="forest-title">
        {risk?.name ??
          (s.openId === "elif"
            ? "Orman Görevlisi Elif"
            : s.openId === "smoke"
              ? "Uzaktaki duman: ne yaparsın?"
              : s.openId === "preparedness"
                ? "Birlikte hazırlanalım"
                : simulation
                  ? after
                    ? "Hazırlık sonrası"
                    : "Hazırlık öncesi"
                  : s.phase === "compare"
                    ? "Aynı hava, farklı hazırlık"
                    : "Çamlık Ormanı kısa raporu")}
      </h3>
      {s.openId === "elif" && (
        <>
          <p>{FOREST_INTRO.elif}</p>
          <p>{FOREST_INTRO.afi}</p>
          <button
            data-forest-choice
            className="primary"
            onClick={() =>
              act(() => {
                const first = f.phase === "meetElif";
                f.meet();
                if (first) session.say([FOREST_RISKS[0].hint[0]]);
                onFocus();
              })
            }
          >
            Güvenli seyir yolundan araştır
          </button>
        </>
      )}
      {s.openId === "smoke" && (
        <>
          <p>
            Uzaktaki orman çizgisinde hafif duman var. Güvenli ziyaret
            alanındayız.
          </p>
          {!s.smokeSolved ? (
            <div className="inspection-choices">
              {SMOKE_CHOICES.map((c) => (
                <button
                  key={c.id}
                  data-forest-choice
                  onClick={() => act(() => f.answerSmoke(c.id))}
                >
                  {c.text}
                </button>
              ))}
            </div>
          ) : (
            <button
              data-forest-choice
              className="primary"
              onClick={() =>
                act(() => {
                  f.finishSmoke();
                  onFocus();
                })
              }
            >
              Güvenli kararı not et
            </button>
          )}
          <p className="inspection-footnote">
            Yalnızca eğitimsel karar; gerçek arama yapılmaz, telefon bilgisi
            istenmez.
          </p>
        </>
      )}
      {risk && (
        <>
          <div className="home-object">
            <img src={`/assets/forest/${risk.asset}.png`} alt={risk.name} />
            <p>{risk.detail}</p>
          </div>
          {progress === "identified" && (
            <div className="inspection-choices">
              {risk.choices.map((c) => (
                <button
                  key={c.id}
                  data-forest-choice
                  onClick={() => act(() => f.answer(c.id))}
                >
                  {c.text}
                </button>
              ))}
            </div>
          )}
          {progress === "decisionMade" && (
            <button
              data-forest-choice
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
              <button data-forest-choice onClick={close}>
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
            En az bir uzman hazırlığı seç. İki canlandırmada hava aynı kalacak;
            değişen yalnızca hazırlıklarımız.
          </p>
          <div className="inspection-choices">
            {FOREST_MEASURES.map((p) => (
              <button
                key={p.id}
                data-forest-choice
                aria-pressed={s.measures.includes(p.id)}
                onClick={() => act(() => f.toggle(p.id))}
              >
                {s.measures.includes(p.id) ? "✓ " : ""}
                {p.label}
              </button>
            ))}
          </div>
          <button
            data-forest-choice
            className="primary"
            disabled={!s.measures.length}
            onClick={() => act(() => f.start())}
          >
            Aynı havayı karşılaştır
          </button>
        </>
      )}
      {simulation && (
        <>
          <p className="forest-timer">
            {s.elapsed}/40 sn · Aynı hava ·{" "}
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
            {FOREST_WEATHER.temperatureC}°C · {FOREST_WEATHER.windKmh} km/sa{" "}
            {FOREST_WEATHER.windDirection} rüzgârı · kuru örtü. Tehlikeli alan
            kapalı; risk sürer.
          </p>
          {after && (
            <p className="forest-effect">
              {FOREST_MEASURES.filter((p) => s.measures.includes(p.id))
                .map((p) => p.result)
                .join(" ")}
            </p>
          )}
          {after && (
            <p className="forest-effect-compact">
              {s.measures.length} hazırlık seçildi. Erken bilgi ve bakım etkili
              olabilir; hava değişmez, risk sürer.
            </p>
          )}
          <div className="forest-simulation-actions">
            <button
              data-forest-choice
              className="subtle"
              disabled={done}
              onClick={() => act(() => f.summary())}
            >
              Geç / özeti göster
            </button>
            <button
              data-forest-choice
              className="primary"
              disabled={!done}
              onClick={() => act(() => f.next())}
            >
              {after ? "Karşılaştırmayı aç" : "Aynı havayı hazırlıkla izle"}
            </button>
          </div>
        </>
      )}
      {s.phase === "compare" && (
        <>
          <p>İki deneme: 40 sn; aynı rüzgâr, sıcaklık ve kuruluk.</p>
          <div
            className="forest-compare-grid"
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
            data-forest-choice
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
            Elif: Hazırlık tehlikeyi azaltabilir. Hava değişebilir; hiçbir orman
            tamamen risksiz değildir.
          </p>
          <p>
            3/3 risk incelendi · {s.measures.length} güvenli öneri. Seçimler
            yalnızca açık oturumda; sunucuya kaydedilmedi.
          </p>
          <button
            data-forest-choice
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
      <p className="inspection-footnote">{FOREST_SAFETY}</p>
    </div>
  );
}
