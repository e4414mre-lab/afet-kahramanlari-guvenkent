import { FloodScene } from "../game/FloodScene";
import { FloodPanel } from "./FloodPanel";
import { FLOOD_SAFETY } from "../data/flood";
import { HomeScene, GatheringPointScene } from "../game/HomeScene";
import { HomePanel } from "./HomePanel";
import { HOME_SAFETY } from "../game/homeFlow";
import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { CitySquareScene } from "../game/CitySquareScene";
import { SchoolClassroomScene } from "../game/SchoolClassroomScene";
import { InspectionPanel } from "./InspectionPanel";
import { CLASSROOM_SAFETY } from "../game/classroomData";
import { TownHallScene } from "../game/TownHallScene";
import { GameSession, SAFETY, type GameStatus } from "../game/story";
import type { AdventureScene } from "../game/AdventureScene";
import type { Settings } from "../lib/settings";

declare global {
  interface Window {
    __guvenkent?: () => Record<string, unknown>;
  }
}
export function GamePreview({
  settings,
  onSettings,
  paused,
}: {
  settings: Settings;
  onSettings: () => void;
  paused: boolean;
}) {
  const [regionsOpen, setRegionsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<GameSession | null>(null);
  const scenes = useRef<AdventureScene[]>([]);
  const [status, setStatus] = useState<GameStatus>(() =>
    new GameSession(settings, () => {}).status(),
  );
  useEffect(() => {
    if (!ref.current) return;
    const session = new GameSession(settings, setStatus);
    sessionRef.current = session;
    session.paused = paused;
    scenes.current = [
      new CitySquareScene(session),
      new TownHallScene(session),
      new SchoolClassroomScene(session),
      new HomeScene(session),
      new GatheringPointScene(session),
      new FloodScene(session),
    ];
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: ref.current,
      width: 1100,
      height: 680,
      backgroundColor: "#b5d7c4",
      scale: {
        mode: Phaser.Scale.RESIZE,
        min: { width: 320, height: 400 },
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: scenes.current,
      render: { antialias: true },
    });
    // QA explicitly opts into a read-only inspector; tests still use actual input.
    const qa = new URLSearchParams(window.location.search).get("qa") === "1";
    if (qa)
      window.__guvenkent = () => {
        const active = scenes.current.find((s) => s.sys.isActive());
        return {
          status: session.status(),
          ...(active?.sys.isActive() && active.children.length
            ? active.diagnostics()
            : {}),
          textureCount: game.textures.getTextureKeys().length,
          sceneCount: game.scene.getScenes(true).length,
          canvasCount: ref.current?.querySelectorAll("canvas").length,
        };
      };
    const reset = () => {
      session.controls.x = 0;
      session.controls.y = 0;
    };
    window.addEventListener("pointerup", reset);
    window.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointerup", reset);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      if (qa) delete window.__guvenkent;
      game.destroy(true);
      sessionRef.current = null;
      scenes.current = [];
    };
  }, []);
  useEffect(() => {
    const session = sessionRef.current;
    if (session) {
      session.settings = settings;
      session.paused = paused || regionsOpen;
      scenes.current.forEach((scene) => scene.configure());
    }
  }, [settings, paused, regionsOpen]);
  const direction =
    (x: number, y: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      const c = sessionRef.current?.controls;
      if (c) {
        c.x = x;
        c.y = y;
      }
    };
  const stop = () => {
    const c = sessionRef.current?.controls;
    if (c) {
      c.x = 0;
      c.y = 0;
    }
  };
  const homeScene =
    status.scene === "Home" || status.scene === "GatheringPoint";
  const homeLocked = homeScene && !!sessionRef.current?.home.locked;
  const floodScene = status.scene === "Flood";
  const floodLocked = floodScene && !!sessionRef.current?.flood.locked;
  const dialogue = status.dialogue;
  useEffect(() => {
    if (status.scene !== "Flood" || !status.dialogue) return;
    const frame = requestAnimationFrame(() =>
      ref.current?.parentElement
        ?.querySelector<HTMLButtonElement>(".story-dialogue .primary")
        ?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [status.scene, status.dialogue]);
  const lastPage = !!dialogue && dialogue.index === dialogue.pages.length - 1;
  return (
    <div
      onTouchStart={(event) => {
        // Phaser's window touch listener must not receive DOM control presses.
        // Canvas touches keep bubbling normally for scene interactions.
        if (event.target instanceof Element && event.target.closest("button"))
          event.stopPropagation();
      }}
      className={`city-shell ${status.scene === "SchoolClassroom" || homeScene || floodScene ? "classroom-shell" : ""}`}
    >
      <div className="city-top">
        <div>
          <span className="eyebrow">GÖRSEL ONAY BEKLEYEN PROTOTİP</span>
          <h2>
            {floodScene
              ? "Dere Mahallesi · Sel ve taşkın"
              : homeScene
                ? status.scene === "Home"
                  ? "Çağrı’nın evi"
                  : "Güvenli buluşma alanı"
                : status.scene === "SchoolClassroom"
                  ? "Güvenkent İlkokulu · 5-A"
                  : `Güvenkent • ${status.scene === "TownHall" ? "Belediye" : "Şehir meydanı"}`}
          </h2>
        </div>
        <button onClick={onSettings}>Ayarlar</button>
      </div>
      <div className="city-stage" aria-busy={status.transitioning}>
        <div
          ref={ref}
          className="city-canvas"
          tabIndex={0}
          aria-label={
            floodScene
              ? "Oynanabilir Dere Mahallesi"
              : homeScene
                ? "Oynanabilir ev ve eğitim tatbikatı"
                : status.scene === "SchoolClassroom"
                  ? "Oynanabilir 5-A sınıfı"
                  : status.scene === "TownHall"
                    ? "Oynanabilir belediye iç mekânı"
                    : "Oynanabilir Güvenkent meydanı"
          }
        />
        <div className="quest-card" role="status">
          <small>
            {floodScene
              ? `İKİNCİ GÜN · ${status.flood.investigated}/3 ARAŞTIRMA`
              : homeScene
                ? `PLANLI EĞİTİM · ${status.home.risks}/4 EV RİSKİ`
                : status.scene === "SchoolClassroom"
                  ? `RİSK AVI · ${status.hunt.found}/6 BULGU`
                  : status.schoolVisited
                    ? "İLK DURAK ✓"
                    : "İLK HİKÂYE •"}
          </small>
          <span>
            {floodScene
              ? status.objective
              : homeScene
                ? `${status.home.safe}/2 güvenli nesne · ${
                    status.scene === "GatheringPoint" &&
                    status.home.phase === "gatheringPoint"
                      ? status.objective
                      : status.home.phase === "completed"
                        ? "Tatbikat tamam"
                        : status.home.phase === "drillReady"
                          ? "Masa yanında tatbikatı başlat"
                          : status.home.evacuation
                            ? "Açık kapıdan kontrollü çıkış"
                            : "Gözlemle · Yetişkine bildir"
                  }`
                : status.scene === "SchoolClassroom"
                  ? `${status.hunt.fixed}/6 yetişkin çözümü · ${status.hunt.safeCount}/4 güvenli nesne`
                  : status.schoolVisited
                    ? "5-A sınıfına giriş hazır"
                    : status.objective}
          </span>
        </div>
        <button
          className="afi-hint"
          aria-label="AFİ’den ipucu al"
          disabled={status.transitioning || homeLocked || floodLocked}
          onClick={() => sessionRef.current?.hint()}
        >
          AFİ <span>?</span>
        </button>
        {status.assetErrors.length > 0 && (
          <p className="asset-warning" role="alert">
            Bazı görseller yüklenemedi. Bu açık oyun oturumundaki ilerlemen
            korunuyor.
          </p>
        )}
        {status.inspection && sessionRef.current && (
          <InspectionPanel
            status={status}
            session={sessionRef.current}
            onClose={() => {
              sessionRef.current?.closeInspection();
              ref.current?.focus({ preventScroll: true });
            }}
          />
        )}
        {homeScene && sessionRef.current && (
          <HomePanel
            status={status}
            session={sessionRef.current}
            onFocus={() => ref.current?.focus({ preventScroll: true })}
          />
        )}
        {floodScene && sessionRef.current && (
          <FloodPanel
            status={status}
            session={sessionRef.current}
            onFocus={() => ref.current?.focus({ preventScroll: true })}
          />
        )}
        {regionsOpen && status.scene === "CitySquare" && (
          <div
            className="inspection-card region-picker"
            role="dialog"
            aria-label="İkinci gün bölgeleri"
          >
            <h3>İkinci gün · Bölgeni seç</h3>
            <p>
              Bölgeler serbest sırayla seçilecek. Şimdilik yalnızca Dere
              Mahallesi oynanabilir.
            </p>
            <button
              autoFocus
              className="primary"
              onClick={() => {
                setRegionsOpen(false);
                sessionRef.current?.requestFlood();
              }}
            >
              Dere Mahallesi · Sel ve taşkın
            </button>
            {["Çamlık", "Yamaç", "Karlıtepe"].map((name) => (
              <button disabled key={name}>
                {name} · Henüz geliştiriliyor
              </button>
            ))}
            <button onClick={() => setRegionsOpen(false)}>
              Bölge seçimini kapat
            </button>
          </div>
        )}
        {!status.inspection && !homeLocked && !floodLocked && !regionsOpen && (
          <div className="city-bottom story-bottom">
            {dialogue ? (
              <div className="dialogue story-dialogue" aria-live="polite">
                <p>{dialogue.pages[dialogue.index]}</p>
                <div className="dialogue-actions">
                  <small>
                    {dialogue.index + 1}/{dialogue.pages.length}
                  </small>
                  <button
                    className="subtle"
                    onClick={() => sessionRef.current?.skip()}
                    disabled={lastPage && dialogue.accept === "mayor"}
                  >
                    Geç
                  </button>
                  <button
                    className="primary"
                    autoFocus={floodScene}
                    onClick={() => sessionRef.current?.next()}
                  >
                    {lastPage ? (dialogue.label ?? "Tamam") : "Konuşmaya Devam"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {settings.text &&
                  status.scene !== "SchoolClassroom" &&
                  !homeScene &&
                  !floodScene && (
                    <p className="dialogue scene-guidance">
                      {status.scene === "TownHall"
                        ? "AFİ: Nesnelere dokunarak yaklaşabilir veya E / Enter ile inceleyebilirsin."
                        : "AFİ: Belediye kapısından başlayalım. Zemine dokunarak da yürüyebilirsin."}
                    </p>
                  )}
                <button
                  className="primary interact"
                  disabled={!status.nearby || status.transitioning}
                  onClick={() => {
                    if (sessionRef.current)
                      sessionRef.current.controls.interact = true;
                  }}
                >
                  Etkileşim{status.nearby ? ` · ${status.nearby}` : ""}
                </button>
              </>
            )}
          </div>
        )}
        {!dialogue &&
          !status.inspection &&
          !homeLocked &&
          !floodLocked &&
          !regionsOpen && (
            <div className="dpad" aria-label="Dokunmatik yön kontrolü">
              {[
                [0, -1, "↑", "Yukarı"],
                [-1, 0, "←", "Sola"],
                [0, 1, "↓", "Aşağı"],
                [1, 0, "→", "Sağa"],
              ].map(([x, y, s, label]) => (
                <button
                  key={label}
                  aria-label={String(label)}
                  onPointerDown={direction(Number(x), Number(y))}
                  onPointerUp={stop}
                  onPointerCancel={stop}
                  onLostPointerCapture={stop}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
      </div>
      {floodScene && <p className="safety-caption">{FLOOD_SAFETY}</p>}
      {status.scene === "CitySquare" && status.floodUnlocked && (
        <button
          className="primary day-two"
          onClick={() => setRegionsOpen(true)}
        >
          İkinci gün bölgelerini aç
        </button>
      )}
      {homeScene && (
        <p className="safety-caption">
          {HOME_SAFETY} {status.home.evacuation ? status.home.feedback : ""}
        </p>
      )}
      {status.homeUnlocked &&
        !homeScene &&
        !floodScene &&
        !status.floodUnlocked && (
          <p className="next-step" role="status">
            AFİ: Ev görevimiz açıldı. Meydandaki EV YOLU girişinden Çağrı’nın
            evine gidelim.
          </p>
        )}
      {status.scene === "TownHall" && (
        <p className="safety-caption">
          {SAFETY} Tehlikeli işleri yetişkinlere bırak.
        </p>
      )}
      {status.scene === "SchoolClassroom" && (
        <p className="safety-caption">
          {CLASSROOM_SAFETY} Yetişkin uygulamaları bir canlandırmadır.
        </p>
      )}
      {status.schoolVisited && status.scene === "CitySquare" && (
        <p className="next-step" role="status">
          5-A sınıfına giriş hazır · E / Enter ile gir
        </p>
      )}
      <p className="city-help">
        WASD / yön tuşları: yürü · E / Enter: etkileşim · H: ipucu
        {status.scene === "SchoolClassroom" || homeScene || floodScene
          ? " · Q: yakındaki nesne · Tab: seçim"
          : ""}{" "}
        <span>Konsept varlıkları · İlerleme yalnızca açık oturumda.</span>
      </p>
    </div>
  );
}
