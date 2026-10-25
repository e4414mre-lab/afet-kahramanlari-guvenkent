import { Day3Panel } from "./Day3Panel";
import { AvalancheScene } from "../game/AvalancheScene";
import { AvalanchePanel } from "./AvalanchePanel";
import { AVALANCHE_SAFETY } from "../data/avalanche";
import { LandslideScene } from "../game/LandslideScene";
import { LandslidePanel } from "./LandslidePanel";
import { LANDSLIDE_SAFETY } from "../data/landslide";
import { CamlikForestScene } from "../game/CamlikForestScene";
import { ForestPanel } from "./ForestPanel";
import { FOREST_SAFETY } from "../data/forestFire";
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
      new CamlikForestScene(session),
      new AvalancheScene(session),
      new LandslideScene(session),
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
  const day3Locked =
    status.scene === "TownHall" && status.day3.active && status.day3.open;
  const homeScene =
    status.scene === "Home" || status.scene === "GatheringPoint";
  const homeLocked = homeScene && !!sessionRef.current?.home.locked;
  const avalancheScene = status.scene === "Avalanche";
  const avalancheLocked =
    avalancheScene && !!sessionRef.current?.avalanche.locked;
  const landslideScene = status.scene === "Landslide";
  const landslideLocked =
    landslideScene && !!sessionRef.current?.landslide.locked;
  const forestScene = status.scene === "CamlikForest";
  const forestLocked = forestScene && !!sessionRef.current?.forest.locked;
  const floodScene = status.scene === "Flood";
  const floodLocked = floodScene && !!sessionRef.current?.flood.locked;
  const dialogue = status.dialogue;
  useEffect(() => {
    if (
      (status.scene !== "Flood" &&
        status.scene !== "CamlikForest" &&
        status.scene !== "Landslide" &&
        status.scene !== "Avalanche") ||
      !status.dialogue
    )
      return;
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
        if (
          event.target instanceof Element &&
          event.target.closest("button, select")
        )
          event.stopPropagation();
      }}
      className={`city-shell ${status.scene === "SchoolClassroom" || homeScene || floodScene || forestScene || landslideScene || avalancheScene ? "classroom-shell" : ""}`}
    >
      <div className="city-top">
        <div>
          <span className="eyebrow">GÖRSEL ONAY BEKLEYEN PROTOTİP</span>
          <h2>
            {status.scene === "TownHall" && status.day3.active
              ? "Belediye · Güvenkent hazırlık planı"
              : avalancheScene
                ? "Karlıtepe · Çığ farkındalığı"
                : landslideScene
                  ? "Yamaç Mahallesi · Heyelan farkındalığı"
                  : forestScene
                    ? "Çamlık Ormanı · Yangın farkındalığı"
                    : floodScene
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
            avalancheScene
              ? "Oynanabilir Karlıtepe"
              : landslideScene
                ? "Oynanabilir Yamaç Mahallesi"
                : forestScene
                  ? "Oynanabilir Çamlık Ormanı"
                  : floodScene
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
            {status.scene === "TownHall" && status.day3.active
              ? "ÜÇÜNCÜ GÜN · PLANLAMA KAYNAKLARI"
              : avalancheScene
                ? `İKİNCİ GÜN · ${status.avalanche.investigated}/3 ARAŞTIRMA`
                : landslideScene
                  ? `İKİNCİ GÜN · ${status.landslide.investigated}/3 ARAŞTIRMA`
                  : forestScene
                    ? `İKİNCİ GÜN · ${status.forest.investigated}/3 ARAŞTIRMA`
                    : floodScene
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
            {status.scene === "TownHall" && status.day3.active
              ? status.objective
              : avalancheScene
                ? status.objective
                : landslideScene
                  ? status.objective
                  : forestScene
                    ? status.objective
                    : floodScene
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
          disabled={
            day3Locked ||
            status.transitioning ||
            homeLocked ||
            floodLocked ||
            forestLocked ||
            landslideLocked ||
            avalancheLocked
          }
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
        {status.scene === "TownHall" &&
          status.day3.active &&
          sessionRef.current && (
            <Day3Panel
              session={sessionRef.current}
              status={status}
              onFocus={() => ref.current?.focus({ preventScroll: true })}
              onSettings={onSettings}
            />
          )}
        {avalancheScene && sessionRef.current && (
          <AvalanchePanel
            session={sessionRef.current}
            status={status}
            onFocus={() => ref.current?.focus({ preventScroll: true })}
          />
        )}
        {landslideScene && sessionRef.current && (
          <LandslidePanel
            session={sessionRef.current}
            status={status}
            onFocus={() => ref.current?.focus({ preventScroll: true })}
          />
        )}
        {forestScene && sessionRef.current && (
          <ForestPanel
            session={sessionRef.current}
            status={status}
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
              Dere Mahallesi, Çamlık Ormanı, Yamaç Mahallesi ve Karlıtepe
              serbest sırayla oynanabilir.
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
            <button
              className="primary"
              onClick={() => {
                setRegionsOpen(false);
                sessionRef.current?.requestForest();
              }}
            >
              Çamlık · Orman yangını farkındalığı
            </button>
            <button
              className="primary"
              onClick={() => {
                setRegionsOpen(false);
                sessionRef.current?.requestLandslide();
              }}
            >
              Yamaç · Heyelan farkındalığı
            </button>
            <button
              className="primary"
              onClick={() => {
                setRegionsOpen(false);
                sessionRef.current?.requestAvalanche();
              }}
            >
              Karlıtepe · Çığ farkındalığı
            </button>
            <button onClick={() => setRegionsOpen(false)}>
              Bölge seçimini kapat
            </button>
          </div>
        )}
        {!status.inspection &&
          !day3Locked &&
          !homeLocked &&
          !floodLocked &&
          !forestLocked &&
          !landslideLocked &&
          !avalancheLocked &&
          !regionsOpen && (
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
                      autoFocus={
                        floodScene ||
                        forestScene ||
                        landslideScene ||
                        avalancheScene
                      }
                      onClick={() => sessionRef.current?.next()}
                    >
                      {lastPage
                        ? (dialogue.label ?? "Tamam")
                        : "Konuşmaya Devam"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {settings.text &&
                    status.scene !== "SchoolClassroom" &&
                    !homeScene &&
                    !floodScene &&
                    !forestScene &&
                    !landslideScene &&
                    !avalancheScene && (
                      <p className="dialogue scene-guidance">
                        {status.scene === "TownHall"
                          ? "AFİ: Nesnelere dokunarak yaklaşabilir veya E / Enter ile inceleyebilirsin."
                          : "AFİ: Belediye kapısından başlayalım. Zemine dokunarak da yürüyebilirsin."}
                      </p>
                    )}
                  <button
                    className={`primary interact${avalancheScene ? " avalanche-interact" : ""}`}
                    disabled={!status.nearby || status.transitioning}
                    onClick={() => {
                      if (sessionRef.current)
                        sessionRef.current.controls.interact = true;
                    }}
                  >
                    {avalancheScene ? (
                      <>
                        Etkileşim ·{" "}
                        {status.nearby === "Çığ Uzmanı Zeynep"
                          ? "Uzmandan bilgi al"
                          : status.nearby === "Uzman hazırlık panosu"
                            ? "Güvenli rota planını incele"
                            : status.nearby === "Meydana dön"
                              ? "Meydana güvenle dön"
                              : status.nearby
                                ? "Güvenli yerden incele"
                                : "Gözlem noktasına yürü"}
                        <small>
                          {status.nearby ??
                            "Kapalı yola ve karlı yamaca girme."}
                        </small>
                      </>
                    ) : (
                      <>Etkileşim{status.nearby ? ` · ${status.nearby}` : ""}</>
                    )}
                  </button>
                </>
              )}
            </div>
          )}
        {!dialogue &&
          !status.inspection &&
          !day3Locked &&
          !homeLocked &&
          !floodLocked &&
          !forestLocked &&
          !landslideLocked &&
          !avalancheLocked &&
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
      {avalancheScene && (
        <>
          <p className="safety-caption">{AVALANCHE_SAFETY}</p>
          <label className="avalanche-audio">
            Okuma sesi düzeyi{" "}
            <select
              aria-label="Karlıtepe okuma sesi düzeyi"
              disabled={!settings.voice}
              value={status.avalanche.voiceVolume}
              onChange={(e) => {
                sessionRef.current?.avalanche.setVoiceVolume(
                  Number(e.target.value) === 0.25 ? 0.25 : 0.5,
                );
                sessionRef.current?.notify();
              }}
            >
              <option value={0.25}>Düşük</option>
              <option value={0.5}>Normal</option>
            </select>
            {!settings.voice && <small> · Seslendirme kapalı</small>}
          </label>
        </>
      )}
      {landslideScene && (
        <>
          <p className="safety-caption">{LANDSLIDE_SAFETY}</p>
          <label className="landslide-audio">
            Okuma sesi düzeyi{" "}
            <select
              aria-label="Yamaç okuma sesi düzeyi"
              disabled={!settings.voice}
              value={status.landslide.voiceVolume}
              onChange={(e) => {
                sessionRef.current?.landslide.setVoiceVolume(
                  Number(e.target.value) === 0.25 ? 0.25 : 0.5,
                );
                sessionRef.current?.notify();
              }}
            >
              <option value={0.25}>Düşük</option>
              <option value={0.5}>Normal</option>
            </select>
            {!settings.voice && <small> · Seslendirme kapalı</small>}
          </label>
        </>
      )}
      {forestScene && <p className="safety-caption">{FOREST_SAFETY}</p>}
      {floodScene && <p className="safety-caption">{FLOOD_SAFETY}</p>}
      {status.scene === "CitySquare" && status.day3Unlocked && (
        <button
          className="primary day-two"
          onClick={() => sessionRef.current?.requestDay3()}
        >
          Üçüncü gün · Belediye planlamasına git
        </button>
      )}
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
        !forestScene &&
        !landslideScene &&
        !avalancheScene &&
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
        {status.scene === "SchoolClassroom" ||
        homeScene ||
        floodScene ||
        forestScene ||
        landslideScene ||
        avalancheScene
          ? " · Q: yakındaki nesne · Tab: seçim"
          : ""}{" "}
        <span>Konsept varlıkları · İlerleme yalnızca açık oturumda.</span>
      </p>
    </div>
  );
}
