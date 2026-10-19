# Faz 05 — Dere Mahallesi: Sel ve taşkın

Kaynak: `feat/home-earthquake-drill`, `f2f116b` (Faz 05 şartnamesi dâhil).
Geliştirme: `feat/flood-dere-mahallesi`. `main` birleştirmesi yapılmadı.
Yalnızca Dere Mahallesi geliştirildi; görsel ve pedagojik onay beklenir.

## Oynanabilir akış

Deprem tatbikatının gerçek tamamlanması ikinci gün bölge seçimini açar.
Meydanda açılan seçimde Dere Mahallesi oynanabilir; Çamlık, Yamaç ve Karlıtepe
“Henüz geliştiriliyor” olarak kapalıdır. Sıraya zorlayan başka bölge yapılmadı.
Hasan Amca ile konuşulur; üç risk yüksek güvenli meydandan incelenir.
Her nesnede yanlış karar açıklama ve yeniden deneme verir, doğru gerekçe ayrı
adımda not edilir. Öğrenci suya/gidere girmez, yapıyı taşımaz, köprüden geçmez.
Üç araştırmadan sonra hazırlık panosunda en az bir güvenli öneri seçilir.

- Gider/dere çevresi bakımını yetkili ekiplere yönlendirme.
- Riskli kullanım değerlendirmesi ve geçiş güvenliği planı.
- Erken uyarı, bilgilendirme ve yüksek güvenli güzergâh.

Yanlış köprüden geçme önerisi açıklanır; tehlikeli eylem oynatılmaz.
Önce ve sonra 45 saniyelik aynı yoğun yağış/dere yükselmesi izlenir; “Geç / özeti
göster” beklemeyi kaldırabilir. Ardından kısa karşılaştırma ve rapor alınır.
Hazırlık yerel birikimi ve uyarıya erişimi iyileştirebilir; su seviyesi/kapalı
geçişler otomatik yok olmaz, kesin zarar yüzdesi/güvenlik garantisi verilmez.
Bütçe ekonomisi veya sunucu kaydı eklenmedi.

## Mimari ve güvenlik

- `src/data/flood.ts`: içerik, üç aşamalı ipuçları, hazırlık seçenekleri ve ortak
  dondurulmuş yağış parametreleri; aynı zamanda simülasyon kare hesabı.
- `FloodFlow`: `notStarted → meetHasan → investigate3 → choosePreparedness →
  beforeSimulation → afterSimulation → compare → completed`; her risk
  `unseen → identified → decisionMade → reviewed`. Dışa verilen durum, simülasyon
  ve diğer aşamaları ayıran discriminated union tipindedir. Çift tık/tekrar ek puan üretmez.
- `FloodScene` / `floodLayout`: onaylı ortak hareket motorunun ayrı sahnesi;
  su ve alçak yol erişimi yürüyüş sınırı/çarpışmayla engellenir, bütün gözlem
  noktaları kuru meydandadır. Köprü her iki yağış durumunda kapalıdır.
  Hasan/pano ayak izi ve ön bahçe duvarı da ayrı çarpışma sınırlarıyla korunur.
- `FloodPanel`: gerçek nesne incelemesi, açıklamalı kararlar, 45 sn gösterge,
  geç/özet, karşılaştırma ve tekrar. Kritik yönergeler konuşma metni kapalıyken
  de görünür. Klavye odakları ve dokunmatik düğmeler kullanılır.
- Çağrı/AFİ görselleri, takip motoru, mevcut okul/belediye/ev modelleri korunur.
  İkinci gün geçişi için yalnızca oturum, meydan yönlendirmesi ve görünüm kaydı eklenir.
- Hazırlıklar `FloodPreparationRecord` JSON tipiyle dışa aktarılabilir; yalnızca
  açık oturumda tutulur. Gerçek ekip bildirimi veya Supabase kaydı taklit edilmez.
- Sessiz/azaltılmış hareket, ayarlarda duraklama ve sahne temizliği korunur.
  TTS yalnızca seslendirme açık ve Türkçe sistem sesi mevcutsa kullanılır.

## Doğrulama

```sh
npm run build
node --experimental-strip-types --test tests/*.test.ts
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/browser_smoke.py
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/school_risk_hunt_smoke.py
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/flood_smoke.py
```

- `npm run build`: başarılı; mevcut Phaser/Vite 500 kB paket boyutu uyarısı sürer.
- Birim testleri: **30/30 başarılı**. Önce/sonra yağış parametreleri, tüm zaman
  örneklerinde aynı dere seviyesi, kapanan geçişlerin hazırlıktan sonra da kapalı
  kalması, tekrar/çift tık, JSON dışa aktarımı, üç ipucu, gerçek tamamlanma kapısı
  ve bütün güvenli yaklaşım noktalarına A* erişimi kapsanır.
- Bağımsız Dere sahne/bileşen testi: masaüstü ve dokunmatik emülasyonunda
  üç gerçek sprite/hitbox, yanlış/doğru kararlar, hazırlıklar, simülasyon,
  karşılaştırma ve ikinci denemede tek tamamlanma başarılı.
- Masaüstü tam kabul: belediye/altı okul riski/altı ev nesnesi/deprem tatbikatı/
  gerçek buluşma ve yeniden oynama geçildi. Sonra ikinci gün seçimi, üç güvenli
  risk araştırması, AFİ'nin üç ipucu ve Enter ile konuşmayı kapatma, üç hazırlık,
  yanlış köprü önerisi, 45 sn önce senaryosu ve geç/özet, aynı yağışlı sonra,
  karşılaştırma, tekrar deneme ve beş mahalle giriş–çıkışı başarılı.
  Nesne/dinleyici/doku sayıları sabit; tamamlanma sayısı 1.

- Mobil tam kabul: aynı ilk gün akışı ve ikinci gün akışı dokunmatik emülasyonda
  başarılı. Üç nesne gerçek sprite üzerinden dokunularak açıldı; gider/kapalı
  köprü, yanlış karar, hazırlık, geç/özet ve karşılaştırma geçti. Beş mahalle
  giriş–çıkışında 29 sahne nesnesi, 4 blur / 1 pointer / 4 klavye dinleyicisi
  ve 43 yüklenmiş doku sabit kaldı. Masaüstünde de aynı değerler sabittir.
- Her iki görünümde ayarlar sırasında simülasyon saati durdu; sessiz/metin kapalı
  ve azaltılmış hareket tercihleri ilk günden korundu. Kritik yazılar görünür;
  normal hareket açıldığında da masaüstü senaryosu tamamlandı.
- Sekiz yeni PNG dosyası açılıp boyutları ve biçimi doğrulandı. Mobil kartlar
  köprü/dere görüntüsünü koruyacak biçimde kısaltıldı; ayrıntılı açıklamalar
  karşılaştırmada ve sayfadaki kalıcı güvenlik metninde bulunur.

- Eski şehir/belediye kabul paketi: masaüstü ve dokunmatik testleri başarılı;
  başkan, berat, kent planı, görev defteri, beş giriş–çıkış döngüsü ve eksik
  başkan görselinde oynanabilir uyarı kontrolü geçti.

- Eski sınıf kabul paketi: masaüstü/dokunmatik **6 risk + 4 güvenli nesne**,
  beş giriş–çıkış döngüsü ve sabit 96 nesne / 26 doku kontrolü başarılı.
  Eksik kitaplık görselinde açık uyarı, oynanabilir inceleme ve çökmeden devam
  kontrolü de geçti. Önceki sahnelerin test çıktısı PNG'leri kaynak sürüme
  döndürülerek yalnızca yeni bölüm görüntüleri bu teslimde değiştirildi.

- Son eklenen NPC/pano/bahçe duvarı ayak izleri sonrası tekrar derleme ve
  30 birim testi başarılı. `python -u tests/flood_smoke.py --component
  --navigation-only` masaüstü ve dokunmatikte geçti: Çağrı Hasan'ın içinden
  yürüyemiyor; üç gerçek nesneye ve hazırlık panosuna güvenli konumdan erişiyor.
  Bu son kontrol simülasyon zamanını tekrar bekletmeyen hedefli bir gezinti testidir.
- İlk AFİ turunda saptanan Enter odağı sorunu, yeni bölüm konuşmasının Tamam
  düğmesine odaklanmasıyla giderildi; tam masaüstü turunda üç ipucu Enter ile
  kapatılarak doğrulandı. Giderin mobil yön düğmeleri altında kalan önceki
  yerleşimi alt yol üzerindeki okunaklı konuma alındı; çocuk kuru meydanda kaldı.
- Son üretim derlemesinde test fixture dosyaları bulunmadığı doğrulandı.
  Tarayıcı hata/yatay taşma kontrollerinde hata yoktur.

Varsayılan uçtan uca kabul, görev yazma, teleport veya geçiş kilidi atlatma kullanmaz.
Ayrıca `npm run dev -- --port 5173 --strictPort` çalışırken
`python -u tests/flood_smoke.py --component` bağımsız sahne/bileşen testidir.
Bu yardımcı test doğrudan yalnızca Dere sahnesini kurar; ilk gün kilidini test
ettiği iddiasında değildir ve görüntülerini `/tmp/guvenkent-flood-component`
altına yazar. Fixture HTML/TSX dosyaları üretim derlemesinin girişleri değildir;
oyuncu uygulamasına kestirme giriş veya durum yazma API'si eklenmedi.

Varsayılan `flood_smoke.py`, mevcut `home_smoke.py` akışını gerçek girdilerle tamamlayıp
aynı açık oturumdan ikinci güne geçer; eski test doğrulamaları kaldırılmaz.
Masaüstü 1440×1000; mobil 390×844 Chromium dokunmatik emülasyonudur, fiziksel
telefon/tablet denenmedi. Simülasyon gerçek taşkın tahmini değildir; yayın öncesi
resmî yerel yönergeler ve eğitimcilerle pedagojik doğrulama beklenir.

Güncel ilk konuşma, nesne inceleme ve beş anın masaüstü/mobil kanıtları:
[Kanıt ve pedagojik kontrol raporu](FAZ_05_KANIT_RAPORU.md).

## Ekran görüntüleri

| An | Masaüstü | Mobil |
| --- | --- | --- |
| Güvenli risk araştırması | [Aç](screenshots/flood-area-desktop.png) | [Aç](screenshots/flood-area-mobile.png) |
| Hazırlık öncesi | [Aç](screenshots/flood-before.png) | [Aç](screenshots/flood-before-mobile.png) |
| Hazırlık sonrası | [Aç](screenshots/flood-after.png) | [Aç](screenshots/flood-after-mobile.png) |
| Aynı yağış karşılaştırması | [Aç](screenshots/flood-comparison.png) | [Aç](screenshots/flood-comparison-mobile.png) |

## Görseller ve kalan eksikler

[Yedi yerel sanat varlığı ve kaynak notları](../public/assets/flood/README.md).
Detaylı sıcak diorama, ayrı NPC/köprü/depo/gider ve küçük pano kullanılır;
teknik şekillerden oluşmuş tamamlanmış oyun olarak sunulmaz. Su/yağış katmanları
stilize eğitim gösterimidir. Yönlü NPC animasyonu, kayıtlı profesyonel Türkçe
seslendirme, dere/yağmur ses kayıtları, optimize atlaslar ve ayrıntılı kesişim
maskeleri eksiktir. Bunlar sonraki bölge geliştirmek için gerekçe yapılmadı.
