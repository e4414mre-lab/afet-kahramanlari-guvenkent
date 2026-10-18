# Faz 1 — Oynanabilir meydan prototipi

`FAZ_01_GORSEL_VE_OYNANIS_PROTOTIPI.md` esas alınmıştır.
**Durum: oynanabilir prototip; görsel onay bekliyor. Nihai oyun sanatı değildir.**

## Kapsam ve dosyalar

- `src/game/CitySquareScene.ts`: klavye/tıkla-git hareketi, AFİ takibi ve
  süzülmesi, y derinlik sıralaması, sınırlı meydan ve karakter takip kamerası.
- `src/game/cityModel.ts`: veriyle tanımlı belediye/okul girişleri ve tipli
  `meet → school → complete` görev akışı. Belediye yakınında E veya Etkileşim
  görevi başlatır. Okul girişine varmak görevi tamamlar. Okula erken gitmek
  görevi atlatmaz. Aynı noktaya tekrar uğramak ilerlemeyi geri almaz.
- `src/components/GamePreview.tsx`: Phaser yaşam döngüsü, küçük görev/diyalog
  arayüzü, gerçek pointer capture kullanan dokunmatik yön tuşları ve etkileşim.
- `src/main.tsx`: öğrenci adıyla Keşfe Başla, meydan girişi, oyun içi ayarlara
  gidip konum/görev kaybetmeden dönme; sessiz mod ve mevcut tercihler.
- `src/styles/app.css`: dünya ağırlıklı masaüstü/mobil yerleşim.
- `public/assets/city/`: yerel konsept çevre ve ayrı transparan karakter PNG'leri.
- `tests/cityModel.test.ts`, `tests/browser_smoke.py`: görev kuralları ve
  gerçek Chromium üzerinde klavye/dokunmatik kabul kontrolü.

## Çalıştırma ve doğrulama

```sh
npm install --package-lock=false
npm run dev -- --port 5173 --strictPort
npm run build
node --experimental-strip-types --test tests/cityModel.test.ts
# Ayrı terminal; Python Playwright ve sistem Chromium gerektirir:
python tests/browser_smoke.py
```

Node 24 ve npm 11 ile doğrulandı. Repoda bağımlılık kilit dosyası bulunmuyor;
kurulum bu fazda bağımlılık bildirimlerini değiştirmez.

- Üretim derlemesi ve TypeScript kontrolü başarılı. Vite'ın mevcut büyük JS
  paket uyarısı devam eder; başarısız derleme değildir.
- Görev sırası, tekrar etkileşim ve yaklaşım yarıçapı için 3 birim testi.
- Masaüstü 1440×1000: öğrenci adı doğrulaması, yön tuşları, belediyede E,
  okulda görev tamamlama; ayarlardan dönüşte ilerlemenin korunması.
- Dokunmatik Chromium emülasyonu 390×844: gerçek touch pointer olaylarıyla
  yön kontrolü, dokunarak belediye etkileşimi, okula varış.
- Sessiz mod ve azaltılmış hareket tercihlerinin yeniden yüklemede korunması;
  yatay taşma ve JavaScript hata kontrolü. Gerçek telefon donanımı bu ortamda
  denenmedi.

## Sanat ve sınırlar

Başlangıç deposunda onaylı grafik yoktu. Üç AI üretimi konsept PNG eklendi;
karakterler arka plana gömülmedi. Basit geometrik şehir kurulmadı.
Ayrıntılı dosya ve eksik grafik listesi: `public/assets/city/README.md`.

Çevre tek boyalı katmandır. Yürüme yalnızca boş meydanla sınırlıdır; binalara,
dereye veya diğer bölgelere girilmez. Karakterler y sırasına göre çizilir;
bina/bitki arkasına geçiş ve katmanlı çevre henüz yoktur. Çağrı tek poz
kaydırılarak hareket eder; animasyon atlası eksiktir. Kamera, ölçek ve nihai
izometrik sanat uyumu ayrıca görsel onay gerektirir.

Okul girişinin görev tamamlandı durumu sonraki sınıf risk avı geçişini
belirtir; risk avı sahnesi açılmaz. Yeni afet bölgesi, sınav, veritabanı veya
öğretmen paneli geliştirilmedi. Ad, puan ve görev veritabanına yazılmaz;
görev yalnızca mevcut oyun oturumundadır. Ses varlığı bulunmadığından ses
çalınmaz; metin ve sessiz mod tercihleri korunur. Azaltılmış hareket,
AFİ'nin süzülmesini ve yumuşak kamera gecikmesini kaldırır.

## Görsel inceleme

[Masaüstü görünümü](screenshots/city-square-desktop.png) ·
[Dokunmatik görünüm](screenshots/city-square-mobile.png)

Bu görseller gerçek tarayıcı kabul testinde yakalandı.

**Görsel onay gelmeden sonraki bölge veya faza geçilmez.**
