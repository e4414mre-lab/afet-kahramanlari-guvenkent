# FAZ 09 — 3. GÜN: BELEDİYE BÜTÇESİ VE GÜVENKENT AFET HAZIRLIK PLANI

**Durum:** Codex uygulama şartnamesi; bu belge tek başına çalışan oyun oluşturmaz.
**Kaynak dal:** `feat/avalanche-karlitepe` (GitHub'da doğrulandı)
**Yeni dal:** `feat/day3-budget-planning` (Codex bu kaynaktan oluşturacak)
**Kural:** Kullanıcının oyun/görsel onayı olmadan `main` merge, üretim yayını ve final sınav aşaması YOK.

## 1. Amaç ve öğrenme hedefleri
Çağrı, üçüncü günün başında simgesel Çocuk Belediye Başkanı olarak dört bölgedeki risklerden topladığı bilgilerle **Güvenkent Afet Hazırlık Planı** hazırlayacak. Öğrenci kamu kaynaklarının sınırlı olduğunu, farklı ihtiyaçları tartmayı, uzman tavsiyesi dinlemeyi, adil ve gerekçeli önceliklendirmeyi ve kararlarını yeni bilgi ışığında değiştirmeyi öğrenecek.

**Temel oyun döngüsü:** Bölge raporlarını incele → uzmanlara danış → 1.000 planlama puanını önlemlere dağıt → planı uygula → aynı afet varsayımları altında sonuçları karşılaştır → gerekirse bütçeyi yeniden dağıt → son planı onayla → kısa belediye raporu.

**Çok önemli:** 1.000 `planlama puanı` gerçek para, gerçek kamu bütçesi, afet risk ölçüsü veya öğrencinin başarı puanı değildir. Öğrencinin sınav/başarı puanı ayrı tutulur.

## 2. Başlangıç koşulları ve oyun akışı
- Dört afet bölgesi **Dere Mahallesi, Çamlık Ormanı, Yamaç Mahallesi, Karlıtepe** tamamlanınca 3. gün açılır; mevcut bağımsız öğretmen inceleme/serbest gezi yaklaşımı daha sonra yetkilendirmeye uygun tasarlanır.
- Başlangıç şehri: daha önce onaylanan yüksek kaliteli belediye iç mekânına giriş; Murat, Zeynep, Elif ve Hasan Amca doğrudan fiziksel NPC olarak aynı odada bulunmak zorunda değildir. Mesaj/danışma kartlarıyla bilgi verebilirler.
- Çağrı ve AFİ'nin kimliği ile önceki bölümlerin grafik, hareket ve görev durumu korunur.
- AFİ: “Güvenkent için bir plan hazırlayacağız. Her öneri önemli ama kaynaklarımız sınırlı. Önce ihtiyaçları karşılaştıralım.”
- Belediye başkanı: “Bu bir eğitim planlamasıdır; gerçek kararlarda uzmanlar ve yetkili kurumlar görev alır.”

## 3. Görsel tasarım ve arayüz
- Belediye odası ve şehrin daha önce onaylanan **premium 2.5D izometrik** sanat dilini aynen koru.
- Planlama için harita masası / belediye panosu yanında **oyun içi ayrı strateji görünümü** açılabilir. Mevcut sahnenin üstüne dev etiketler yığma.
- Panoda Güvenkent'in dört afet bölgesi tıklanabilir dört kart/harita noktası olarak sunulsun; yalnızca hangi önlemlerin hangi bölgeye ait olduğunu vurgula.
- Öğrenci maliyet, kalan planlama puanı, seçili önlemler ve hazırlık etkisini görebilsin. Düzgün mobil kart düzeni; klavyeyle kullanılabilir.
- Her önlem için tek satırlık yarar özeti + maliyet + “Seç / Geri al”.
- Arayüz çocuk dostu ve karar verme merkezli; küçük puntolu yoğun tablolar ve aşırı metin yok.
- Ayarlar (beş bağımsız ses/yazı, azaltılmış hareket), ekran okuyucu metinleri ve mobil kontrol sistemi korunacak.

## 4. Bütçe modeli — kesin matematik
`STARTING_BUDGET = 1000` puan. **Her bölge için 3 seçilebilir önlem, toplam 12 seçenek.** Tüm önlemleri almak maliyet olarak 1000'i geçmeli; farklı stratejiler mümkün olmalı. Bir bölgeye bütün kaynakları ayırmak mümkün olsa da açıklamayla dengeli plan için rehberlik verilmeli, sırf tek doğru seçim dayatılmamalı.

Önerilen veri havuzu (rakamlar yalnızca oyun tasarımı denge değerleridir):

| Bölge | ID | Önlem (yetkili yetişkin/uzman uygular) | Maliyet |
|---|---|---|---:|
| Dere | F1 | Erken taşkın uyarısı ve güvenli güzergâh bilgilendirmesi | 130 |
| Dere | F2 | Gider ve dere çevresinin yetkili bakım planı | 150 |
| Dere | F3 | Riskli köprü/yol için kapatma ve yönlendirme planı | 110 |
| Orman | W1 | Erken yangın bildirimi ve ziyaretçi uyarıları | 130 |
| Orman | W2 | Uzman ekiplerin uygun yanıcı yük/bakım planı | 150 |
| Orman | W3 | Güvenli ziyaretçi çıkışı ve acil koordinasyon | 110 |
| Yamaç | L1 | Jeoloji/zemin değerlendirmesi ve arazi planı | 150 |
| Yamaç | L2 | Uzman kontrollü drenaj/şev bakım değerlendirmesi | 160 |
| Yamaç | L3 | Riskli yol kapatma ve mahalle uyarıları | 100 |
| Karlıtepe | A1 | Çığ gözlem / resmî tehlike uyarıları | 140 |
| Karlıtepe | A2 | Kapalı rota ve alternatif güzergâh planı | 110 |
| Karlıtepe | A3 | Ziyaretçi kış güvenliği bilgilendirmesi | 80 |

Tüm 12 önlemin bedeli = **1520** puan. Seçim algoritması maliyeti 1000'i aşan planı uygulayamaz; kullanıcıya kalan bütçeyi açık gösterir. Sıfırın altında bakiye saklama; negatif ve NaN değerleri reddet. Bütçe tutarlı biçimde `1000 - sum(uniqueSelectedMeasures.cost)` hesaplanır. Aynı önlem iki kez satın alınamaz. Seçimi geri almak tutarı iade eder.

## 5. Uzman görüşleri ve anlamlı seçim
- Hasan Amca: Dere'de halkın uyarıya erişim ihtiyacı (anekdot, bilimsel tahmin değil).
- Elif: Orman ziyaretçilerinin eğitimi, erken bildirim ve uzman bakımı.
- Murat: Riskli yamaçlar için zemin incelemesi ve yol güvenliği.
- Zeynep: Karlıtepe'de resmî çığ uyarıları, kapalı güzergâhlar, alternatif rota.
- Öğrenci önlemi seçerken “Neden bunu önceliklendirdin?” için 2–3 kısa gerekçe seçeneğiyle düşünmesini açıklasın; cevaplar farklı stratejilere açık olsun.
- “En pahalı en iyi”, “her zaman tek doğru bütçe dağılımı” gibi kurgular yok.

## 6. Önce / sonra şehir simülasyonu ve etkiler
Dört afet bölgesinin mevcut veri-model simülasyonlarını **yeniden kullan**; bütün simülasyonları sıfırdan kopyalama.

- Her bölge için `baselineScenario` daha önceki aynı yağış/rüzgâr/zemin/kar parametrelerini referans alır.
- `before`: hiçbir yeni üçüncü gün bütçe önlemi seçilmemiş durumda.
- `after`: öğrencinin bütçeyle seçtiği önlemlere göre, örneğin uyarı/haberleşme ve erişim planlaması iyileşebilir.
- **Önlemler meteorolojiyi, kar örtüsünü veya jeolojik eğimi değiştirmez.** Yangını, çığı, heyelanı ya da taşkını kesin önlemiş gibi gösterme.
- Farklar nitel değerlendirme: “uyarı daha erken”, “kapalı yol duyuruldu”, “güvenli yönlendirme iyileşti”; maliyetler gerçek risk hesabına çevrilmez, güvenlik garantisi verilmez.
- Her bölge sonucu dört satırlı mini kartla göster: uyarı/bakım/ulaşım/bilgilendirme etkisi, seçili önlemler, hâlâ devam eden risk.
- Bölge için hiç önlem seçilmemişse sonuç bunu dürüstçe belirtir; dört bölgenin hepsi yine incelenebilir.
- Uzun animasyonlar isteğe bağlı, hepsinde “Özete geç” seçeneği ve reducedMotion desteği vardır.

## 7. Yeniden planlama mekanizması
- Öğrenci ilk planı `Planı uygula` ile simüle eder.
- Karşılaştırma ekranından `Planı düzenle` seçerek geri döner, önlem kaldırır/ekler.
- Bütçe ve etkiler anında güncellenir.
- En az bir tam **plan → simüle et → yeniden düzenle → simüle et** döngüsü mümkün olmalı; yeniden deneme sınırsız olabilir, puan çiftlenmez.
- `Son planı onayla` seçilince kısa gerekçe ve dört bölge raporu oluşturulur. Eksik bütün bölge durumu için şeffaf uyarı gösterilir, fakat bilinçli seçimleri otomatik yasaklamaz.
- Önceki denemeleri `planRevision` ile tut; raporda son seçili plan ve kalan bütçe göster.

## 8. Veri yapısı ve durum makinesi
Öneri tipleri:
```ts
type RegionId = 'flood'|'wildfire'|'landslide'|'avalanche';
type Measure = { id:string; region:RegionId; label:string; cost:number; effects:string[] };
type Plan = { selectedIds:string[]; revision:number; remainingBudget:number };
type Day3Step = 'briefing'|'consulting'|'planning'|'simulating'|'comparing'|'replanning'|'finalized';
```
- Bütçe hesapları **saf fonksiyonlar** ile yapılsın: `calculateRemainingBudget`, `toggleMeasure`, `buildRegionalOutcomes`; birim test yaz.
- `plannedMeasures` ile `studentScore` birbirinden ayrı.
- Senaryo parametrelerini iki denemede aynı tut, farklılaştırılan yalnızca önlemlerin hazırlık etkisidir.
- Aşamaların ilerleme state'i mevcut Phaser/React köprüsüne entegre edilir; oturumda kaybolmaz. Sunucu kaydı yoksa kalıcı veri varmış gibi gösterilmez.
- Yükleme/hata halinde oyun kapanmaz; kullanıcıya tekrar deneme veya güvenli ana menü sunulur.

## 9. Kabul testleri
1. `npm run build` ve mevcut testlerin tümü geçiyor.
2. Önceki sahneler / 2. gün 4 afet bölgesi bozulmamış.
3. 1000 puan başlangıç ve 1520 toplam bedel sabit.
4. Bütçe hiçbir durumda negatif; duplicate önlem satın alınamıyor, kaldırılınca tutar geri geliyor.
5. Farklı planlar farklı ve gerekçeli **nitel** sonuçlar üretiyor.
6. Önce / sonra senaryo girdileri aynıdır (otomatik test).
7. Yeniden planlama döngüsü en az iki kez sorunsuz yapılır.
8. Son planda 4 afet bölgesinin raporu, seçilen önlemler, kalan bütçe var.
9. 1440×1000 masaüstü, 390×844 mobil ve klavye/fare/dokunmatik testleri geçiyor.
10. Beş ses/yazı ayarı, sessiz kullanım, azaltılmış hareket korunuyor.
11. Sahneye tekrar girişte dinleyici/modal/puan çiftlenmiyor.
12. Kararlar akademik başarı puanını planlama puanıyla karıştırmıyor.
13. Gerçek ekran görüntüleri:
    - `docs/screenshots/day3-town-hall.png`
    - `docs/screenshots/day3-budget-desktop.png`
    - `docs/screenshots/day3-budget-mobile.png`
    - `docs/screenshots/day3-measure-selected.png`
    - `docs/screenshots/day3-before-after.png`
    - `docs/screenshots/day3-replanning.png`
    - `docs/screenshots/day3-final-report.png`
14. `docs/FAZ_09_TESLIM_RAPORU.md` değişiklikler, varlıklar, testler ve eksikleri gösterir.

## 10. Teslim ve durdurma kuralı
- `feat/avalanche-karlitepe` üzerinden `feat/day3-budget-planning` oluştur.
- Kod/test/görsel/rapor bu dala commit + push.
- `main` merge yapma, Vercel canlı yayına geçme.
- Final 60 soruluk sınavı, gerçek öğretmen panelini veya yeni bölümleri henüz üretme.
- Kullanıcının bütçe paneli, yeniden planlama ve sonuç raporu görsel onayını bekle.

## 11. Güvenlik ve gerçekçilik
Bu bir 5. sınıf eğitim modeli; maliyetler ve etkiler temsili tasarım değerleridir. Gerçek mühendislik/afet risk tahmini veya resmi belediye planı yerine geçmez. Yayın öncesinde uzman incelemesi ve güncel resmî güvenlik yönergeleriyle pedagojik doğrulama yapılır.
