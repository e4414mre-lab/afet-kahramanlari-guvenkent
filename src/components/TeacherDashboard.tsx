import { useEffect, useState } from "react";
import {
  SUPABASE,
  teacherLogin,
  teacherLogout,
  teacherRpc,
  resetTeacherPassword,
  completePasswordRecovery,
  bestCompleted,
  type ClassInfo,
  type Dashboard,
  type StudentInfo,
  ApiError,
} from "../lib/classroom";
import { DEMO_CLASSES, demoDashboard } from "../lib/teacherDemo";
import {
  HAZARD_NAMES,
  TYPE_NAMES,
  type Hazard,
  type ActivityType,
} from "../data/assessmentPresentation";
export function TeacherDashboard({
  onBack,
  recoveryToken,
}: {
  onBack: () => void;
  recoveryToken?: string;
}) {
  const [activeRecoveryToken, setActiveRecoveryToken] = useState(
    recoveryToken ?? "",
  );
  const [mode, setMode] = useState<"login" | "live" | "demo">(
      recoveryToken ? "login" : "login",
    ),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [recovery, setRecovery] = useState(!!recoveryToken),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [classes, setClasses] = useState<ClassInfo[]>([]),
    [selected, setSelected] = useState<string | null>(null),
    [data, setData] = useState<Dashboard>({ students: [], top5: [] }),
    [detail, setDetail] = useState<StudentInfo | null>(null),
    [tab, setTab] = useState<"progress" | "top5">("progress"),
    [label, setLabel] = useState(""),
    [query, setQuery] = useState(""),
    [sort, setSort] = useState("name"),
    [link, setLink] = useState(""),
    [confirm, setConfirm] = useState<"archive" | "delete" | null>(null);
  const act = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await fn();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Bağlantı kurulamadı. Tekrar dene.",
      );
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        setMode("login");
        setClasses([]);
        setData({ students: [], top5: [] });
        setDetail(null);
      }
    } finally {
      setBusy(false);
    }
  };
  const refresh = async () => setClasses(await teacherRpc("gk_my_classes", {}));
  const open = async (id: string) => {
    setSelected(id);
    setLink("");
    setDetail(null);
    setQuery("");
    setData({ students: [], top5: [] });
    setData(
      mode === "demo"
        ? demoDashboard(id)
        : await teacherRpc("gk_class_dashboard", { p_class: id }),
    );
  };
  useEffect(() => {
    const changed = () =>
      setError(
        navigator.onLine
          ? "Bağlantı geri geldi. Güncelle düğmesiyle sunucu durumunu doğrula."
          : "Çevrimdışısın. Yeni işlem kaydedilmedi.",
      );
    window.addEventListener("offline", changed);
    window.addEventListener("online", changed);
    return () => {
      window.removeEventListener("offline", changed);
      window.removeEventListener("online", changed);
    };
  }, []);
  const enterDemo = () => {
    setMode("demo");
    setClasses(structuredClone(DEMO_CLASSES));
    setSelected(null);
    setData({ students: [], top5: [] });
    setError("");
    setMessage("");
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selected, detail?.id, tab, mode]);
  const current = classes.find((c) => c.id === selected);
  const students = data.students
    .filter((s) =>
      (s.nickname + " " + s.code)
        .toLocaleLowerCase("tr")
        .includes(query.toLocaleLowerCase("tr")),
    )
    .sort((a, b) =>
      sort === "score"
        ? (bestCompleted(b.attempts)?.total ?? -1) -
            (bestCompleted(a.attempts)?.total ?? -1) ||
          a.code.localeCompare(b.code)
        : a.nickname.localeCompare(b.nickname, "tr") ||
          a.code.localeCompare(b.code),
    );
  if (mode === "login")
    return (
      <section className="teacher-login teacher-ui">
        <button onClick={onBack}>← Ana menü</button>
        <div className="teacher-login-grid">
          <div>
            <span className="eyebrow">GÜVENKENT · ÖĞRETMEN ALANI</span>
            <h1>
              Birlikte öğrenmeyi
              <br />
              görünür kıl.
            </h1>
            <p>
              Sınıfının keşiflerini ve güvenli kararlarını takip et. Takma ad
              bir kimlik doğrulaması değildir; aynı adla farklı katılımlar
              olabilir.
            </p>
            <img src="/assets/city/afi-concept.png" alt="AFİ" />
            <p className="teacher-status">
              {SUPABASE
                ? "Supabase yapılandırması var · Giriş sunucuda doğrulanacak."
                : "Supabase bağlı değil · Canlı giriş ve veri kaydı kapalı."}
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              act(async () => {
                if (recovery && activeRecoveryToken) {
                  await completePasswordRecovery(activeRecoveryToken, password);
                  setActiveRecoveryToken("");
                  setMessage("Parola güncellendi. Yeni parolanla giriş yap.");
                  setRecovery(false);
                } else {
                  await teacherLogin(email, password);
                  await refresh();
                  setMode("live");
                }
              });
            }}
          >
            <h2>{recovery ? "Parolanı güvenle yenile" : "Öğretmen girişi"}</h2>
            {!activeRecoveryToken && (
              <label>
                E-posta
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!SUPABASE || busy}
                />
              </label>
            )}
            {(!recovery || activeRecoveryToken) && (
              <label>
                {recovery ? "Yeni parola (en az 12 karakter)" : "Parola"}
                <input
                  type="password"
                  autoComplete={recovery ? "new-password" : "current-password"}
                  minLength={recovery ? 12 : 1}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!SUPABASE || busy}
                />
              </label>
            )}
            <button className="primary" disabled={!SUPABASE || busy}>
              {busy
                ? "Doğrulanıyor…"
                : recovery
                  ? "Yeni parolayı kaydet"
                  : "Güvenli giriş yap"}
            </button>
            {!activeRecoveryToken && (
              <button
                type="button"
                disabled={!SUPABASE || busy || !email}
                onClick={() =>
                  act(async () => {
                    await resetTeacherPassword(email);
                    setMessage(
                      "Hesap uygunsa parola yenileme bağlantısı gönderilir. E-postanı kontrol et.",
                    );
                  })
                }
              >
                Parolamı unuttum
              </button>
            )}
            <p>
              Öğretmen hesabını kurum yöneticisi yetkilendirir. Bu ekran kayıt
              veya öğretmen rolü oluşturmaz.
            </p>
            <button type="button" onClick={enterDemo}>
              Örnek paneli incele
            </button>
            <small>
              Demo – veri kaydedilmiyor. Örnekler gerçek öğrencilere ait
              değildir.
            </small>
            {error && (
              <p role="alert" className="teacher-error">
                {error}
              </p>
            )}
            {message && <p role="status">{message}</p>}
          </form>
        </div>
      </section>
    );
  return (
    <section className="teacher-ui teacher-dashboard">
      <header className="teacher-toolbar">
        <div>
          <span className="eyebrow">GÜVENKENT · ÖĞRETMEN</span>
          <h1>
            {detail
              ? "Öğrenci gelişimi"
              : current
                ? current.label
                : "Sınıflarım"}
          </h1>
        </div>
        <div>
          <button
            onClick={() => {
              setSelected(null);
              setDetail(null);
              setLink("");
            }}
          >
            Sınıf listesi
          </button>
          <button
            onClick={() =>
              act(async () => {
                try {
                  if (mode === "live") await teacherLogout();
                } finally {
                  setMode("login");
                  setPassword("");
                  setClasses([]);
                  setData({ students: [], top5: [] });
                  setSelected(null);
                  setDetail(null);
                  setLink("");
                }
              })
            }
          >
            {mode === "demo" ? "Örnek görünümü kapat" : "Güvenli çıkış"}
          </button>
        </div>
      </header>
      <p
        className={"teacher-banner " + (mode === "demo" ? "demo" : "live")}
        role="status"
      >
        {mode === "demo"
          ? "Demo – veri kaydedilmiyor · Tamamı kurgusal örnek veridir. Supabase girişini veya canlı sınıfı temsil etmez."
          : "Canlı Supabase oturumu · Yalnızca sahibi olduğun sınıflar. Sıralama sunucunun doğruladığı final puanlarına dayanır."}
      </p>
      <p className="teacher-privacy">
        Takma ad kimlik kanıtı değildir. Aynı adları kısa katılım koduyla ayırt
        et; sınıfta sözlü olarak doğrula. Bu prototipte gerçek çocuk verisi
        kullanma.
      </p>
      {busy && <p role="status">Sunucu bekleniyor…</p>}
      {error && (
        <p role="alert" className="teacher-error">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {!selected ? (
        <>
          <div className="teacher-summary">
            <article>
              <span>Sınıf</span>
              <strong>{classes.length}</strong>
            </article>
            <article>
              <span>Katılım</span>
              <strong>{classes.reduce((s, c) => s + c.studentCount, 0)}</strong>
            </article>
            <article>
              <span>Kaynak</span>
              <strong>{mode === "demo" ? "Örnek" : "Sunucu"}</strong>
            </article>
          </div>
          <form
            className="teacher-create"
            onSubmit={(e) => {
              e.preventDefault();
              act(async () => {
                const c = await teacherRpc("gk_create_class", {
                  p_label: label,
                });
                await refresh();
                setSelected(c.id);
                setData({ students: [], top5: [] });
                setLink(location.origin + "/join#class=" + c.joinToken);
                setLabel("");
              });
            }}
          >
            <label>
              Yeni sınıf adı
              <input
                value={label}
                maxLength={60}
                placeholder="Örn. 5-A"
                onChange={(e) => setLabel(e.target.value)}
                disabled={mode === "demo" || busy}
              />
            </label>
            <button
              className="primary"
              disabled={mode === "demo" || busy || label.trim().length < 2}
            >
              Sınıf oluştur
            </button>
            {mode === "demo" && (
              <small>
                Gerçek sınıf oluşturmak için Supabase ve yetkili öğretmen
                oturumu gerekir.
              </small>
            )}
          </form>
          <div className="teacher-classes">
            {classes.map((c) => (
              <button key={c.id} onClick={() => act(() => open(c.id))}>
                <span className="teacher-class-icon">▤</span>
                <h2>{c.label}</h2>
                <p>
                  {c.studentCount} katılım ·{" "}
                  {c.archivedAt
                    ? "Arşivli"
                    : c.joinEnabled
                      ? "Katılım açık"
                      : "Katılım kapalı"}
                </p>
                <span>Sınıfı incele →</span>
              </button>
            ))}
          </div>
          {classes.length === 0 && (
            <p className="teacher-empty">
              Henüz sınıfın yok. İlk sınıfını oluşturabilirsin.
            </p>
          )}
        </>
      ) : detail ? (
        <>
          <button onClick={() => setDetail(null)}>← Sınıfa dön</button>
          <div className="teacher-student-heading">
            <h2>
              {detail.nickname} <small>#{detail.code}</small>
            </h2>
            <p>
              Takma ad ve katılım kodu; doğrulanmış kişisel kimlik değildir.
            </p>
          </div>
          <div className="teacher-summary">
            {["İlk", "Son", "En iyi"].map((l, i) => {
              const a =
                i === 0
                  ? detail.attempts[0]
                  : i === 1
                    ? detail.attempts.at(-1)
                    : bestCompleted(detail.attempts);
              return (
                <article key={l}>
                  <span>{l} tamamlanan sınav</span>
                  <strong>{a ? `${a.total}/300` : "Henüz yok"}</strong>
                </article>
              );
            })}
          </div>
          {detail.attempts.length === 0 ? (
            <p>Henüz tamamlanan sınav yok.</p>
          ) : (
            <>
              <h3>Afetlere göre gelişim</h3>
              <div className="teacher-hazards">
                {bestCompleted(detail.attempts)!.byHazard.map((h) => (
                  <article key={h.hazard}>
                    <h4>{HAZARD_NAMES[h.hazard as Hazard]}</h4>
                    <strong>{h.points}/60</strong>
                    <progress
                      max={60}
                      value={h.points}
                      aria-label={HAZARD_NAMES[h.hazard as Hazard]}
                    />
                    <p>
                      {h.points === 60
                        ? "Güvenli karar ilişkilerini gerekçesiyle anlatmayı denesin."
                        : "Güvenli gözlem, yetişkin desteği ve resmî yönlendirmeyi yeniden ele alın."}
                    </p>
                  </article>
                ))}
              </div>
              <h3>Denemeler ve etkinlik türleri</h3>
              {detail.attempts.map((a, i) => (
                <article className="teacher-attempt" key={a.id}>
                  <h4>
                    {i + 1}. deneme · {a.total}/300
                  </h4>
                  <p>
                    {new Date(a.finishedAt).toLocaleString("tr-TR")} · Havuz{" "}
                    {a.bankVersion}
                  </p>
                  <div className="teacher-stamps">
                    {a.byType.map((t) => (
                      <span key={t.type}>
                        {TYPE_NAMES[t.type as ActivityType]} {t.points}/100
                      </span>
                    ))}
                  </div>
                  <details>
                    <summary>Soru bazında doğru/kısmi/yanlış sonuçlar</summary>
                    {a.answers?.map((r) => (
                      <p key={r.questionId}>
                        {r.questionId} · {r.correct}/{r.total} doğru ·{" "}
                        {r.points}/20 puan
                      </p>
                    ))}
                  </details>
                </article>
              ))}
            </>
          )}
        </>
      ) : (
        <>
          <div className="teacher-class-actions">
            <button
              onClick={() => {
                setTab("progress");
                setDetail(null);
              }}
              aria-pressed={tab === "progress"}
            >
              Öğrenci ilerlemesi
            </button>
            <button
              onClick={() => setTab("top5")}
              aria-pressed={tab === "top5"}
            >
              İlk beş başarı
            </button>
            <button
              disabled={mode === "demo" || busy}
              onClick={() =>
                act(async () => {
                  await open(selected);
                  await refresh();
                })
              }
            >
              Güncelle
            </button>
            <button
              disabled={mode === "demo" || busy}
              onClick={() =>
                act(async () => {
                  const r = await teacherRpc("gk_manage_class", {
                    p_class: selected,
                    p_action: "rotate",
                  });
                  setLink(location.origin + "/join#class=" + r.joinToken);
                  await refresh();
                })
              }
            >
              Bağlantıyı yenile ve aç
            </button>
            <button
              disabled={mode === "demo" || busy}
              onClick={() =>
                act(async () => {
                  await teacherRpc("gk_manage_class", {
                    p_class: selected,
                    p_action: "close",
                  });
                  setLink("");
                  await refresh();
                  setMessage(
                    "Yeni katılım kapatıldı. Mevcut oturumlar arşivlenmedikçe sürer.",
                  );
                })
              }
            >
              Katılımı kapat
            </button>
            <button
              disabled={mode === "demo" || busy}
              onClick={() => setConfirm("archive")}
            >
              Arşivle
            </button>
            <button
              disabled={mode === "demo" || busy}
              onClick={() => setConfirm("delete")}
            >
              Sınıfı sil
            </button>
          </div>
          {link && (
            <div className="teacher-link">
              <strong>Gizli katılım bağlantısı · 24 saat geçerli</strong>
              <input aria-label="Katılım bağlantısı" readOnly value={link} />
              <button
                onClick={() =>
                  act(async () => {
                    await navigator.clipboard.writeText(link);
                    setMessage(
                      "Bağlantı panoya kopyalandı. Yalnız sınıfınla paylaş.",
                    );
                  })
                }
              >
                Bağlantıyı kopyala
              </button>
              <p>
                Eski bağlantı yenileme sonrası geçersizdir. Bu bağlantı erişim
                anahtarıdır; herkese açık yerde paylaşma.
              </p>
            </div>
          )}
          {confirm && (
            <div
              role="alertdialog"
              aria-label="Sınıf işlemini onayla"
              className="teacher-confirm"
            >
              <p>
                {confirm === "delete"
                  ? "Sınıf ve bağlı öğrenci/ilerleme/sınav verileri kalıcı silinir."
                  : "Katılım kapanır, öğrenci oturumları iptal edilir."}
              </p>
              <button onClick={() => setConfirm(null)}>Vazgeç</button>
              <button
                onClick={() =>
                  act(async () => {
                    await teacherRpc("gk_manage_class", {
                      p_class: selected,
                      p_action: confirm,
                    });
                    setConfirm(null);
                    setSelected(null);
                    setData({ students: [], top5: [] });
                    setLink("");
                    await refresh();
                  })
                }
              >
                İşlemi onayla
              </button>
            </div>
          )}
          {tab === "top5" ? (
            <div className="teacher-ranking">
              <span className="eyebrow">
                EN İYİ TAMAMLANMIŞ SINAV · EN FAZLA 300
              </span>
              <h2>İlk beş başarı</h2>
              <p>
                Beraberlikte daha erken tamamlanma, sonra sunucu öğrenci ID
                sırası kullanılır. Yarım sınavlar dahil değildir.
              </p>
              {data.top5.length === 0 ? (
                <p className="teacher-empty">Henüz tamamlanan sınav yok</p>
              ) : (
                <ol>
                  {data.top5.map((s, i) => (
                    <li key={s.student_id}>
                      <span className="teacher-rank">{i + 1}</span>
                      <div>
                        <strong>{s.nickname}</strong>
                        <small>#{s.code}</small>
                      </div>
                      <b>
                        {s.score}
                        <small>/300</small>
                      </b>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ) : (
            <>
              <div className="teacher-filters">
                <label>
                  Takma ad veya kod ara
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <label>
                  Sıralama
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="name">Ada göre</option>
                    <option value="score">En iyi sınava göre</option>
                  </select>
                </label>
              </div>
              <p className="teacher-privacy">
                Bölüm ilerlemesi öğrencinin cihazından bildirilir; doğrulanmış
                başarı puanı değildir. Final puanı sunucuda hesaplanır.
              </p>
              {students.length === 0 ? (
                <p className="teacher-empty">Öğrenci bulunamadı.</p>
              ) : (
                <div className="teacher-students">
                  {students.map((s) => (
                    <article key={s.id}>
                      <div>
                        <h3>
                          {s.nickname} <small>#{s.code}</small>
                        </h3>
                        <span>
                          {
                            s.progress.filter((p) => p.state === "completed")
                              .length
                          }
                          /8 bölüm bildirildi
                        </span>
                      </div>
                      <progress
                        aria-label={s.nickname + " bölüm ilerlemesi"}
                        max={8}
                        value={
                          s.progress.filter((p) => p.state === "completed")
                            .length
                        }
                      />
                      <div className="teacher-scoreline">
                        <span>
                          Son:{" "}
                          {s.attempts.length
                            ? s.attempts.at(-1)!.total + "/300"
                            : "Yok"}
                        </span>
                        <span>
                          En iyi: {bestCompleted(s.attempts)?.total ?? "Yok"}
                        </span>
                      </div>
                      <p>
                        Son etkinlik:{" "}
                        {new Date([s.createdAt,...s.progress.map(p=>p.updatedAt),...s.attempts.map(a=>a.finishedAt),...(s.activeAttempt?[s.activeAttempt.lastAnsweredAt??s.activeAttempt.startedAt]:[])].sort().at(-1)!).toLocaleString('tr-TR')}
                      </p>
                      {s.activeAttempt && (
                        <p>
                          Sınav sürüyor · {s.activeAttempt.answered}/15 yanıt
                        </p>
                      )}
                      <button onClick={() => setDetail(s)}>
                        Gelişimi incele · {s.code}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
}
