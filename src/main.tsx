import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentClassJoin } from "./components/StudentClassJoin";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { GamePreview } from "./components/GamePreview";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type Settings,
} from "./lib/settings";
import "./styles/app.css";
const fragment = new URLSearchParams(location.hash.slice(1));
const invitationToken = fragment.get("class") ?? "";
const recoveryToken =
  fragment.get("type") === "recovery"
    ? (fragment.get("access_token") ?? "")
    : "";
if (location.hash)
  history.replaceState({}, "", location.pathname + location.search);
type View = "join" | "home" | "student" | "teacher" | "settings" | "preview";
function App() {
  const [view, setView] = useState<View>(
    recoveryToken
      ? "teacher"
      : invitationToken || location.pathname === "/join"
        ? "join"
        : "home",
  );
  const [returnTo, setReturnTo] = useState<View>("home");
  const [name, setName] = useState("");
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const openSettings = () => {
    setReturnTo(view);
    setView("settings");
  };
  const setSetting = (k: keyof Settings) => {
    const next = { ...settings, [k]: !settings[k] };
    setSettings(next);
    saveSettings(next);
  };
  const keys: [keyof Settings, string][] = [
    ["voice", "🔊 Seslendirme"],
    ["text", "💬 Konuşma balonları"],
    ["ambience", "🌧️ Çevre sesleri"],
    ["music", "🎵 Fon müziği"],
    ["effects", "✨ Oyun efektleri"],
    ["reducedMotion", "♿ Azaltılmış hareket"],
  ];
  const inGame =
    view === "preview" || (view === "settings" && returnTo === "preview");
  return (
    <div className={`app ${view === "preview" ? "playing" : ""}`}>
      <header>
        <strong>
          🛡️ AFET KAHRAMANLARI <small>GÜVENKENT</small>
        </strong>
        <button onClick={openSettings}>⚙️ Ayarlar</button>
      </header>
      <main>
        {inGame && (
          <div
            className={`game-persistent ${view !== "preview" ? "is-paused" : ""}`}
          >
            <button className="subtle" onClick={() => setView("home")}>
              ← Ana menü
            </button>
            <GamePreview
              settings={settings}
              onSettings={openSettings}
              paused={view !== "preview"}
            />
          </div>
        )}
        {view === "home" ? (
          <section className="hero">
            <span className="eyebrow">İLK KEŞİF • ŞEHİR MEYDANI</span>
            <h1>
              Güvenkent seni <em>bekliyor!</em>
            </h1>
            <p>
              Çağrı ve AFİ ile meydanı keşfet. Belediyeye uğra, okuluna giden
              yolu bul.
            </p>
            <div className="actions">
              <button className="primary" onClick={() => setView("student")}>
                Öğrenci olarak başla →
              </button>
              <button onClick={() => setView("teacher")}>
                Öğretmen girişi
              </button>
            </div>
            <button onClick={() => setView("join")}>
              Sınıf bağlantısıyla katıl
            </button>
            <button className="subtle" onClick={() => setView("preview")}>
              Meydan prototipini keşfet
            </button>
            <p className="note">
              Oynanabilir ilk prototip • Görseller onay bekliyor.
            </p>
          </section>
        ) : view === "teacher" ? (
          <TeacherDashboard
            onBack={() => setView("home")}
            recoveryToken={recoveryToken}
          />
        ) : view === "join" ? (
          <StudentClassJoin
            token={invitationToken}
            onBack={() => setView("home")}
            onPlay={() => setView("preview")}
          />
        ) : view !== "preview" ? (
          <section className="panel">
            <button
              className="subtle"
              onClick={() => setView(view === "settings" ? returnTo : "home")}
            >
              {view === "settings" && returnTo === "preview"
                ? "← Oyuna dön"
                : "← Ana menü"}
            </button>
            {view === "student" ? (
              <>
                <h2>Merhaba afet kahramanı!</h2>
                <label htmlFor="name">Adın veya takma adın</label>
                <input
                  id="name"
                  maxLength={30}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örneğin Deniz"
                />
                <button
                  className="primary"
                  disabled={!name.trim()}
                  onClick={() => setView("preview")}
                >
                  Keşfe Başla
                </button>
                <p className="note">
                  Adın yalnızca bu demoda kullanılır. Hesap veya puan kaydı
                  oluşturulmaz.
                </p>
              </>
            ) : (
              <>
                <h2>Ses ve erişilebilirlik</h2>
                <p>
                  Ses dosyaları henüz eklenmedi. Tercihlerin bu cihazda korunur.
                </p>
                <button
                  onClick={() => {
                    const next = {
                      ...settings,
                      voice: false,
                      ambience: false,
                      music: false,
                      effects: false,
                    };
                    setSettings(next);
                    saveSettings(next);
                  }}
                >
                  Sessiz mod
                </button>
                <div className="options">
                  {keys.map(([key, title]) => (
                    <label key={key} className="option">
                      <span>{title}</span>
                      <input
                        type="checkbox"
                        checked={settings[key]}
                        onChange={() => setSetting(key)}
                      />
                    </label>
                  ))}
                </div>
                <p className="note">
                  Görev açıklamaları ve güvenlik uyarıları her durumda yazılı
                  gösterilir.
                </p>
                <button
                  onClick={() => {
                    setSettings(DEFAULT_SETTINGS);
                    saveSettings(DEFAULT_SETTINGS);
                  }}
                >
                  Varsayılanlara dön
                </button>
              </>
            )}
          </section>
        ) : null}
      </main>
      <footer>Güvenkent v0.1 • Eğitim amaçlı prototip</footer>
    </div>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
