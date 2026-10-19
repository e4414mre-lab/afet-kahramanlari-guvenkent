// Isolated scene/component test fixture, served by Vite DEV only. No first-day
// gate claim, teleport, or mutation through QA. Production build excludes it.
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Phaser from "phaser";
import { GameSession } from "../src/game/story";
import { LandslideScene } from "../src/game/LandslideScene";
import { LandslidePanel } from "../src/components/LandslidePanel";
import "../src/styles/app.css";
const settings = {
  voice: false,
  text: false,
  effects: false,
  music: false,
  ambience: false,
  reducedMotion: true,
};
function Fixture() {
  const host = useRef<HTMLDivElement>(null),
    session = useRef<GameSession | null>(null);
  const [status, setStatus] = useState(() =>
    new GameSession(settings, () => {}).status(),
  );
  useEffect(() => {
    const s = new GameSession(settings, setStatus);
    session.current = s;
    const scene = new LandslideScene(s);
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current!,
      width: 1100,
      height: 680,
      scale: { mode: Phaser.Scale.RESIZE, min: { width: 320, height: 400 } },
      scene: [scene],
    });
    window.__guvenkent = () => ({
      status: s.status(),
      ...(scene.children?.length ? scene.diagnostics() : {}),
      textureCount: game.textures.getTextureKeys().length,
      canvasCount: host.current?.querySelectorAll("canvas").length,
      sceneCount: game.scene.getScenes(true).length,
    });
    return () => {
      game.destroy(true);
      delete window.__guvenkent;
    };
  }, []);
  const dir = (x: number, y: number) => {
    if (session.current) {
      session.current.controls.x = x;
      session.current.controls.y = y;
    }
  };
  return (
    <div className="app playing">
      <main>
        <div
          className="city-shell classroom-shell"
          onTouchStart={(e) => {
            if (e.target instanceof Element && e.target.closest("button"))
              e.stopPropagation();
          }}
        >
          <div className="city-top">
            <h2>Yamaç Mahallesi · Bileşen testi</h2>
          </div>
          <div className="city-stage">
            <div ref={host} className="city-canvas" tabIndex={0} />
            <div className="quest-card">
              <small>BİLEŞEN TESTİ</small>
              <span>{status.objective}</span>
            </div>
            <button
              className="afi-hint"
              aria-label="AFİ’den ipucu al"
              onClick={() => session.current?.hint()}
            >
              AFİ ?
            </button>
            {session.current && (
              <LandslidePanel
                session={session.current}
                status={status}
                onFocus={() => host.current?.focus()}
              />
            )}
            {!session.current?.landslide.locked && (
              <>
                <div className="city-bottom story-bottom">
                  {status.dialogue ? (
                    <div className="dialogue story-dialogue">
                      <p>{status.dialogue.pages[status.dialogue.index]}</p>
                      <button
                        className="primary"
                        onClick={() => session.current?.next()}
                      >
                        Tamam
                      </button>
                    </div>
                  ) : (
                    <button
                      className="primary interact"
                      onClick={() => {
                        if (session.current)
                          session.current.controls.interact = true;
                      }}
                    >
                      Etkileşim · {status.nearby}
                    </button>
                  )}
                </div>
                {!status.dialogue && (
                  <div className="dpad">
                    {[
                      [0, -1, "↑", "Yukarı"],
                      [-1, 0, "←", "Sola"],
                      [0, 1, "↓", "Aşağı"],
                      [1, 0, "→", "Sağa"],
                    ].map(([x, y, icon, label]) => (
                      <button
                        key={label}
                        aria-label={String(label)}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.currentTarget.setPointerCapture(e.pointerId);
                          dir(Number(x), Number(y));
                        }}
                        onPointerUp={() => dir(0, 0)}
                        onPointerCancel={() => dir(0, 0)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(<Fixture />);
