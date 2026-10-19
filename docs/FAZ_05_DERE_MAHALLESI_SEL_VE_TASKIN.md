# FAZ 05 — DERE MAHALLESİ: SEL VE TAŞKIN

**Durum:** Codex için uygulanabilir geliştirme şartnamesi. Bu belge kodun uygulandığı anlamına gelmez.

**Kaynak dal:** `feat/home-earthquake-drill` (GitHub'da doğrulandı)
**Yeni dal:** `feat/flood-dere-mahallesi` (Codex kaynak daldan oluşturacak)
**Koruma:** `main` dalına birleştirme yok; kullanıcı görsel ve pedagojik onay verene kadar sonraki afet bölgesine geçme.

## 1. Eğitim amacı ve oyun yaklaşımı

5. sınıf öğrencileri dere çevresinde sel ve taşkın tehlikesini gözlemleyip doğru önleyici kararları verir. Öğrenci tehlikeli alana girmez, suyu geçmez, engellere müdahale etmez. Riskleri fark eder, uzmanları ve yetişkinleri haberdar eder, risk azaltma önerilerini değerlendirir.

**Oynanış döngüsü:** keşfet → Hasan Amca ile konuş → 3 riski incele → güvenli öneri seç → aynı yağış senaryosunu hazırlık öncesi ve sonrası karşılaştır → kısa rapor al.

**Zorunlu karşılaştırma:** aynı yağış varsayımı; değişen tek unsur seçilen hazırlık önlemleri. Bu eğitim simülasyonu gerçek taşkın tahmini / güvenlik garantisi değildir.

## 2. Sanat ve kamera standardı

- Onaylanmış şehir, belediye, sınıf ve ev sahneleriyle birebir aynı görsel kalite ailesi: sıcak, ayrıntılı, okunaklı 2.5D izometrik / 3-çeyrek mini-diorama.
- Dere kıyısındaki küçük mahalle, taş köprü, kıyıya yakın evler, daha yüksekte güvenli alan, ağaçlar, dere kıvrımı, kıyı yaya yolu, yağmur suyu kanalları, mahalle meydanı.
- Suyun üzerinde okunaklı ama hafif animasyon; ağaç yaprakları ve birkaç güvenli NPC hareketi. Performans için düşük yoğunluklu animasyon.
- Harita sadece bir arka plan görseli olmasın: köprü, dere, risk nesneleri, NPC ve etkileşim alanları ayrı tıklanabilir katmanlar; derinlik ve çarpışma.
- Dere kıyısı ve su oyuncuya **erişilemez bölge**: yürüyüş navigasyonu suya sokmamalı; köprü riskli anda kapatılabilmeli.
- Yağış simülasyonunda korkutucu ses, yıkım ve yaralanma görseli yok. Sel suyu bölgesel yükselme / akış ve renk katmanlarıyla anlatılır.
- Görsel üstünde dev etiket kümeleri, boş geometrik zeminler, uzun talimat kutuları, ekranı kaplayan butonlar YASAK.
- Düşük donanım ve mobil için animasyon ve efekt seviyesi azaltılabilir; reducedMotion seçimi kamera sarsıntılarını ve yoğun parçacıkları engeller.
- Gerçek sanat varlıkları eksikse teknik konsepti bitmiş sahne gibi sunma, raporla.

## 3. Karakterler

**Çağrı:** onaylı karakter görünümü; mevcut yürüme, tıkla-git, mobil ve klavye kontrolleri korunur.
**AFİ:** karakteri takip eder, kısa sesli/yazılı açıklamalar, 3 kademeli isteğe bağlı ipuçları.
**Hasan Amca:** mahallede yaşayan, sakin ve yardımsever yaşlı NPC. Tehlikeli müdahaleleri öğrenciye değil yetişkin ve yetkili kurumlara yönlendirir.

Örnek:
- Hasan Amca: “Yağmur çok yağınca dere bazen kabarır. Sence hangi yerlere dikkat etmeliyiz?”
- AFİ: “Önce çevreyi güvenli bir noktadan inceleyelim. Dereye yaklaşmamıza gerek yok.”
- Görev sonucu: “Hazırlıklarımız bazı zararları azaltabilir. Yine de her yağışta güvenlik uyarılarını izlemeliyiz.”

## 4. Bölüm giriş ve keşif görevleri

**Geçiş:** İlk günün deprem tatbikatı tamamlanınca ikinci gün açılır. Dere Mahallesi dahil 4 bölge serbest sırayla seçilebilir; bu fazda yalnızca Dere Mahallesi oynanır, diğerleri kilitli / henüz geliştiriliyor diye dürüstçe gösterilir.

**Risk 1 — Dere yatağına çok yakın kullanım:** dereye çok yakın alt kotta depo/yerleşim. Güvenli yorum: riskli alan kullanımı yetkili kurumlarca planlanmalı; oyuncu yapıyı taşımaz.

**Risk 2 — Yağmur suyu giderinde birikinti / tıkanma:** taşınan yaprak/çöp suyun akışını engelleyebilir. Güvenli davranış: öğrenci suya veya gider içine girmez; belediye ekiplerine bildirir.

**Risk 3 — Taşkın sırasında kullanılmaması gereken alçak köprü / yol:** AFİ güvenli mesafeden gözlemletir; riskli hava ve su koşullarında köprü/taşkın suyu kesinlikle geçilmez, uyarılar izlenir.

Her görev için: nesneyi bul → kısa açıklama → 2–3 seçenekli karar → gerekçe → risk durumu güncelle. Yanlış cevaba ağır ceza yok, tekrar deneme ve ipucu var. Riskleri gözlemlemek için oyuncunun su kenarına yaklaşması zorunlu olmasın.

## 5. Karar aşaması ve 3 hazırlık seçeneği

Aşağıdaki önlemleri temsil eden üç seçenek sun:
1. **Gider ve dere çevresi bakımının yetkili ekiplerce yapılması**.
2. **Riskli alan kullanımının değerlendirilmesi, uyarı levhaları / geçiş güvenliği planı**.
3. **Mahalle halkının uyarı sistemi ve güvenli toplanma/uzaklaşma güzergâhı hakkında bilgilendirilmesi**.

İstersen 1 yanlış seçenek ekle: “Taşkın sırasında alçak köprüden hızlıca geçmek.” Bu seçenek seçilemez şekilde engellenmektense kısa gerekçeyle açıklanır ve tekrar karar vermeye izin verilir. Asla öğrenciyi tehlikeli eylemi animasyonla yapmaya zorlamaz.

Bu fazda bütün şehir bütçe puanlarını tüketen oyun ekonomisi kurma; bütçe üçüncü gün bölümünde ele alınacak.

## 6. Önce / sonra karşılaştırma

**Aynı senaryo:** 45 saniyelik, kontrollü stilize yoğun yağış ve dere seviyesi artışı. Süre gösterimi yalnızca oyun simülasyonu, gerçek süre tahmini değil.

**Önce:** hazırlık işaretleri yok; belli alçak yaya yolu kapanır, riskli yapı çevresinde su seviyesi uyarısı gösterilir, köprü güvenlik nedeniyle kullanıma kapatılır. Can kaybı, yaralanma veya travmatik görüntü yok.
**Sonra:** aynı yağış göstergeleri/parametreleri korunur. Seçilen önlemlerden dolayı gider çevresindeki birikim azalabilir, erken uyarı ve güzergâh bilgisi sayesinde mahalleli daha önce güvenli noktada olur; ancak su seviyesi ve geçiş yasağı otomatik olarak yok olmaz. Bütün taşkınları önleyen sihirli tek çözüm gösterilmez.

Kısa karşılaştırma: 
- Hazırlık durumu (önce/sonra)
- Uyarıya erişim (önce/sonra)
- Riskli yoldaki erişim (her ikisinde de su varsa geçilmez)
- Olası zarar azaltma: nitel açıklama, kesin yüzde yok

Her sahne 45 sn izlemeyi zorunlu kılmasın; geç/özet seçeneği olsun. Azaltılmış hareket ve sessiz mod tam kullanılabilir. Öğrenci deneyimi en çok 8–12 dakika hedeflenir.

## 7. Görev durumları ve veri modeli

TypeScript enum/discriminated union ile:
`notStarted -> meetHasan -> investigate3 -> choosePreparedness -> beforeSimulation -> afterSimulation -> compare -> completed`.

Her risk:
`unseen -> identified -> decisionMade -> reviewed`.

Çift tıklamayla görev ve puan artmaz. Yeniden oynatma ayrı deneme olabilir; liderlik puanı şişirilmez. Üçüncü gün için seçilen önlemler JSON tipiyle kaydedilebilecek şekilde tasarlanır, Supabase yoksa kalıcı sunucu kaydı taklidi yapılmaz.

Örnek veriler `src/data/flood.ts`; sahne sınıflarında metin kopyalama yerine içerikler bu veri kaynağından sağlanır.

## 8. Test / kabul

1. `npm run build` ve mevcut otomatik testler başarılı.
2. Önceki günün şehir/belediye/okul/ev/tatbikat akışı bozulmamış.
3. Öğrenci üç risk noktasını güvenli konumdan bulup değerlendirebiliyor.
4. Hasan Amca ve AFİ etkileşimleri çalışıyor; 3 kademe ipucu var.
5. Kararlar gerekçeli geri bildirim veriyor, yanlış cevapta devam edebiliyor.
6. **Önce ve sonra aynı yağış parametreleri** kullanılıyor (otomatik test).
7. Hazırlık her riski tamamen ortadan kaldırıyormuş gibi gösterilmiyor.
8. Su/taşkın alanlarına oyuncu karakteri giremiyor.
9. 1440x1000 masaüstü ve 390x844 mobil ekranlarda bölge, diyalog ve simülasyonlar okunuyor.
10. Klavye, fare, dokunmatik ve azaltılmış hareket tercihleri çalışıyor.
11. Bölüm tekrarında çifte puan / listener / modal oluşmuyor.
12. PNG ekran görüntüleri GitHub'da açılabiliyor: `docs/screenshots/flood-area-desktop.png`, `flood-area-mobile.png`, `flood-before.png`, `flood-after.png`, `flood-comparison.png`.
13. `docs/FAZ_05_TESLIM_RAPORU.md` dosyasında kullanılan varlıklar, eksikler, testler ve uygulanan değişiklikler listeleniyor.

## 9. Teslim

- `feat/home-earthquake-drill` dalından `feat/flood-dere-mahallesi` oluştur.
- Sadece Dere Mahallesi bölümünü geliştir. Çamlık, Yamaç ve Karlıtepe henüz yapılmayacak.
- Kodları, testleri, ekran görüntülerini ve teslim raporunu bu dala commit/push yap.
- `main` dalına birleştirme yapma; oyuncu görsel onayı bekle.
