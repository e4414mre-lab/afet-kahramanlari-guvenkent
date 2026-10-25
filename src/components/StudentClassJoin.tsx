import { useEffect, useState } from "react";
import {
  SUPABASE,
  studentApi,
  joinClass,
  resumeStudent,
  currentStudent,
  leaveClass,
  type StudentSession,
} from "../lib/classroom";
export function StudentClassJoin({
  token,
  onBack,
  onPlay,
}: {
  token: string;
  onBack: () => void;
  onPlay: () => void;
}) {
  const [demo, setDemo] = useState(false),
    [name, setName] = useState(""),
    [label, setLabel] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [joined, setJoined] = useState<StudentSession | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!SUPABASE) return;
    if (token) {
      setBusy(true);
      studentApi("class_preview", { joinToken: token })
        .then((c) => {
          if (!cancelled) setLabel(c.label);
        })
        .catch((e) => {
          if (!cancelled) setError(e.message);
        })
        .finally(() => {
          if (!cancelled) setBusy(false);
        });
    } else {
      resumeStudent()
        .then((s) => {
          if (!cancelled && s) setJoined(s);
        })
        .catch((e) => {
          if (!cancelled) setError(e.message);
        });
    }
    return () => {
      cancelled = true;
    };
  }, [token]);
  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      setJoined(await joinClass(token, name));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Katılım tamamlanamadı.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="teacher-ui student-join">
      <button onClick={onBack}>← Ana menü</button>
      <div className="student-join-card">
        <img src="/assets/city/afi-concept.png" alt="AFİ" />
        <span className="eyebrow">GÜVENKENT · SINIF KEŞFİ</span>
        <h1>
          {joined
            ? "Keşfe hazırsın"
            : demo
              ? "Örnek sınıf katılımı"
              : label || "Sınıf bağlantısıyla katıl"}
        </h1>
        <p className="teacher-banner">
          {demo
            ? "Demo – veri kaydedilmiyor · Gerçek sınıfa katılmadın."
            : !SUPABASE
              ? "Supabase bağlı değil · Katılım ve sınıf kaydı kapalı."
              : joined
                ? "Oturum sunucuda doğrulandı."
                : "Sınıf ve oturum sunucuda doğrulanacak."}
        </p>
        {busy && <p role="status">Bağlantı kontrol ediliyor…</p>}
        {error && (
          <p role="alert" className="teacher-error">
            {error}
          </p>
        )}
        {joined ? (
          <>
            <p>
              {joined.nickname} · #{joined.code}
            </p>
            <p>{joined.classLabel}</p>
            <button className="primary" onClick={onPlay}>
              Sınıf keşfine başla
            </button>
            <button
              onClick={async () => {
                try {
                  await leaveClass();
                } catch {
                  setError(
                    "Cihaz oturumu kapatıldı; sunucu iptali doğrulanamadı. Oturum en geç 8 saatte biter.",
                  );
                } finally {
                  setJoined(null);
                }
              }}
            >
              Bu cihazdaki oturumu kapat
            </button>
          </>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!demo) submit();
            }}
          >
            <label>
              Adın veya takma adın
              <input
                maxLength={30}
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={(!SUPABASE && !demo) || busy}
              />
            </label>
            <p>
              Soyadını, okul numaranı, telefonunu veya adresini yazma. Takma
              adın kimlik kanıtı değildir; öğretmenin katılım kodunla seni ayırt
              eder.
            </p>
            <button
              className="primary"
              disabled={
                !SUPABASE || !label || demo || busy || name.trim().length < 2
              }
            >
              Sınıfa katıl
            </button>
            {demo && (
              <button
                type="button"
                onClick={async () => {
                  await leaveClass().catch(() => undefined);
                  onPlay();
                }}
              >
                Yerel alıştırmaya geç · Kaydedilmez
              </button>
            )}
          </form>
        )}
        {!joined && (
          <button
            onClick={() => {
              setDemo(!demo);
              setError("");
            }}
          >
            {demo ? "Bağlantı durumuna dön" : "Katılım ekranı örneğini incele"}
          </button>
        )}
        <small>
          Katılım bağlantısı 24 saat, öğrenci oturumu en fazla 8 saat
          geçerlidir. Bağlantı kapatılırsa yeni katılım yapılamaz. Takma adını
          tekrar yazmak eski kayıtlarına erişim vermez.
        </small>
      </div>
    </section>
  );
}
