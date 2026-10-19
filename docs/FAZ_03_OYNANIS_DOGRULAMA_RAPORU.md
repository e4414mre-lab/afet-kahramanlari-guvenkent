# 5-A — öğretici risk avı ve oynanış kanıtları

Dal: `feat/school-risk-hunt`. Revizyon tabanı: `41437b9`.
Onaylı sınıfın 16 sıralı düzeni ve sanat stili korunur. Şehir meydanı,
belediye, Çağrı ve AFİ tasarımları değiştirilmedi. Sonraki aşama geliştirilmedi.

## Küçük çevre ve risk yerleşimi düzenlemeleri

- Mevcut ahşap/turkuaz palete uygun küçük duvar saati, tahtaya kısa ders yazısı
  ve zemine üç küçük tahliye yön işareti eklendi. Saat dekor niteliğindedir;
  yeni bir risk/görev veya etkileşimli nesne sayılmaz. Oda resmi değiştirilmedi.
- Uzun kitaplık, pencere yanındaki küre ve yüksek dolap mevcut duvar/pencere
  hizasına küçük düzeltmelerle oturtuldu. Ağır kutular depolama ünitesinin üst
  yüzeyine yerleştirildi. Görsel seçim alanları aynı yerleşim verisinden güncellenir.
- Kapı önündeki üç çanta büyütülüp sol geçişe taşındı. Çanta alanı gerçekten
  yürüyüşü engeller; sağdaki aralıkla çıkış kullanılabilir kalır. Çanta inceleme
  alanı ile açık kapı etkileşim alanı birbirine karışmayacak şekilde ayrıldı.
- Yetişkin çözümü canlandırmasında çantalar ayrılmış saklama alanına alınır;
  aynı anda çarpışma kaldırılır. Oyuncu aynı noktadan yürüyerek geçebilir.
  Bu değişiklik yalnızca sınıfın engel verisindedir; ortak hareket motoru korunur.
- Büyük risk uyarıları/etiketleri eklenmedi. İlk iki riskte mevcut AFİ rehberliği,
  sonraki dört riskte bağımsız keşif ve isteğe bağlı ipucu aynen korunur.

## Görsel kabul kanıtları

**[Masaüstü/mobil karşılaştırmalı oynanış galerisi](screenshots/risk-hunt/README.md)**

Yedi istenen an iki görünümde ayrı ayrı kaydedilir: yaklaşma, inceleme,
AFİ'nin ilk risk rehberliği, yanlış seçim geri bildirimi, doğru çözüm
kararının geri bildirimi, 3/6 ve 6/6 ilerleme. Ek olarak kapı engelinin
öncesi/sonrası iki görünümde kaydedilir: **toplam 18 oynanış PNG'si**.

Galeri dizini: `docs/screenshots/risk-hunt/`.
Her PNG, çekim anındaki salt okunur durumla
[`evidence-desktop.json`](screenshots/risk-hunt/evidence-desktop.json) ve
[`evidence-mobile.json`](screenshots/risk-hunt/evidence-mobile.json) içinde eşlenir.
Tarayıcı testleri görev durumuna/puana yazmaz; konum atlatmaz. Belediye ve
okul geçişi dâhil tüm ilerleme gerçek klavye, fare veya dokunmatik girdisidir.

### Eğitsel doğrulama

- Yanlış gerekçe ve tehlikeli çözüm seçilince açıklayıcı “Tekrar düşünelim”
  geri bildirimi gösterilir. Bulgu artmaz, ilerleme kaybolmaz.
- Doğru gerekçeden sonra risk sayılır; doğru çözüm seçimi yalnızca **planlandı**
  durumuna geçirir. “Öğretmene bildir” ve “Yetişkin çözümünü gör” ayrı eylemlerdir.
  Doğru çözüm ekranı henüz fiziksel uygulama tamamlanmış gibi sunulmaz.
- Çocuk ağır eşya taşımaz/sabitlemez. Güvenli karar yetkili yetişkine bildirmektir;
  uygulamanın bir eğitim canlandırması olduğu yazılıdır.
- 3/6 görüntüsünde üç ayrı riskin; 6/6 görüntüsünde altı ayrı riskin yetişkin
  çözümü görülmüştür. Tekrar inceleme çift sayım oluşturmaz.
- Dört güvenli nesne kendi açıklamalarıyla incelenir; risk sayacına eklenmez.
- Kapı fotoğrafları yalnızca farklı resimler değildir: gerçek aşağı yön girdisi,
  çözümden önce çanta alanında durur; çözümden sonra aynı geçiş hattında ilerler.

## Testler

```sh
npm run build
node --experimental-strip-types --test tests/*.test.ts
npm run preview -- --port 4173 --strictPort
# Ayrı terminal:
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/browser_smoke.py
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/school_risk_hunt_smoke.py
```

- **Build başarılı.** Mevcut Phaser/Vite büyük JS paketi uyarısı sürer; derleme hatası yoktur.
- **22/22 birim testi geçti.** Önceki görev/sayaç/rehberlik/rota testlerine ek olarak çantaların çözümden önce engel, yetişkin çözümünden sonra açık geçiş olduğu doğrulandı.
- **Meydan/belediye regresyonu geçti:** iki görünümde görevler, ayarlar, beşer giriş/çıkış ve eksik başkan görseli davranışı korundu.
- **Sınıf masaüstü ve mobil kabul turları geçti:** altı riskin yanlış/doğru neden ve çözüm seçimleri; planlama → bildirim → yetişkin çözümü; dört güvenli nesne; tekrar incelemede tek sayım; ayarların korunması.
- **Kapı engeli iki görünümde gerçek yürüyüşle geçti:** çanta alanındaki aşağı hareket çözümden önce durdu, çözümden sonra aynı geçiş hattında ilerledi. Sağdan çıkış her durumda erişilebilir kaldı.
- **Her iki görünümde beşer sınıf giriş/çıkışı geçti:** tek etkin sahne/tek tuval; 96 sahne nesnesi, 4 blur/1 pointer/4 etkileşim klavye dinleyicisi ve 26 doku sabit kaldı. GC sonrası JS heap büyümesi masaüstünde yaklaşık +0,32 MiB, mobilde +0,23 MiB; 15 MiB test sınırı aşılmadı. Bu kısa kontrol uzun süreli cihaz profili değildir.
- **Mobil yön kontrolü olay sınırı geçti:** HTML yön düğmesi dokunmaları alttaki oyun nesnelerine iletilmedi. Nesne testleri HUD/yön düğmeleri altında kalmayan gerçek sprite bölümüne dokunur; programatik nesne etkileşimi çağırmaz.
- **Eksik sınıf görseli testi geçti:** kitaplık PNG'si engellenince açık uyarı çıktı; hareket/inceleme kullanılabilir kaldı, JavaScript çökmesi olmadı. Başarılı akışlarda yatay taşma ve yakalanmamış JavaScript hatası görülmedi.
- **18/18 galeri PNG'si doğrulandı:** tamamı okunabilir PNG; masaüstü/mobil boyutları doğru; her birinin JSON durum kaydı istenen öğrenme anıyla eşleşiyor. Yanlış cevapta 0/6, doğru çözümde `planned` ve 0 yetişkin çözümü, ilerleme görüntülerinde 3/6 ve 6/6 ayrı ayrı kontrol edildi.

Son kabul kontrolünde masaüstü turu ve yenilenen mobil dokunma noktası seçimiyle
mobil tur ayrı oturumlarda tamamlandı. Tüm çekimler aynı üretim derlemesindendir.

Masaüstü Chromium 1440×1000; mobil Chromium dokunmatik emülasyonu 390×844.
Fiziksel telefon/tablet testi yapılmadı. PNG'ler emülasyonun gerçek viewport
çıktılarıdır; sonradan sayaç, geri bildirim veya etkileşim paneli eklenmedi.

## Korunan kapsam ve eksikler

Mevcut görev, yanlış/doğru cevap, rehberlik ve sayaç mantığı; ortak hareket,
inceleme kartları ve ayarlar değişmedi. Yeni puanlama/öğretmen servisi yoktur.
Yeni afet bölgeleri, deprem anı tatbikatı, sınav ve öğretmen paneli eklenmedi.
`main` ile birleştirme ve dağıtım yapılmaz; bu geliştirme dalında kalınır.

Yeni saat PNG'si OpenAI görsel üretim aracıyla üretildi. Önceki onaylı varlıklar
korunur. Yönlü karakter animasyonu, yetişkin animasyonu, seslendirme/müzik/efekt,
nihai atlas ve kesişim maskesi eksikleri önceki teslim raporundaki gibi sürer.
Ayrıntılar: [varlık listesi](../public/assets/school/README.md).

Bu teslim, öğretici ve oynanabilir risk avının kanıtlarını içerir; nihai sanat
ve ses teslimi olarak sunulmaz. Sonraki aşamaya geçilmez.
