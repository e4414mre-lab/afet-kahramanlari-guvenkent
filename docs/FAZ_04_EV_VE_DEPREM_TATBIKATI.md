# FAZ 04 — ÇAĞRI'NIN EVİ VE DEPREM TATBİKATI

**Kaynak dal:** `feat/school-risk-hunt` — önceki okul, belediye, meydan çalışmaları bu dalda.
**Yeni dal:** `feat/home-earthquake-drill` — Codex bu daldan türetsin.
**Kısıt:** `main` dalına birleştirme YOK. Kullanıcının onayı olmadan 2. gün bölgelerine geçme.

## Amaç ve pedagojik hedef
5. sınıf öğrencisi evindeki deprem öncesi riskleri **gözlemleyip yetişkine bildirme** ve sarsıntı sırasında **Çök–Kapan–Tutun**, sarsıntı bittikten sonra ise güvenli kontrollü tahliye ilkelerini öğrenme. Korku yaratmadan, güvenli karar verme, kısa gerekçeli geri bildirim, yeniden deneme.

## Sahne 1 — Mahalle ve eve geçiş
- Okuldaki 6/6 risk avı tamamlanınca AFİ ev görevini önerir.
- Şehir meydanından güvenli ev girişine geçiş; önceki tüm sahneler bozulmaz.
- Gerekirse kısa mahalle yolu yürüyüşü; ekstra dekor görev akışını geciktirmesin.
- `HomeScene` React+Phaser mimarisinde veri odaklı kurulur.

## Sahne 2 — Çağrı'nın evi
- Önceki belediye ve sınıfla **aynı kaliteli 2.5D izometrik 3D-stil sanat**: sıcak aile salonu; kanepe, sağlam masa, kitaplık, çerçeve, pencere, çıkış kapısı, halı, dolap ve çanta/afet hazırlık çantası.
- Perspektif, nesne ölçekleri, gölgeler, ışık kaynağı, karakter ayak konumları, izometrik z-sıralama tutarlı olmalı.
- Önceki Antigravity gibi boş düz kutu oda, dev etiket, ekranda uzun görev listesi yok.
- Çağrı ve AFİ evde yürür/uçar; etkileşimler doğrudan nesneden; mobil ve klavye kontrolü mevcutla aynı.
- Sınıftaki risk avını aynen kopyalama; yeni içerik ev yaşamına uygun olmalı.

## Ev içi inceleme görevleri (4 risk + 2 güvenli öğe)
Riskler:
1. Sabitlenmemiş yüksek kitaplık -> yetişkine bildirilip uygun yöntemle sabitlenmesi.
2. Yatağın/oturma alanının üstünde ağır, düşebilir duvar dekoru -> güvenli yerleşimin yetişkin tarafından sağlanması.
3. Dolap tepesindeki ağır eşya -> yetkili yetişkinin güvenli şekilde kaldırması/yeniden konumlaması.
4. Dolap/kanepe nedeniyle daralmış çıkış geçişi -> geçişin yetişkin gözetiminde açık tutulması.

Güvenli öğeler:
- Sağlam, yerinde duran masa (sarsıntı tatbikatında uygun korunma konumu olarak değerlendirmesi sahneye bağlı)
- Ulaşılabilir konumda hazır afet ve acil durum çantası (içeriği koşullara göre hazırlanmalı)

Her öğe kısa bir neden + güvenli çözüm geri bildirimi verir. Çocuklara eşya sabitleme, ağır kaldırma, elektrik/gaz tesisatıyla müdahale yaptırılmaz.

## Deprem tatbikatı: olay temelli, korkutmayan
- Öğrenci ev inceleme bölümünü tamamladıktan sonra **planlı bir eğitim tatbikatı** başlar. Bunun simülasyon olduğu açıkça belirtilir.
- Kısa, yumuşak kamera sarsıntısı (reducedMotion açıksa sarsıntı animasyonu YOK), alçak şiddetli ses (sessiz modda YOK), panik/yaralanma görüntüsü YOK.
- Sahne sorusu: “Sarsıntı başladı. Ne yapmalısın?”
  - Doğru: Güvenli bir yerde **Çök–Kapan–Tutun**, baş ve boynu koru, sarsıntı bitene kadar bulunduğun yerde kal.
  - Yanlış ama öğretici seçenekler: pencereye koşmak; merdivene yönelmek; asansöre binmek. Yanlış seçimde **güvenli biçimde neden yanlış** olduğu açıklanır ve tekrar deneme sağlanır, riskli hareket animasyonuyla canlandırılmaz.
- Tatbikatta güvenli masa veya uygun korunma alanı görsel olarak vurgulanabilir, yalnızca karar sonrası; sürekli risk işareti yok.
- Sarsıntı sona erince: yetişkinin/öğretmenin yönlendirmesiyle kontrollü tahliye, zarar görmüş alanlardan ve devrilebilecek eşyalardan uzak durma, belirlenen güvenli buluşma alanına gitme.
- Tatbikat ile gerçek afet durumu karıştırılmamalı; kesin güvenlik garantisi verilmemeli. İllüstratif eğitim senaryosudur; yerel resmî yönergelerle yayın öncesi doğrulanmalı.
- Gerçek acil durumda 112 acil çağrı hizmeti, yalnızca gerekli olduğunda ve güvenli şartlarda kullanılır; rastgele arama teşvik edilmez.

## Diyalog ve hikâye
- AFİ sakin, net, 10–11 yaşa uygun Türkçe konuşur; uzun metin yok.
- En fazla 1–2 kısa cümle/diyalog adımı.
- Örnek: “Evimizdeki küçük önlemler büyük fark yaratır. Önce birlikte bakalım.”
- Tatbikat başarı sonunda: “Sarsıntı sırasında korunmayı ve sonrasında güvenli çıkışı seçtin. Güvenkent'e yardım etmeye hazırsın!”

## Teknik
- `HomeScene`, `EarthquakeDrillScene` veya alt durum makinesi. Veri odaklı görevler, typed event bus/state.
- Durumlar `homeIntro -> inspectHome -> drillReady -> shaking -> afterShaking -> gatheringPoint -> completed`.
- Sınıf görevi tamamlanmadan eve geçiş için öğretmen serbest-gezinti modu daha sonraki sistemle uyumlu tasarlanır; şu fazda gerçek öğretmen doğrulaması yapılmaz.
- Ses ayarları (voice/text/ambience/music/effects), azaltılmış hareket, kritik yönergelerin yazılı erişimi her koşulda korunur.
- Geri/ileri sahne geçişinde olay dinleyicisi ve modal tekrarı yok.
- Tatbikatı tekrar oynama, ilk tamamlanmayı ikinci defa puanlamama.
- Görsel sprite dosyaları ayrı ve yerel olmalı; telif belirsiz web görüntüleri doğrudan uygulamaya hotlink edilmemeli.
- Eksik varlığı düz geometrilerle bitmiş oyun diye sunma; görsel eksikleri raporla.

## Kabul testleri
1. `npm run build` başarılı ve mevcut testler regresyon açısından başarılı.
2. Okul 6/6 sonrasında ev görevi belirir; şehir-okul-belediye akışı değişmez.
3. 4 risk ve 2 güvenli öğe doğru konumda ayrı ayrı seçilebilir.
4. Altı öğenin açıklama ve kararları gerçekten işe yarar, yaşa uygundur.
5. Doğru/yanlış deprem anı seçenekleri öğretici açıklama gösterir.
6. Sarsıntı bitmeden tahliye önerilmez; doğru sıra korunur.
7. Reduced motion ve sessiz modda tatbikat tamamlanabilir.
8. Masaüstü 1440x1000, mobil 390x844 ve klavye ile etkileşim test edilir.
9. Yeniden oynama / sahne dönüşlerinde çifte tamamlanma ve çift puan yok.
10. GitHub'da `docs/screenshots/home-desktop.png`, `home-mobile.png`, `earthquake-drill-decision.png`, `earthquake-drill-feedback.png` önizlemeleri açılabilir.
11. `docs/FAZ_04_TESLIM_RAPORU.md` içinde test komutları, sonuçlar, sanat varlıkları ve kalan eksikler bulunur.

## Teslim
`feat/school-risk-hunt` kaynak dalından `feat/home-earthquake-drill` dalını aç; kodu, testleri, ekran görüntülerini ve raporu **yeni dala push et**. `main` dalına birleştirme yapma. Kullanıcı onayını bekle.
