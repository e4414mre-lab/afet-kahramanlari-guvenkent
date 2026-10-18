import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { CitySquareScene, type CityControls } from "../game/CitySquareScene";
import type { Settings } from "../lib/settings";
import type { CityStatus } from "../game/cityModel";
export function GamePreview({
  settings,
  onSettings,
  paused,
}: {
  settings: Settings;
  onSettings: () => void;
  paused: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CitySquareScene | null>(null);
  const controls = useRef<CityControls>({ x: 0, y: 0, interact: false });
  const [status, setStatus] = useState<CityStatus>({
    quest: "meet",
    nearby: null,
    dialogue: "Şehir hazırlanıyor…",
  });
  useEffect(() => {
    if (!ref.current) return;
    const scene = new CitySquareScene(settings, controls.current, setStatus);
    sceneRef.current = scene;
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
      scene: [scene],
      render: { antialias: true },
    });
    const reset = () => {
      controls.current.x = 0;
      controls.current.y = 0;
    };
    window.addEventListener("pointerup", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointerup", reset);
      window.removeEventListener("blur", reset);
      game.destroy(true);
    };
  }, []);
  useEffect(() => {
    sceneRef.current?.configure(settings, paused);
  }, [settings, paused]);
  const direction =
    (x: number, y: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      controls.current.x = x;
      controls.current.y = y;
    };
  const stop = () => {
    controls.current.x = 0;
    controls.current.y = 0;
  };
  return (
    <div className="city-shell">
      <div className="city-top">
        <div>
          <span className="eyebrow">GÖRSEL ONAY BEKLEYEN PROTOTİP</span>
          <h2>Güvenkent • Şehir meydanı</h2>
        </div>
        <button onClick={onSettings}>Ayarlar</button>
      </div>
      <div className="city-stage">
        <div
          ref={ref}
          className="city-canvas"
          aria-label="Oynanabilir Güvenkent meydanı"
        />
        <div className="quest-card" role="status">
          <small>İLK KEŞİF {status.quest === "complete" ? "✓" : "•"}</small>
          <span>
            {status.quest === "meet"
              ? "Belediyeye uğra"
              : status.quest === "school"
                ? "Okulun girişine yürü"
                : "Okul çevresi keşfedildi"}
          </span>
        </div>
        <div className="city-bottom">
          <p className="dialogue" aria-live="polite">
            {status.dialogue}
          </p>
          <button
            className="primary interact"
            disabled={!status.nearby}
            onClick={() => {
              controls.current.interact = true;
            }}
          >
            Etkileşim{status.nearby ? ` · ${status.nearby}` : ""}
          </button>
        </div>
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
      </div>
      {status.quest === "complete" && (
        <p className="next-step" role="status">
          Sınıf risk avı giriş noktası · Sonraki fazda açılacak
        </p>
      )}
      <p className="city-help">
        WASD / yön tuşları: yürü · E: etkileşim · Dokun: git{" "}
        <span>Konsept çevre ve geçici karakterler; nihai sanat değildir.</span>
      </p>
    </div>
  );
}
