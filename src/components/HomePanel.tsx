import { useEffect, useRef } from "react";
import type { GameSession, GameStatus } from "../game/story";
import { HOME_ITEMS, HOME_SAFETY } from "../game/homeFlow";
export function HomePanel({
  session,
  status,
  onFocus,
}: {
  session: GameSession;
  status: GameStatus;
  onFocus: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null),
    h = status.home,
    flow = session.home;
  const item = HOME_ITEMS.find((o) => o.id === h.openId);
  const state = item ? h.findings[item.id] : null;
  const active =
    ["Home", "GatheringPoint"].includes(status.scene) && flow.locked;
  useEffect(() => {
    if (active)
      panel.current
        ?.querySelector<HTMLButtonElement>("[data-home-choice]")
        ?.focus({ preventScroll: true });
  }, [active, h.phase, h.openId, state, h.protected]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (flow.openId || flow.readyOpen)) {
        flow.close();
        session.notify();
        onFocus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [session, flow, onFocus]);
  if (!active) return null;
  const act = (f: () => void) => {
    f();
    session.notify();
  };
  const close = () =>
    act(() => {
      flow.close();
      onFocus();
    });
  return (
    <div
      className="inspection-card home-panel"
      role="dialog"
      aria-labelledby="home-panel-title"
      ref={panel}
    >
      {(item || h.readyOpen) && (
        <button
          className="inspection-close subtle"
          aria-label="Ev incelemesini kapat"
          onClick={close}
        >
          ×
        </button>
      )}
      <small>AFİ · EV VE PLANLI EĞİTİM TATBİKATI</small>
      <h3 id="home-panel-title">
        {item?.name ??
          (h.phase === "homeIntro"
            ? "Çağrı’nın evi"
            : h.readyOpen
              ? "Planlı tatbikata hazır mısın?"
              : h.phase === "shaking"
                ? h.protected
                  ? "Çök–Kapan–Tutun: korunmaya devam"
                  : "Sarsıntı başladı. Ne yapmalısın?"
                : h.phase === "afterShaking"
                  ? "Sarsıntı sona erdi"
                  : "Güvenli buluşma alanındayız")}
      </h3>
      {item && (
        <>
          <div className="home-object">
            <img src={`/assets/home/${item.asset}.png`} alt={item.name} />
            <p>{item.detail}</p>
          </div>
          {state === "unseen" && (
            <>
              <h4>
                {item.risk
                  ? "Bu durum için güvenli karar hangisi?"
                  : "Bu nesne neden daha güvenli?"}
              </h4>
              <div className="inspection-choices">
                <button
                  data-home-choice
                  onClick={() => act(() => flow.answer(true))}
                >
                  {item.action}
                </button>
                {item.risk && (
                  <button
                    data-home-choice
                    onClick={() => act(() => flow.answer(false))}
                  >
                    {item.wrong}
                  </button>
                )}
              </div>
            </>
          )}
          {state === "reported" && (
            <button
              data-home-choice
              className="primary"
              onClick={() => act(() => flow.fix())}
            >
              Yetişkin çözümünü gör
            </button>
          )}
          {state === "fixed" && (
            <button data-home-choice className="primary" onClick={close}>
              Ev keşfine dön
            </button>
          )}
        </>
      )}
      {h.phase === "homeIntro" && (
        <>
          <p>
            Evimizdeki küçük önlemler büyük fark yaratır. Önce birlikte
            gözlemleyip yetişkine bildirelim.
          </p>
          <button
            data-home-choice
            className="primary"
            onClick={() => act(() => flow.intro())}
          >
            Evi incelemeye başla
          </button>
        </>
      )}
      {h.readyOpen && (
        <>
          <p>
            Bu planlı bir eğitim simülasyonu. Sarsıntı sırasında korunacağız;
            tahliyeyi sarsıntı bittikten sonra yapacağız.
          </p>
          <button
            data-home-choice
            className="primary"
            onClick={() => act(() => flow.start())}
          >
            Planlı tatbikatı başlat
          </button>
        </>
      )}
      {h.phase === "shaking" && !h.protected && (
        <div className="inspection-choices">
          <button
            data-home-choice
            onClick={() => act(() => flow.decide("protect"))}
          >
            Çök–Kapan–Tutun; baş ve boynu koru, sarsıntı bitene kadar kal.
          </button>
          <button
            data-home-choice
            onClick={() => act(() => flow.decide("window"))}
          >
            Pencereye koşarım.
          </button>
          <button
            data-home-choice
            onClick={() => act(() => flow.decide("stairs"))}
          >
            Merdivene yönelirim.
          </button>
          <button
            data-home-choice
            onClick={() => act(() => flow.decide("lift"))}
          >
            Asansöre binerim.
          </button>
        </div>
      )}
      {h.phase === "shaking" && h.protected && (
        <p className="home-protection" role="status">
          Korunmaya devam et · Sarsıntının bitmesini bekliyoruz. Baş ve boyun
          korunur; sağlam masa ayağına tutunulur.
        </p>
      )}
      {h.phase === "afterShaking" && !h.evacuation && (
        <div className="inspection-choices">
          <button
            data-home-choice
            onClick={() => act(() => flow.decide("evacuate"))}
          >
            Yetişkin yönlendirmesiyle açık çıkıştan buluşma alanına git.
          </button>
          <button
            data-home-choice
            onClick={() => act(() => flow.decide("return"))}
          >
            Eşyalarımı almak için geri döner, tesisatı kendim kontrol ederim.
          </button>
        </div>
      )}
      {h.phase === "completed" && (
        <>
          <p>{h.feedback}</p>
          <p>
            Acil durumda 112 yalnızca gerekli olduğunda ve güvenli koşullarda
            aranır. Bu tatbikatta arama yapılmaz.
          </p>
          <button
            data-home-choice
            className="primary"
            onClick={() => act(() => flow.replay())}
          >
            Tatbikatı yeniden dene
          </button>
          <button
            onClick={() =>
              act(() => {
                flow.travel = "city";
              })
            }
          >
            Meydana dön
          </button>
        </>
      )}
      {h.feedback && h.phase !== "completed" && (
        <p
          className={`inspection-feedback ${h.retry ? "retry" : ""}`}
          role="status"
        >
          {h.feedback}
        </p>
      )}
      <p className="inspection-footnote">{HOME_SAFETY}</p>
    </div>
  );
}
