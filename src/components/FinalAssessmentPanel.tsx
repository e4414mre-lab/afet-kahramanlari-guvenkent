import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import type { GameSession, GameStatus } from "../game/story";
import { newExamSeed } from "../game/finalAssessmentFlow";
import {
  HAZARDS,
  HAZARD_NAMES,
  HAZARD_ART,
  TYPE_NAMES,
  type FinalAnswer,
  type FinalQuestion,
} from "../data/finalAssessment";
class AssessmentBoundary extends Component<
  { children: ReactNode; close: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="final-view final-recovery" role="alert">
        <h3>Etkinlik görünümü açılamadı</h3>
        <p>
          Yanıtların bu açık oturumda korunuyor. Aynı denemeye geri
          dönebilirsin.
        </p>
        <button onClick={() => this.setState({ failed: false })}>
          Görünümü yeniden aç
        </button>
        <button onClick={this.props.close}>Belediye raporuna dön</button>
      </section>
    ) : (
      this.props.children
    );
  }
}
export function FinalAssessmentPanel(props: {
  session: GameSession;
  status: GameStatus;
  onSettings: () => void;
}) {
  if (!props.status.finalAssessment.open) return null;
  return (
    <AssessmentBoundary close={() => props.session.closeFinalAssessment()}>
      <AssessmentView {...props} />
    </AssessmentBoundary>
  );
}
function AssessmentView({
  session,
  status,
  onSettings,
}: {
  session: GameSession;
  status: GameStatus;
  onSettings: () => void;
}) {
  const s = status.finalAssessment,
    f = session.finalAssessment,
    ref = useRef<HTMLElement>(null),
    body = useRef<HTMLDivElement>(null);
  const q = s.question;
  useEffect(() => {
    ref.current
      ?.querySelector<HTMLElement>("#final-heading")
      ?.focus({ preventScroll: true });
    body.current?.scrollTo(0, 0);
  }, [s.phase, s.index, s.seed]);
  useEffect(() => {
    window.speechSynthesis?.cancel();
    return () => window.speechSynthesis?.cancel();
  }, [s.index, s.seed, session.settings.voice, session.paused]);
  const act = (fn: () => void) => {
    fn();
    session.notify();
  };
  const read = () => {
    if (!q || !session.settings.voice || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(
      q.type === "true_false" ? q.statement : q.instruction,
    );
    u.lang = "tr-TR";
    u.volume = 0.5;
    window.speechSynthesis.speak(u);
  };
  const close = () => {
    window.speechSynthesis?.cancel();
    session.closeFinalAssessment();
  };
  return (
    <section
      ref={ref}
      className="final-view"
      role="dialog"
      aria-modal="true"
      aria-labelledby="final-heading"
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          close();
        }
        if (e.key === "Tab") {
          const a = Array.from(
              ref.current?.querySelectorAll<HTMLElement>(
                'button:not(:disabled),[tabindex="0"]',
              ) ?? [],
            ).filter((el) => el.getClientRects().length > 0),
            first = a[0],
            last = a.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      <header className="final-header">
        <div>
          <span className="eyebrow">GÜVENKENT · BİRLİKTE ÖĞRENDİK</span>
          <h3 id="final-heading" tabIndex={-1}>
            {s.phase === "intro"
              ? "Son keşfe hazır mısın?"
              : s.phase === "result"
                ? "Güvenkent öğrenme yolculuğun"
                : `${s.index + 1}. etkinlik · ${q ? TYPE_NAMES[q.type] : ""}`}
          </h3>
        </div>
        <div className="final-header-actions">
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              onSettings();
            }}
          >
            Ayarlar
          </button>
          <button aria-label="Belediye raporuna dön" onClick={close}>
            ×
          </button>
        </div>
      </header>
      <div className="final-progress">
        <span>{s.answered}/15 etkinlik yanıtlandı</span>
        <strong>{s.points} / 300 değerlendirme puanı</strong>
        <progress
          aria-label="Yanıtlanan etkinlikler"
          max={15}
          value={s.answered}
        />
      </div>
      <div className="final-body" ref={body}>
        {s.phase === "intro" ? (
          <div className="final-intro">
            <div className="final-hero">
              <img
                className="final-cagri"
                src="/assets/city/cagri-concept.png"
                alt="Çağrı"
              />
              <img
                className="final-afi"
                src="/assets/city/afi-concept.png"
                alt="AFİ"
              />
              <div>
                <span className="eyebrow">BEŞ AFET · ÜÇ OYUN BİÇİMİ</span>
                <h4>Bildiklerini güvenli kararlarla birleştir.</h4>
                <p>
                  AFİ: Birlikte 15 etkinlik yapacağız. Acele yok; düşünmek ve
                  yardım istemek serbest.
                </p>
              </div>
            </div>
            <div className="final-intro-cards">
              {["5 Doğru–Yanlış", "5 Eşleştirme", "5 Kart yerleştirme"].map(
                (x, i) => (
                  <article key={x}>
                    <span className="final-number">0{i + 1}</span>
                    <h5>{x}</h5>
                    <p>
                      {
                        [
                          "İfadeyi oku ve kararını ver.",
                          "Durumu uygun güvenli davranışla birleştir.",
                          "Kartı seç, sonra hedefe dokun. Sürüklemek de mümkün.",
                        ][i]
                      }
                    </p>
                  </article>
                ),
              )}
            </div>
            <p className="final-note">
              Her etkinlik en fazla 20 puan. Toplam 300 değerlendirme puanı,
              belediyedeki 1.000 planlama puanından ayrıdır. Eşleştirmede ve
              kart yerleştirmede kısmi puan alabilirsin.
            </p>
            <p>
              İlk yanıtın değerlendirilir. Yanıt sonrasında açıklamayı okuyup
              puansız alıştırma yapabilirsin; yeni bir sınav da deneyebilirsin.
              Yanlış yanıt bitirmene engel olmaz. Üç katmanlı ipucu isteğe
              bağlıdır.
            </p>
            <div className="final-stamps">
              {HAZARDS.map((h) => (
                <span key={h}>{HAZARD_NAMES[h]}</span>
              ))}
            </div>
          </div>
        ) : s.phase === "activity" && q ? (
          <>
            <div className="final-context">
              <img src={HAZARD_ART[q.hazard]} alt="" />
              <div>
                <span className="eyebrow">
                  {HAZARD_NAMES[q.hazard]} ·{" "}
                  {{ easy: "Kolay", medium: "Orta", hard: "Zor" }[q.difficulty]}
                </span>
                <p>
                  Güvenli konumdan düşün. Tehlikeli işleri yetkili yetişkinlere
                  bırak.
                </p>
              </div>
              <img
                className="final-guide"
                src="/assets/city/afi-concept.png"
                alt="AFİ rehberin"
              />
            </div>
            <Activity
              key={`${s.seed}-${q.id}`}
              question={q}
              session={session}
              status={status}
            />
            <div className="final-hints">
              <button
                disabled={s.hintLevel === 3}
                onClick={() => act(() => f.hint())}
              >
                AFİ’den ipucu {s.hintLevel}/3
              </button>
              {s.hint && <p role="status">{s.hint}</p>}
              <button
                disabled={
                  !session.settings.voice || !("speechSynthesis" in window)
                }
                onClick={read}
              >
                Soruyu sesli oku
              </button>
              <small>Tarayıcı Türkçe sesi varsa kullanılır.</small>
            </div>
          </>
        ) : s.last ? (
          <div className="final-results">
            <div className="final-result-hero">
              <img src="/assets/city/cagri-concept.png" alt="Çağrı" />
              <div>
                <span className="eyebrow">15 ETKİNLİK TAMAMLANDI</span>
                <h4>Her güvenli karar bir kazanım.</h4>
                <strong className="final-total">
                  {s.last.total}
                  <small> / 300 puan</small>
                </strong>
                <p>
                  AFİ: Puanın ne olursa olsun, gerekçeleri düşünmek öğrenmenin
                  bir parçası. İstersen yeni etkinliklerle tekrar deneyebiliriz.
                </p>
              </div>
              <img src="/assets/city/afi-concept.png" alt="AFİ" />
            </div>
            <div className="final-history">
              <span>
                İlk sınav <b>{s.first?.total}/300</b>
              </span>
              <span>
                Son sınav <b>{s.last.total}/300</b>
              </span>
              <span>
                En iyi sınav <b>{s.best?.total}/300</b>
              </span>
            </div>
            <h4>Etkinlik türlerine göre</h4>
            <div className="final-type-results">
              {s.last.byType.map((t) => (
                <article key={t.type}>
                  <h5>{TYPE_NAMES[t.type]}</h5>
                  <strong>
                    {t.points} / {t.maximum}
                  </strong>
                  <progress
                    aria-label={TYPE_NAMES[t.type]}
                    max={t.maximum}
                    value={t.points}
                  />
                </article>
              ))}
            </div>
            <h4>Bir sonraki keşfinde</h4>
            <div className="final-hazard-results">
              {s.last.byHazard.map((h) => (
                <article key={h.hazard}>
                  <img src={HAZARD_ART[h.hazard]} alt="" />
                  <div>
                    <h5>
                      {HAZARD_NAMES[h.hazard]} · {h.points}/60
                    </h5>
                    <p>
                      {h.points === 60
                        ? "Güvenli kararları doğru ilişkilendirdin. Farklı durumlarda gerekçeleri de anlatmayı dene."
                        : `Bu konudaki durum–davranış ilişkilerini yeniden incele. ${HAZARD_ADVICE[h.hazard]}`}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <p className="final-note">
              Bu sonuç yalnızca açık oyun oturumunda saklanır. Resmî sertifika
              değildir; bir sınıf liderliğine veya öğretmen paneline
              gönderilmedi. Yeniden denemeler toplam puan biriktirmez.
            </p>
            <small>
              Deneme {s.last.id} · Tohum {s.last.seed} · Havuz{" "}
              {s.last.bankVersion}
            </small>
          </div>
        ) : null}
        {s.error && (
          <p role="alert" className="final-feedback">
            {s.error}
          </p>
        )}
      </div>
      <footer className="final-footer">
        <small>
          Güvenli davranışları düşün · Hazırlık riski tamamen yok etmez.
        </small>
        <div>
          {s.phase === "intro" ? (
            <button
              className="primary"
              onClick={() => act(() => f.start(newExamSeed()))}
            >
              15 etkinliğe başla
            </button>
          ) : s.phase === "result" ? (
            <>
              <button onClick={close}>Belediye raporuna dön</button>
              <button
                className="primary"
                onClick={() => act(() => f.retry(newExamSeed()))}
              >
                Yeni sınav dene
              </button>
            </>
          ) : (
            <>
              <button
                disabled={s.index === 0}
                onClick={() => act(() => f.move(-1))}
              >
                Önceki etkinlik
              </button>
              {s.index < 14 ? (
                <button
                  className="primary"
                  disabled={!s.record}
                  onClick={() => act(() => f.move(1))}
                >
                  Sonraki etkinlik
                </button>
              ) : (
                <button
                  className="primary"
                  disabled={s.answered !== 15}
                  onClick={() => act(() => f.finalize())}
                >
                  Sonucumu gör
                </button>
              )}
            </>
          )}
        </div>
      </footer>
    </section>
  );
}
const HAZARD_ADVICE = {
  earthquake:
    "Çök–Kapan–Tutun, yetişkin sabitlemesi ve kontrollü tahliyeyi hatırla.",
  flood: "Suya girme; uyarı ve güvenli rotayı izle.",
  wildfire: "Dumana yaklaşma; güvenli yerden yetişkine bildir.",
  landslide: "Çatlaklara yaklaşma; incelemeyi uzmanlara bırak.",
  avalanche: "Kapalı yola ve dik karlı yamaca girme; resmî rotayı izle.",
};
function Activity({
  question: q,
  session,
  status,
}: {
  question: FinalQuestion;
  session: GameSession;
  status: GameStatus;
}) {
  const s = status.finalAssessment,
    record = s.record;
  const [answer, setAnswer] = useState<FinalAnswer>(
      record?.answer ?? s.draft ?? {},
    ),
    [selected, setSelected] = useState<string | null>(null),
    [practicing, setPracticing] = useState(false);
  const feedback = useRef<HTMLDivElement>(null),
    pointer = useRef<{
      id: string;
      x: number;
      y: number;
      dragged: boolean;
    } | null>(null);
  const locked = !!record && !practicing;
  useEffect(() => {
    if (!record && !practicing) session.finalAssessment.saveDraft(answer);
  }, [answer, record, practicing, session]);
  const assign = (source: string, target: string) => {
    if (locked) return;
    setAnswer((old) => {
      const next = typeof old === "object" ? { ...old } : {};
      if (q.type === "matching")
        for (const id of Object.keys(next))
          if (next[id] === target) delete next[id];
      next[source] = target;
      return next;
    });
    setSelected(null);
  };
  const submit = () => {
    if (practicing) session.finalAssessment.practice(answer);
    else session.finalAssessment.submit(answer);
    session.notify();
    requestAnimationFrame(() =>
      feedback.current?.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      }),
    );
  };
  const map = typeof answer === "object" ? answer : {};
  return (
    <div
      className="final-activity"
      data-question-id={q.id}
      data-question-type={q.type}
    >
      <h4>{q.type === "true_false" ? q.statement : q.instruction}</h4>
      {q.type === "true_false" ? (
        <div className="final-tf">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              data-tf={String(v)}
              aria-pressed={answer === v}
              disabled={locked}
              onClick={() => setAnswer(v)}
            >
              <span>{v ? "✓" : "×"}</span>
              {v ? "Doğru" : "Yanlış"}
            </button>
          ))}
        </div>
      ) : q.type === "matching" ? (
        <>
          <p className="final-instruction">
            Bir durum kartını, ardından uygun davranışı seç. Bir davranış
            yalnızca bir durumla eşleşir. Eşleşmeyi değiştirmek için yeniden
            seç.
          </p>
          <div className="final-match">
            <div>
              <h5>Durumlar</h5>
              {q.pairs.map((p, i) => (
                <button
                  data-source={p.id}
                  key={p.id}
                  disabled={locked}
                  aria-pressed={selected === p.id}
                  onClick={() => setSelected(p.id)}
                >
                  <b>{i + 1}</b>
                  <span>
                    {p.left}
                    <small>
                      {map[p.id]
                        ? `→ ${q.pairs.find((t) => t.id === map[p.id])?.right}`
                        : "Henüz eşleşmedi"}
                    </small>
                  </span>
                </button>
              ))}
            </div>
            <div>
              <h5>Güvenli davranışlar</h5>
              {s.cardOrder.map((id) => {
                const p = q.pairs.find((p) => p.id === id)!;
                return (
                  <button
                    data-target={id}
                    key={id}
                    disabled={locked || !selected}
                    onClick={() => selected && assign(selected, id)}
                  >
                    {p.right}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="final-instruction">
            Kartı seç → hedefe dokun. Klavyeyle Tab ve Enter kullan. İstersen
            kartı hedefe sürükle. Her iki kartı da yerleştir.
          </p>
          <div className="final-drag-cards">
            {s.cardOrder.map((id) => {
              const item = q.items.find((i) => i.id === id)!;
              return (
                <button
                  key={id}
                  data-source={id}
                  className="final-drag-card"
                  disabled={locked}
                  aria-pressed={selected === id}
                  onClick={() => setSelected(id)}
                  onPointerDown={(e) => {
                    if (locked) return;
                    pointer.current = {
                      id,
                      x: e.clientX,
                      y: e.clientY,
                      dragged: false,
                    };
                    e.currentTarget.setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    const p = pointer.current;
                    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) {
                      p.dragged = true;
                      setSelected(p.id);
                    }
                  }}
                  onPointerCancel={() => {
                    pointer.current = null;
                    setSelected(null);
                  }}
                  onPointerUp={(e) => {
                    const p = pointer.current;
                    pointer.current = null;
                    if (!p?.dragged) return;
                    const target = document
                      .elementFromPoint(e.clientX, e.clientY)
                      ?.closest<HTMLElement>("[data-drop-zone]");
                    if (target) {
                      assign(p.id, target.dataset.dropZone!);
                      e.preventDefault();
                    }
                  }}
                >
                  <span aria-hidden="true">⠿</span>
                  <span>
                    {item.text}
                    <small>
                      {map[id]
                        ? `→ ${q.zones.find((z) => z.id === map[id])?.label}`
                        : "Henüz yerleşmedi"}
                    </small>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="final-zones">
            {q.zones.map((z) => (
              <button
                key={z.id}
                data-drop-zone={z.id}
                data-target={z.id}
                disabled={locked || !selected}
                onClick={() => selected && assign(selected, z.id)}
              >
                <strong>{z.label}</strong>
                <span>
                  {q.items
                    .filter((i) => map[i.id] === z.id)
                    .map((i) => i.text)
                    .join(" · ") || "Kartı buraya yerleştir"}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
      <p className="final-selection" role="status">
        {selected
          ? "Kart seçildi. Şimdi uygun hedefi seç."
          : locked
            ? "İlk yanıtın kaydedildi."
            : q.type === "true_false"
              ? "Bir yanıt seç, sonra kontrol et."
              : "Eşleşmeleri kontrol edip yanıtını gönder."}
      </p>
      {!locked && (
        <button className="primary final-submit" onClick={submit}>
          {practicing ? "Alıştırmayı kontrol et" : "Yanıtımı kontrol et"}
        </button>
      )}
      {record && (
        <div ref={feedback} className="final-feedback" aria-live="polite">
          <h5>
            {record.correct === record.total
              ? "✓ Doğru ilişkilendirdin"
              : record.correct === 0
                ? "↻ Birlikte yeniden düşünelim"
                : "◐ Bazı ilişkiler doğru"}
          </h5>
          <strong>
            İlk yanıt: {record.correct}/{record.total} doğru · {record.points}
            /20 puan
          </strong>
          <p>{q.explanation}</p>
          {record.practiceCorrect !== null && (
            <p>
              Alıştırma: {record.practiceCorrect}/{record.total} doğru. İlk
              yanıt puanın değişmedi.
            </p>
          )}
          <button
            onClick={() => {
              setPracticing(true);
              setSelected(null);
              setAnswer(q.type === "true_false" ? {} : {});
              requestAnimationFrame(() =>
                document
                  .querySelector(".final-activity h4")
                  ?.scrollIntoView({ block: "start" }),
              );
            }}
          >
            Puansız yeniden dene
          </button>
        </div>
      )}
    </div>
  );
}
