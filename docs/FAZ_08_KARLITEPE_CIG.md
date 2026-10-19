# FAZ 08 — KARLITEPE: ÇIĞ FARKINDALIĞI

**Durum:** Codex geliştirme talimatı; bu belge kodun veya oyunun tamamlandığı anlamına gelmez.
**Kaynak dal:** `feat/landslide-yamac` (GitHub'da doğrulandı).
**Hedef dal:** `feat/avalanche-karlitepe` (Codex bu kaynak daldan oluşturacak).
**Yayın:** Kullanıcı onayından önce `main` merge veya Vercel üretim yayını YOK.

## 1. Amaç
5. sınıf öğrencisi çığın kar kütlesinin eğimli arazide aşağı hareket etmesi olduğunu öğrenir; eğimli kar alanları, resmî uyarılar, yasaklı geçişler ve güvenli güzergâhların önemini keşfeder. Çocuklar tehlikeli karlı yamaca girmez; ölçüm yapmaz, karı tetikleyecek müdahaleler yapmaz; uzaklaşıp yetişkinlere/uzmanlara bildirir.

**Döngü:** Güvenli karşılama → Çığ Uzmanı Zeynep ile konuşma → 3 risk inceleme → güvenli kararlar → hazırlık planı → **aynı kar/hava/yamaç varsayımlarıyla** önce/sonra eğitim simülasyonu → karşılaştırma ve rapor.

## 2. Görsel ve oyun standardı
- Mevcut şehir, belediye, sınıf, ev, sel, yangın ve heyelan sahneleriyle aynı **premium 2.5D izometrik mini-diorama sanat dili**.
- Karlıtepe: dağ eteğinde güvenli ziyaretçi karşılama alanı, ahşap dağ evi, bilgilendirme panosu, uzak çam ormanı, karla kaplı yüksek yamaç, çığ riski bulunan kapalı yol, korunaklı alternatif rota ve dağ manzarası.
- Ortam kış atmosferinde; hafif kar tanesi/nefes buharı isteğe bağlı, göz yoran beyaz parlamalar yok. Kar dokusu, gölgeler, NPC ölçüleri, karakter ayak basışları ve y-sort tutarlı.
- Çağrı ile AFİ güvenli platformda hareket eder; kırmızı/kapalı risk alanı **çarpışmayla erişilemez**. Tıkla-git/kısayol ile de bölgeye girilemez.
- Yetişkin uzman Zeynep kışlık görev kıyafetinde, diğer NPC'lerle aynı 3/4 perspektifte; okunur kısa diyaloglar.
- UI oyun dünyasını örtmez: küçük görev kartı, kısa diyalog paneli, opsiyonel yardım. Dev butonlar, üst üste nesne etiketleri ve basit geometrik dağ çizimi YASAK.
- Korkutucu çığ, canlıların gömülmesi, yaralanma, yardım çağrısı paniği, travmatik sesler yok. Yalnızca uzak yamaçta sınırlı, şematik kar hareketi, güvenli seyir noktasından görülür.
- Kaliteli sprite/arka plan eksikse düz şekilleri tamamlanmış sanat gibi gösterme; eksikleri raporla.

## 3. Uzman Zeynep ve diyalog
**Zeynep:** kar ve çığ tehlikesi konusunda görevli yetişkin uzman. Çocuklara sakin ve anlaşılır biçimde güvenli gözlem yaptırır.
- Zeynep: “Dağlar kışın çok güzel görünür. Ama bazı karlı yamaçlara girmek tehlikeli olabilir.”
- AFİ: “Kapalı yola girmiyoruz. Uyarı tabelalarını okuyup güvenli rotayı seçiyoruz.”
- Zeynep: “Hazırlık riskleri azaltabilir. Yine de çığ tehlikesi tamamen yok olmaz.”

Her konuşma adımı 1–2 kısa cümle; 5 bağımsız ses/yazı ayarı ile uyumlu, kritik güvenlik metinleri her zaman görünür.

## 4. Üç risk keşif görevi
### Risk 1 — Kapalı karlı yamaç yolu
- Uyarı levhası ve fiziksel kapatma görünür.
- Doğru: kapalı güzergâha girme; yetkili duyurusuna uy ve güvenli alternatif yolu kullan.
- Yanlış: kestirme olduğu için bariyeri geçmek.

### Risk 2 — Dik ve kar yüklü yamaç
- Uzak seyir noktasından görünür; “çok kar her zaman çığ demektir” gibi kesinlik yok.
- Doğru: uzman değerlendirmesi olmayan dik/kapalı alanlardan uzak dur; risk uyarılarına uy.
- Yanlış: karın sağlamlığını anlamak için yamaca çıkmak, üzerine basarak denemek.

### Risk 3 — Yetersiz yönlendirme / uyarı bilgisi
- Turistik patika girişinde eksik veya okunaksız rota/tehlike bilgisi.
- Doğru: resmî hava ve çığ duyurularını izle, yetişkin/uzmandan güvenli rota bilgisi al; yetkililere eksik tabelayı bildir.
- Yanlış: telefon haritasına bakıp uyarıları yok sayarak tek başına patikaya girmek.

Öğrenci her görevde `gözlemle -> karar ver -> nedenini öğren -> ilerle` akışını yaşar. İlkinde AFİ rehberliği, diğer ikisinde istenirse üç kademeli ipucu; yanlış cevaba açıklama ve tekrar.

## 5. Kar hazırlığı / uzman önlemleri
Üç önlem:
1. Yetkili kurumların çığ tehlike izleme, saha değerlendirmesi ve güncel uyarıları.
2. Riskli geçişleri geçici kapatma ve güvenli alternatif güzergâhların duyurulması.
3. Ziyaretçilerin kış koşulları ve acil durumda güvenli davranış hakkında önceden bilgilendirilmesi.

**Bunlar çocukların kendi başına yapacağı teknik müdahaleler değildir.** Üçüncü günün planlama sistemine aktarılabilir veriler olarak tipli tutulur; üçüncü gün bütçesi bu fazda oluşturulmaz.

## 6. Aynı koşullarda önce–sonra çığ simülasyonu
- Ortak senaryo: örnek `snowpack=high`, `slope=steep`, `weather=cold`, `scenarioSeed` her iki görselleştirmede de **aynı**.
- `before`: yetersiz uyarı, alternatif güzergâh bilgisi eksik, uzak yamaçta temsili hareket; riskli geçişe yaklaşma/ulaşım sorunu vurgulanır. Oyuncu güvenli platformdan ayrılmaz.
- `after`: aynı yamaç ve kar koşulları; önceden duyurulan uyarı, yol kapatma ve güvenli alternatif rota sayesinde ziyaretçilerin maruziyeti azalır. Kar “kaybolmaz”, çığ tehlikesi sıfırlanmaz; bazı yamaçlar hâlâ kapalıdır.
- Kısa karşılaştırma: Uyarıya erişim, tehlikeli yol kullanımı, güvenli güzergâh, hazırlık etkisi, **risk sürer**.
- Simülasyon yaklaşık 35–45 sn veya özetle geçilebilir. reducedMotion varsa statik iki-üç aşamalı anlatım; sessiz mod kullanılabilir.
- Çığ sürecini gerçek zamanlı bilimsel öngörü gibi sunma; “bu süre içinde çığ kesin düşer” veya kesin risk yüzdesi verme.

## 7. Oyuncu akışı ve durum makinesi
`notStarted -> meetZeynep -> inspectThreeRisks -> selectPreparedness -> beforeSimulation -> afterSimulation -> compare -> completed`

Her risk: `unseen -> identified -> decided -> explained`.
- 2. gün bölgeleri serbest sırayla seçilebilme kararını koru; Karlıtepe tamamlansa da diğer bölgelerin ilerlemesi silinmez.
- Tekrar oynama puanları katlamaz.
- Görev verilerini örneğin `src/data/avalanche.ts` altında derle; sahne içine dev metinler gömme.
- Mevcut React/Phaser event/state köprüsü, diyalog sistemi, WASD/yön tuşları, E/Enter, fare ve dokunmatik kullanılmalı.
- Geçerli sahnelerde ses tercihleri / `reducedMotion` korunur.
- Kaydetme yoksa kalıcı kayıt varmış gibi gösterme; yüklenmeyen ses/görsel oyunu çökertmesin.

## 8. Testler ve teslim kriterleri
1. `npm run build` ve mevcut birim/entegrasyon testleri geçer.
2. Şehir, belediye, okul, ev, sel, orman ve Yamaç sahnelerinin akışı bozulmamıştır.
3. Zeynep ve AFİ ile diyalog, 3 risk, doğru/yanlış seçenekler ve 3 seviyeli ipuçları çalışır.
4. Tehlikeli karlı yamaç/kapatılmış yola **klavye, fare veya dokunmatik ile girilemez**.
5. Kar/hava/eğim varsayımları önce/sonra birebir aynıdır (test).
6. Önlemler çığ riskini ortadan kaldırıyor gibi gösterilmez.
7. 1440x1000 masaüstü ve 390x844 mobil: kontroller ve metinler okunabilir.
8. Sessiz kullanım, `reducedMotion` ve klavye erişilebilirliği doğrulanır.
9. 5 kez sahneye girip çıkmada event listener / overlay / puan çiftlenmesi yok.
10. Ekran görüntüleri GitHub'da erişilir:
   - `docs/screenshots/karlitepe-overview-desktop.png`
   - `docs/screenshots/karlitepe-overview-mobile.png`
   - `docs/screenshots/karlitepe-zeynep-dialogue.png`
   - `docs/screenshots/karlitepe-risk-inspection.png`
   - `docs/screenshots/karlitepe-before.png`
   - `docs/screenshots/karlitepe-after.png`
   - `docs/screenshots/karlitepe-comparison.png`
11. `docs/FAZ_08_TESLIM_RAPORU.md` kaynaklar, eksik grafikler, testler, değişen dosyalar ve sınırlamaları açıklar.
12. Resmî AFAD/meteoroloji/ilgili uzmanlık kaynaklarına göre yayın öncesi pedagojik güvenlik incelemesi ayrıca işaretlenir.

## 9. Geliştirme sınırları ve teslim
- Başlangıç **`feat/landslide-yamac`**, `main` değil.
- `feat/avalanche-karlitepe` yeni dalında çalış, commit ve GitHub push yap.
- Belediye üçüncü günü, 1000 planlama puanı, sınav ve öğretmen paneline bu fazda girme.
- Kullanıcının Karlıtepe genel görünüm ve önce/sonra karşılaştırma ekranlarını onaylamasını bekle; yeni aşamaya geçme.
