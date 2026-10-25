import { Component, useEffect, useRef, type ReactNode } from "react";
import type { GameSession, GameStatus } from "../game/story";
import {
  DAY3_SAFETY,
  MEASURES,
  REGIONS,
  REASONS,
  afiUnfundedFeedback,
} from "../data/day3";
class PlanningBoundary extends Component<
  { children: ReactNode; close: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="day3-view" role="alert">
        <h3>Planlama görünümü açılamadı</h3>
        <p>
          Planın bu açık oturumda korunuyor. Yeniden deneyebilir veya belediye
          odasına dönebilirsin.
        </p>
        <button onClick={() => this.setState({ failed: false })}>
          Tekrar dene
        </button>
        <button onClick={this.props.close}>Belediye odasına dön</button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export function Day3Panel(props: {
  session: GameSession;
  status: GameStatus;
  onFocus: () => void;
  onSettings: () => void;
}) {
  if (!props.status.day3.open) return null;
  const close = () => {
    props.session.day3.close();
    props.session.notify();
    props.onFocus();
  };
  return (
    <PlanningBoundary close={close}>
      <PlanningView {...props} close={close} />
    </PlanningBoundary>
  );
}
function PlanningView({
  session,
  status,
  onFocus,
  onSettings,
  close,
}: {
  session: GameSession;
  status: GameStatus;
  onFocus: () => void;
  onSettings: () => void;
  close: () => void;
}) {
  const s = status.day3,
    f = session.day3,
    ref = useRef<HTMLDivElement>(null),
    body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (s.open) {
      (
        ref.current?.querySelector<HTMLElement>("[data-day3-focus]") ??
        ref.current?.querySelector<HTMLElement>("#day3-heading")
      )?.focus({ preventScroll: true });
      body.current?.scrollTo(0, 0);
    }
  }, [s.step, s.open]);
  useEffect(() => {
    if (s.budgetError)
      ref.current
        ?.querySelector<HTMLElement>("[data-budget-error]")
        ?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [s.budgetError?.measureId, s.budgetError?.remaining]);
  if (!s.open) return null;
  const act = (fn: () => void) => {
    fn();
    session.notify();
  };
  const region = REGIONS.find((r) => r.id === s.region)!;
  const outcome = s.outcomes.find((r) => r.region === s.region)!;
  const planning = s.step === "planning" || s.step === "replanning";
  const labels = {
    briefing: "Birlikte planlayalım",
    consulting: "Dört bölgeyi dinle",
    planning: "Kaynaklarını paylaştır",
    simulating: "Aynı koşullar, yeni plan",
    comparing: "Planın etkilerini incele",
    replanning: "Planını yeniden düşün",
    finalized: "Güvenkent belediye raporu",
  };
  const allocation = s.allocations.find((a) => a.region === s.region)!;
  const unfunded =
    (planning || s.step === "comparing") && allocation.spent === 0;
  const allocationSummary = (
    <figure
      className="day3-allocation"
      aria-label="Dört bölgeye ayrılan planlama puanları"
    >
      <figcaption>
        Bölgelere ayrılan kaynak · Toplam harcanan {s.spentBudget} / 1.000 puan
      </figcaption>
      <ul>
        {s.allocations.map((a) => (
          <li key={a.region}>
            <span>{a.name}</span>
            <strong>{a.spent} puan</strong>
            <span className="day3-allocation-track" aria-hidden="true">
              <span style={{ width: `${a.spent / 10}%` }} />
            </span>
          </li>
        ))}
      </ul>
      <small>
        Çubuklar 1.000 planlama puanına göredir; afet riski göstermez. Kalan:{" "}
        {s.remainingBudget} puan.
      </small>
    </figure>
  );
  const picked = MEASURES.filter((m) => s.selectedIds.includes(m.id));
  return (
    <section
      ref={ref}
      className="day3-view"
      role="dialog"
      aria-modal="true"
      aria-labelledby="day3-heading"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          close();
        }
        if (e.key === "Tab") {
          const a = [
            ...ref.current!.querySelectorAll<HTMLElement>(
              "button:not(:disabled),input,select,textarea",
            ),
          ].filter((el) => el.getClientRects().length);
          if (e.shiftKey && document.activeElement === a[0]) {
            e.preventDefault();
            a.at(-1)?.focus();
          } else if (!e.shiftKey && document.activeElement === a.at(-1)) {
            e.preventDefault();
            a[0]?.focus();
          }
        }
      }}
    >
      <header className="day3-header">
        <div>
          <small>3. GÜN · HARİTA MASASI · STRATEJİ GÖRÜNÜMÜ</small>
          <h3 id="day3-heading" tabIndex={-1}>
            {labels[s.step]}
          </h3>
        </div>
        <button aria-label="Planlama ayarları" onClick={onSettings}>
          Ayarlar
        </button>
        <button aria-label="Planlamayı kapat" onClick={close}>
          ×
        </button>
      </header>
      <div className="day3-budget" role="status" aria-live="polite">
        <div>
          <strong>{s.remainingBudget.toLocaleString("tr-TR")}</strong>
          <span> / 1.000 planlama puanı kaldı</span>
        </div>
        <small>
          Harcanan {s.spentBudget} puan · {s.selectedIds.length}/12 önlem ·
          Deneme {s.planRevision}
        </small>
        <meter
          min={0}
          max={1000}
          value={s.remainingBudget}
          aria-label="Kalan planlama puanı"
        />
      </div>
      {s.step !== "briefing" && s.step !== "finalized" && (
        <nav className="day3-regions" aria-label="Planlama bölgeleri">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              aria-pressed={s.region === r.id}
              data-day3-focus
              onClick={() => {
                act(() => f.viewRegion(r.id));
                body.current?.scrollTo(0, 0);
              }}
            >
              <img
                src={`/assets/${r.id === "wildfire" ? "forest" : r.id === "flood" ? "flood" : r.id === "landslide" ? "landslide" : "avalanche"}/area.png`}
                alt=""
              />
              <span>
                {r.name}
                <small>
                  {s.step === "consulting"
                    ? s.consulted.includes(r.id)
                      ? "Görüş alındı"
                      : "Uzman görüşü"
                    : s.step === "comparing"
                      ? s.viewed.includes(r.id)
                        ? "İncelendi"
                        : "Raporu incele"
                      : `${picked.filter((m) => m.region === r.id).length}/3 önlem`}
                  {s.step !== "consulting" &&
                    ` · ${s.allocations.find((a) => a.region === r.id)!.spent} puan`}
                </small>
                {s.step !== "consulting" && (
                  <span className="day3-nav-allocation" aria-hidden="true">
                    <span
                      style={{
                        width: `${s.allocations.find((a) => a.region === r.id)!.spent / 10}%`,
                      }}
                    />
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>
      )}
      <div className="day3-body" ref={body}>
        {unfunded && (
          <aside className="day3-afi" aria-label="AFİ ile düşün">
            <strong>AFİ ile düşün</strong>
            <p>{afiUnfundedFeedback(s.region)}</p>
          </aside>
        )}
        {s.step === "briefing" && (
          <div className="day3-welcome">
            <img
              src="/assets/town-hall/plan-concept.png"
              alt="Belediyenin mevcut Güvenkent harita masası"
            />
            <div>
              <span className="eyebrow">GÜVENKENT AFET HAZIRLIK PLANI</span>
              <h4>Sınırlı kaynak, düşünülmüş kararlar</h4>
              <p>
                AFİ: Her öneri önemli ama kaynaklarımız sınırlı. Önce dört
                bölgenin ihtiyaçlarını karşılaştıralım.
              </p>
              <p>
                Belediye Başkanı: Bu bir eğitim planlamasıdır; gerçek kararlarda
                uzmanlar ve yetkili kurumlar görev alır.
              </p>
              <button
                className="primary"
                data-day3-focus
                onClick={() =>
                  act(() => {
                    f.beginConsulting();
                    f.consult();
                  })
                }
              >
                Bölge raporlarını incele
              </button>
            </div>
          </div>
        )}
        {s.step === "consulting" && (
          <article className="day3-expert">
            <span className="eyebrow">
              BÖLGE DANIŞMASI · {s.consulted.length}/4
            </span>
            <h4>{region.name}</h4>
            <blockquote>
              <strong>{region.expert}</strong>
              <p>{region.note}</p>
            </blockquote>
            <p>
              Bu bölgedeki üç hazırlık önerisini bütçe aşamasında
              karşılaştırabilirsin. Görüş almak otomatik satın alma yapmaz.
            </p>
            <button
              className="primary"
              disabled={s.consulted.length < 4}
              onClick={() => act(() => f.plan())}
            >
              1.000 puanla planlamaya başla
            </button>
            <p className="day3-note">
              Önce üstteki dört bölgenin görüşünü oku. Tek bir doğru dağılım
              yok.
            </p>
          </article>
        )}
        {planning && (
          <>
            <div className="day3-section-title">
              <h4>{region.name}</h4>
              <span>
                {region.expert}: {region.note}
              </span>
            </div>
            <div className="day3-measures">
              {MEASURES.filter((m) => m.region === s.region).map((m) => {
                const checked = s.selectedIds.includes(m.id),
                  pending = s.pending === m.id;
                return (
                  <article
                    className={`day3-measure ${checked ? "is-picked" : ""}`}
                    key={m.id}
                  >
                    <div>
                      <small>{m.id} · YETKİLİ EKİPLERİN ÖNLEMİ</small>
                      <h5>{m.label}</h5>
                      <p>{m.benefit}</p>
                      {checked && <small>Gerekçem: {s.reasons[m.id]}</small>}
                    </div>
                    <aside>
                      <strong>
                        {m.cost}
                        <small> puan</small>
                      </strong>
                      <button
                        aria-label={`${checked ? "Geri al" : "Seç"} ${m.id}`}
                        aria-pressed={checked}
                        onClick={() => act(() => f.choose(m.id))}
                      >
                        {checked ? "Geri al" : "Seç"}
                      </button>
                    </aside>
                    {s.budgetError?.measureId === m.id && (
                      <div
                        className="day3-insufficient"
                        role="alert"
                        data-budget-error
                      >
                        <strong>Planlama puanı yetmiyor</strong>
                        <p>{s.feedback}</p>
                      </div>
                    )}
                    {pending && (
                      <div
                        className="day3-reasons"
                        role="group"
                        aria-label={`${m.id} seçim gerekçesi`}
                      >
                        <strong>Neden bunu önceliklendirdin?</strong>
                        {REASONS.map((reason) => (
                          <button
                            key={reason}
                            onClick={() => act(() => f.explain(reason))}
                          >
                            {reason}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            act(() => {
                              f.pending = null;
                              f.feedback =
                                "Seçim iptal edildi; bütçe değişmedi.";
                            })
                          }
                        >
                          Seçimi iptal et
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
            <div className="day3-plan-note">
              <strong>Planına geniş açıdan bak</strong>
              <p>
                {s.missingRegions.length
                  ? `Henüz kaynak ayrılmayan bölgeler: ${s.missingRegions.join(", ")}. Bu bilinçli bir tercih olabilir; sonuçlarını da incele.`
                  : "Dört bölgeye de en az bir önlem ayrıldı; yine de risk sürer."}
              </p>
              <p>
                Bütün öneriler 1.520 puan. Tamamını alamayız; tüm puanı harcamak
                zorunda değilsin.
              </p>
            </div>
          </>
        )}
        {s.step === "simulating" && (
          <div className="day3-simulation">
            <span className="eyebrow">
              ORTAK SENARYOLAR · TEMSİLİ EĞİTİM ÖZETİ
            </span>
            <h4>{region.name}</h4>
            <p>
              Karşılaştırma {s.elapsed}/12 sn ·{" "}
              {status.day3.elapsed < 4
                ? "Başlangıç koşulları"
                : status.day3.elapsed < 8
                  ? "Hazırlıklar değerlendiriliyor"
                  : "Sonuçlar hazırlanıyor"}
            </p>
            <progress
              value={s.elapsed}
              max={12}
              aria-label="Plan karşılaştırma süresi"
            />
            <p>
              Yağış, rüzgâr, zemin ve kar varsayımları değişmez. Önce yeni bütçe
              önlemi yok; sonra seçtiğin önlemler var.
            </p>
            <div className="day3-sim-pair">
              <div>
                <strong>Önce</strong>
                <p>Yeni üçüncü gün hazırlıkları yok.</p>
              </div>
              <div>
                <strong>Sonra</strong>
                <p>{s.selectedIds.length} yetkili hazırlığı değerlendirmede.</p>
              </div>
            </div>
            <p>
              Bu süre gerçek afet oluş zamanı değildir. Hareketli afet görüntüsü
              veya korkutucu ses kullanılmaz.
            </p>
            <button className="primary" onClick={() => act(() => f.summary())}>
              Özete geç
            </button>
            {s.elapsed >= 12 && (
              <button onClick={() => act(() => f.compare())}>
                Karşılaştırmaları aç
              </button>
            )}
          </div>
        )}
        {s.step === "comparing" && (
          <>
            <div className="day3-section-title">
              <h4>{outcome.name}</h4>
              <span>
                Deneme {s.planRevision} · {s.viewed.length}/4 bölge raporu
                incelendi
              </span>
            </div>
            <p className="day3-note">
              Aynı bölge senaryosu, aynı afet koşulları. Değişen yalnızca üçüncü
              gün hazırlıklarıdır.
            </p>
            <details className="day3-overview">
              <summary>Dört bölgenin sonuçlarını birlikte gör</summary>
              <div className="day3-regional-grid">
                {s.outcomes.map((o) => (
                  <article key={o.region}>
                    <h5>{o.name}</h5>
                    <strong>
                      {s.allocations.find((a) => a.region === o.region)!.spent}{" "}
                      planlama puanı · {o.selectedIds.length}/3 önlem
                    </strong>
                    <p>
                      <b>Önce:</b> Yeni üçüncü gün önlemi yok.
                    </p>
                    <p>
                      <b>Sonra:</b>{" "}
                      {o.selectedIds.length
                        ? "Seçilen yetkili hazırlıkları:"
                        : "Bu bölge için yeni önlem seçilmedi."}
                    </p>
                    {o.selectedIds.length > 0 && (
                      <ul>
                        {o.rows.map((row) => (
                          <li key={row.label}>{row.after}</li>
                        ))}
                      </ul>
                    )}
                    <p className="day3-risk">{o.residualRisk}</p>
                  </article>
                ))}
              </div>
            </details>
            <div className="day3-outcomes">
              {outcome.rows.map((row) => (
                <article key={row.label}>
                  <h5>{row.label}</h5>
                  <div>
                    <p>
                      <strong>Önce</strong>
                      {row.before}
                    </p>
                    <p>
                      <strong>Sonra</strong>
                      {row.after}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <p>
              <strong>Seçilen önlemler:</strong>{" "}
              {outcome.selectedIds.join(", ") ||
                "Bu bölge için yeni önlem seçilmedi."}
            </p>
            <p className="day3-risk">
              Önce de sonra da: {outcome.residualRisk}
            </p>
            <p className="day3-note">
              Ortak koşullar:{" "}
              {s.region === "flood"
                ? "aynı yoğun yağış ve dere yükselişi"
                : s.region === "wildfire"
                  ? "aynı rüzgâr, sıcaklık ve kuruluk"
                  : s.region === "landslide"
                    ? "aynı yağış, duyarlı zemin ve dik eğim"
                    : "aynı kar örtüsü, soğuk hava ve dik yamaç"}
              .
            </p>
            <div
              className="day3-reasons"
              role="group"
              aria-label="Son plan gerekçesi"
            >
              <strong>Son planının önceliği ne?</strong>
              {REASONS.map((r) => (
                <button
                  key={r}
                  aria-pressed={s.finalReason === r}
                  onClick={() => act(() => f.setFinalReason(r))}
                >
                  {r}
                </button>
              ))}
            </div>
            {s.missingRegions.length > 0 && (
              <p className="day3-risk">
                Kaynak ayrılmayan bölgeler: {s.missingRegions.join(", ")}.
                Raporlarında yeni önlem olmadığını açıkça gösteriyoruz; bilinçli
                seçimini yasaklamıyoruz.
              </p>
            )}
          </>
        )}
        {s.step === "finalized" && (
          <>
            <span className="eyebrow">SON PLAN · DENEME {s.planRevision}</span>
            <h4>Güvenkent için düşünülmüş bir plan</h4>
            <p>
              <strong>Harcanan:</strong> {s.spentBudget} planlama puanı ·{" "}
              <strong>Kalan kaynak:</strong> {s.remainingBudget} planlama puanı
              · <strong>Gerekçem:</strong> {s.finalReason}
            </p>
            <p>
              Planlama puanları başarı puanı değildir. Rapor yalnızca bu açık
              oyun oturumunda; gerçek belediyeye gönderilmedi.
            </p>
            {allocationSummary}
            <div className="day3-final-grid">
              {s.outcomes.map((o) => (
                <article key={o.region}>
                  <h5>{o.name}</h5>
                  <p>
                    <strong>
                      Ayrılan kaynak:{" "}
                      {s.allocations.find((a) => a.region === o.region)!.spent}{" "}
                      planlama puanı
                    </strong>
                  </p>
                  <p>
                    {o.selectedIds.length
                      ? MEASURES.filter((m) => o.selectedIds.includes(m.id))
                          .map((m) => `${m.id} · ${m.label} (${m.cost})`)
                          .join("; ")
                      : "Bu bölgeye yeni kaynak ayrılmadı."}
                  </p>
                  <p>{o.rows.map((row) => row.after).join(" ")}</p>
                  {o.selectedIds.length === 0 && (
                    <p className="day3-afi">{afiUnfundedFeedback(o.region)}</p>
                  )}
                  <strong>{o.residualRisk}</strong>
                </article>
              ))}
            </div>
            <details>
              <summary>Önceki plan denemeleri ({s.history.length})</summary>
              {s.history.map((h) => (
                <p key={h.revision}>
                  Deneme {h.revision}: {h.selectedIds.join(", ") || "Önlem yok"}{" "}
                  · Kalan {h.remainingBudget} puan
                </p>
              ))}
            </details>
          </>
        )}
        {s.feedback && !s.budgetError && (
          <p className="day3-feedback" role="status">
            {s.feedback}
          </p>
        )}
      </div>
      <footer className="day3-footer">
        <small>{DAY3_SAFETY}</small>
        <div>
          {planning && (
            <button
              className="primary"
              disabled={!!s.pending}
              onClick={() => act(() => f.apply())}
            >
              Planı uygula
            </button>
          )}
          {(s.step === "comparing" || s.step === "finalized") && (
            <button onClick={() => act(() => f.replan())}>Planı düzenle</button>
          )}
          {s.step === "comparing" && (
            <button
              className="primary"
              disabled={s.viewed.length !== 4 || !s.finalReason}
              onClick={() => act(() => f.finalize())}
            >
              Son planı onayla
            </button>
          )}
          {s.step === "finalized" && (
            <button
              onClick={() => {
                close();
                onFocus();
              }}
            >
              Belediye odasına dön
            </button>
          )}
        </div>
      </footer>
    </section>
  );
}
