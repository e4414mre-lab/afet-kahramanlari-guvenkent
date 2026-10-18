import { useEffect, useRef } from "react";
import { classroomObject, FINDING_LABELS } from "../game/classroomData";
import type { GameSession, GameStatus } from "../game/story";
export function InspectionPanel({
  status,
  session,
  onClose,
}: {
  status: GameStatus;
  session: GameSession;
  onClose: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null),
    inspection = status.inspection;
  const object = inspection ? classroomObject(inspection.id) : undefined;
  const stage =
    object?.kind === "risk" ? status.hunt.findings[object.id] : undefined;
  useEffect(() => {
    const first =
      panel.current?.querySelector<HTMLButtonElement>("[data-choice]");
    first?.focus({ preventScroll: true });
  }, [
    inspection?.id,
    stage,
    object?.kind === "safe" && !!inspection?.feedback,
  ]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [onClose]);
  if (!object || !inspection) return null;
  const choices =
    object.kind === "risk"
      ? stage === "notFound"
        ? object.reasons
        : stage === "identified"
          ? object.solutions
          : []
      : [];
  return (
    <div
      className="inspection-card"
      role="dialog"
      aria-labelledby="inspection-title"
      ref={panel}
    >
      <button
        className="inspection-close subtle"
        aria-label="İncelemeyi kapat"
        onClick={onClose}
      >
        ×
      </button>
      <div className="inspection-header">
        <img
          src={`/assets/school/${object.asset}.png`}
          alt={`${object.name} yakın görünümü`}
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
        />
        <div>
          <small>5-A • YAKINDAN İNCELE</small>
          <h3 id="inspection-title">{object.name}</h3>
        </div>
      </div>
      <p className="inspection-detail">
        {stage === "verifiedFixed"
          ? "Yetişkin çözümü canlandırmada uygulandı; tekrar inceleyebilirsin."
          : object.detail}
      </p>
      {inspection.feedback && (
        <p
          className={`inspection-feedback ${inspection.retry ? "retry" : ""}`}
          role="status"
        >
          {inspection.feedback}
        </p>
      )}
      {object.kind === "safe" ? (
        <>
          <h4>Bu nesne neden daha güvenli?</h4>
          {inspection.feedback ? (
            <button data-choice className="primary" onClick={onClose}>
              Keşfe dön
            </button>
          ) : (
            <button data-choice onClick={() => session.explainSafe()}>
              Güvenli özelliklerini incele
            </button>
          )}
        </>
      ) : (
        <>
          <small className="finding-stage">{FINDING_LABELS[stage!]}</small>
          {choices.length > 0 && (
            <>
              <h4>
                {stage === "notFound" ? "Bu neden riskli?" : "Ne yapmalıyız?"}
              </h4>
              <div className="inspection-choices">
                {choices.map((c) => (
                  <button
                    data-choice
                    key={c.id}
                    onClick={() => session.answerInspection(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </>
          )}
          {stage === "planned" && (
            <button
              data-choice
              className="primary"
              onClick={() => session.assignInspection()}
            >
              Öğretmene bildir
            </button>
          )}
          {stage === "assigned" && (
            <button
              data-choice
              className="primary"
              onClick={() => session.verifyInspection()}
            >
              Yetişkin çözümünü gör
            </button>
          )}
          {stage === "verifiedFixed" && (
            <>
              {!inspection.feedback && (
                <p className="inspection-detail">{object.adultFix}</p>
              )}
              <button data-choice className="primary" onClick={onClose}>
                Keşfe dön
              </button>
            </>
          )}
        </>
      )}
      <p className="inspection-footnote">
        Ağır eşyaya dokunma. Uygulamayı yetkili yetişkin yapar.
      </p>
    </div>
  );
}
