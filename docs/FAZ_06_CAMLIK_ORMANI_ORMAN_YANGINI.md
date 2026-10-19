# FAZ 06 — ÇAMLIK ORMANI: ORMAN YANGINI FARKINDALIĞI

**Durum:** Codex geliştirme şartnamesi; uygulanmış oyun kodu değildir.
**Kaynak dal:** `feat/flood-dere-mahallesi` (GitHub'da doğrulandı).
**Yeni dal:** `feat/forest-fire-camlik` (bu dalı Codex kaynak daldan oluşturacak).
**Koruma:** Kullanıcı görsel ve oynanış onayı vermeden `main` dalına birleştirme YOK; heyelan/çığ aşamasına geçme.

## 1. Hedef ve eğitim kazanımları

5. sınıf öğrencisi orman yangını riskini azaltmaya yönelik güvenli davranışları gözlemler, duman/yangın belirtisi görünce **güvenli yere uzaklaşır ve bir yetişkine / 112'ye doğru biçimde haber verilmesini sağlar**. Rüzgâr, kuru bitki örtüsü ve hatalı insan davranışlarının riski etkileyebileceğini öğrenir.

Bu bölüm yangınla mücadele oyunu değildir. **Çocuk yangın söndürmez, yanan bölgeye yaklaşmaz, ateş yakmaz, riskli malzemeye dokunmaz, hayvan kurtarmak için alevlerin arasına girmez.** Oyun içinde itfaiye/orman ekipleri ayrı uzman NPC ve uzak planda tasvir edilir.

Oynanış döngüsü: güvenli seyir noktasından keşif → Elif ile konuş → üç riski araştır → güvenli önlemleri seç → aynı hava/rüzgâr varsayımıyla hazırlık öncesi ve sonrası canlandırmayı izle → kısa sonuç raporu.

## 2. Sanat / sahne kalitesi

- Onaylı şehir meydanı, belediye, 5-A sınıfı, ev ve Dere Mahallesiyle **aynı ayrıntılı sıcak 2.5D izometrik diorama estetiği**.
- Çamlık Ormanı: çam ağaçları, orman görevlisi bilgi kulübesi, yangın gözetleme noktası, orman yürüyüş yolu, kontrollü piknik/ziyaret alanı, orman sınırı, uzak yamaç ve güvenli toplanma noktası.
- Yeşil orman, sıcak güneş ışığı, ağaçların zemine doğru düşen gölgeleri. Kuru bitki örtüsü gibi risk unsurları anlaşılır ancak estetikle uyumlu.
- Çağrı ve AFİ bağımsız sprite'lar; Elif uzman NPC bağımsız sprite; çarpışma ve y-sort düzgün.
- Kamera oyunu odağa alır: gereksiz büyük panel veya nesne üstünde sürekli etiket bulunmaz.
- Yangın simülasyonunda *yalnızca uzak orman bölgesinde* stilize, yumuşak duman ve hafif turuncu parlama. Korkutucu yangın, yaralanma veya panik görüntüsü YOK.
- **Uzak tehlikeli alan erişilemez**. Çağrı tehlike sahasında dolaşmaz; tehlikeli bölgeye tıkla-git çalışmaz. Uyarı şeridi/koruma sınırı anlaşılır.
- Görsel varlıklar yoksa basit geometrik şekillerle sahne tamamlanmış gibi sunulmasın. Eksik sprite/arka plan ihtiyaçları teslim raporuna yazılsın.
- Gerekiyorsa düşük performans veya reducedMotion için duman animasyonu azaltılır/kapatılır.

## 3. Karakter: Orman Görevlisi Elif

Elif: güler yüzlü, uzman, çocuklarla sakin konuşan yetişkin orman görevlisi. Görev kıyafeti tutarlı, hareket ve yüz ifadesi önceki NPC'lerle aynı ölçek ve perspektifte.

Örnek kısa diyalog:
- Elif: “Ormanları korumak için önce tehlikeleri fark ederiz. Burada üç noktayı güvenli mesafeden inceleyelim.”
- AFİ: “Bir duman belirtisi fark edersek yaklaşmayız. Güvenli yere geçip yetişkinlere ve acil yardım ekiplerine haber veririz.”
- Elif: “Doğru hazırlık tehlikeyi azaltır. Ama rüzgâr ve hava koşulları değişebilir; hiçbir orman tamamen risksiz değildir.”

Diyaloglar yaşa uygun, 1–2 kısa cümle/adım; yazılı yönergeler ses kapalıyken de okunur.

## 4. Üç araştırma görevi

### Görev 1: Uygun olmayan ateş kullanımı
Güvenli seyir noktasından izlenen piknik bölgesinde yasak/denetimsiz ateş yakma belirtisi veya **söndürülmemiş kamp ateşi temsili**. Çocuk yaklaşmaz, su dökmez, söndürmeye çalışmaz.
- Güvenli karar: Uzaklaş, bir yetişkine bildir, gerekiyorsa 112 üzerinden uzman yardım iste.
- Hatalı seçenek: “Kendim gidip söndüreyim.” Açıklama ile reddedilir.

### Görev 2: Kurumuş bitki ve birikmiş yanıcı malzeme
Orman yolu kenarındaki yoğun kuru dal/ot ve kontrolsüz yanıcı madde birikimi.
- Güvenli karar: Yetkililerin bakım/temizlik ve risk azaltma planını uygulaması gerektiğini bildir.
- Hatalı seçenek: “Kuru dalları yakarak temizleyelim.” Güvenli olmayan davranış olarak açıklanır.

### Görev 3: Uyarı, erişim ve bildirim eksikliği
Ziyaret alanında belirsiz yangın uyarı tabelası / güvenli çıkış güzergâhı bilgisinin eksikliği.
- Güvenli karar: Yetkililerden açık uyarılar, acil durum erişimi ve ziyaretçi bilgilendirme planı iste.
- Hatalı seçenek: “Tehlike varsa kestirmeden ormanın içine kaçalım.” Açıklama ile reddedilir.

Her görev için: bul → incele → seçeneklerden güvenli kararı seç → kısa gerekçeli geri bildirim. İlk görevde AFİ rehberlik eder; diğerlerinde isteğe bağlı üç kademeli ipucu.

## 5. Duman fark etme mikro görevi

Ayrı kısa karar sahnesi: Uzaktaki orman çizgisi üzerinde hafif duman görülür.
- Oyuncuya “Ne yaparsın?” sorusu.
- Doğru: **Güvenli konumda kalıp uzaklaşma yönlendirmelerine uy; bir yetişkine ve gerekli ise 112'ye haber ver; konum bilgisini güvenli şekilde paylaş.**
- Yanlış: “Dumanı yakından incelemeye giderim”, “Alevleri söndürmek için ormana girerim”.
- Gerçek 112 araması yaptırma, telefon numarası toplayıp kaydetme; yalnızca eğitimsel seçim.
- Dumanın her zaman orman yangını olduğunu kesin söyleme; belirti şüphelidir, güvenli biçimde bildirilebilir.

## 6. Hazırlık kararları

Aşağıdaki 3 uzman/yetkili uygulaması simüle edilir:
1. Bilgilendirme, erken uyarı ve güvenli tahliye/uzaklaşma güzergâhının belirlenmesi.
2. İlgili kurumlarca orman-yol çevresinde mevzuata uygun risk azaltıcı bakım, yanıcı yük yönetimi.
3. Yangın gözetleme, erken bildirim ve eğitim/ziyaretçi farkındalığı.

Bunlar üçüncü gün bütçe simülasyonuna bağlanabilir veri modelinde tutulmalı; şu fazda 1000 planlama puanı bütçesini devreye alma.

## 7. Hazırlık öncesi / sonrası simülasyon

**Kritik kural:** Önce ve sonra **aynı rüzgâr, sıcaklık ve kuruluk varsayımlarını** kullanır. Görselleştirme yaklaşık 35–50 sn veya atlanabilir.

- **Önce:** erken uyarı gecikir; ziyaretçi yönlendirmesi yetersiz; uzman ekiplerin müdahale koordinasyonu için gecikme yaşanabilir; uzaktan stilize duman ve tehlike bölgesi göstergesi.
- **Sonra:** erken bildirim/uyarı farkı belirgin; ziyaretçiler güvenli güzergâha daha erken yönlendirilir, ekipler haberdar olur; riskin olası etkisi azaltılabilir.
- **Yangın tamamen yok edilmez;** hazırlık suyu/rüzgârı/havayı değiştirmez ve sıfır zarar garantisi vermez.
- Görselleştirmede öğrenci yangının içinde kalmaz. Yangını yayma/kontrol etme mekanikleri yok. Müdahale detayları sadece yetkili yetişkinlere aittir.
- Karşılaştırma panelinde: uyarı süresi (nitel erken/geç), yönlendirme, uzman koordinasyonu, olası risk etkisi; **kesin zarar yüzdesi ve gerçek yangın tahmini verilmez**.
- `reducedMotion` açıkken animasyon yerine birkaç durağan aşama; tüm öğretici içerik erişilir.

## 8. Görev makinesi / mimari

Bölüm durumu:
`notStarted -> meetElif -> inspectRisks -> smokeDecision -> chooseMeasures -> beforeSimulation -> afterSimulation -> compare -> completed`.

Riskler:
`unseen -> identified -> decisionMade -> reviewed`.

- Oyun içi sahneler veri odaklı TypeScript yapılandırma (`src/data/forestFire.ts` vb.) ile tanımlanır.
- Scene adı önerisi `CamlikForestScene`; gerekiyorsa `ForestComparisonScene`.
- Mevcut ses, diyalog, görev, Phaser–React bağlantısı, tıkla-git, WASD, E/Enter, mobil dokunma sistemlerini kullan; eski sahneleri bozma.
- Bölüm tekrarı çift tamamlama/puan üretmez.
- Sunucu ilerleme kaydı henüz yoksa varmış gibi sunma.
- Simülasyon parametrelerinde *aynı koşullar* testi yapılmalı.
- Bellek/dinleyici temizliği sahne kapanışlarında düzgün yapılır.

## 9. Kabul testleri

1. `npm run build` temiz geçer; ilgili otomatik testler başarılı.
2. Şehir, belediye, okul, ev/tatbikat ve Dere Mahallesi regresyon testleri çalışır.
3. Yeni orman bölgesine ikinci gün haritasından erişim var; diğer afet sahneleri zorlanmadan açılmaz.
4. Üç riskin ayrı hotspot'ları, gerekçeli karar ekranları ve tamamlama kayıtları çalışır.
5. Elif ve AFİ ile konuşma, kısa diyalog, üç kademeli ipucu çalışır.
6. Duman mikro görevi güvenli davranışa yönlendirir; çocuk yangına yaklaşmaz.
7. Suçlayıcı/korkutucu metin, grafik, yüksek ses yok.
8. Aynı meteorolojik senaryo hem önce hem sonra kullanılır (test).
9. Hazırlık tüm yangın riskini sıfırlamış gibi gösterilmez.
10. Masaüstü 1440×1000 ve mobil 390×844: sahne, hedefler, diyaloglar görünür ve kullanılabilir.
11. Klavye, fare, dokunmatik, sessiz mod ve azaltılmış hareket çalışır.
12. Gir/çık tekrarında çift modal, dinleyici veya puan yok.
13. Şu gerçek ekran görüntüleri dosyalanır:
    - `docs/screenshots/camlik-overview-desktop.png`
    - `docs/screenshots/camlik-overview-mobile.png`
    - `docs/screenshots/camlik-elif-dialogue.png`
    - `docs/screenshots/camlik-risk-review.png`
    - `docs/screenshots/camlik-smoke-decision.png`
    - `docs/screenshots/camlik-before.png`
    - `docs/screenshots/camlik-after.png`
    - `docs/screenshots/camlik-comparison.png`
14. `docs/FAZ_06_TESLIM_RAPORU.md` testleri, varlıkları, eksikleri, değişen dosyaları açıklar.

## 10. Teslim ve durma noktası

- `feat/flood-dere-mahallesi` dalından `feat/forest-fire-camlik` oluştur.
- Kodları, testleri, PNG dosyalarını ve raporu **yalnızca yeni geliştirme dalına** commit/push yap.
- `main` dalına birleştirme veya Vercel üretim dağıtımı YOK.
- Sonraki heyelan ve çığ sahnelerine **geçme**.
- Kullanıcıdan önce orman görünümü ve hazırlık öncesi/sonrası ekranları için görsel onay iste.
