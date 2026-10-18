# Faz 02 — Belediye iç mekânı ve ilk hikâye görevi

**İşlevsel prototip; yeni iç mekân sanatı görsel onay bekliyor.**
Kaynak: GitHub `feat/city-square-prototype`, `e18412c` (Faz 02 belgesi dâhil).
Geliştirme dalı: `feat/town-hall-interior`. `main` ile birleştirme veya dağıtım yapılmadı.

## Uygulanan akış

1. Meydanda belediye kapısına yaklaş: E / Enter / Etkileşim veya kapıya
   tıklama/dokunma. Uzaktan seçim Çağrı'yı önce kapıya yürütür.
2. Kısa kararmayla belediye sahnesi açılır. Azaltılmış harekette kararma yoktur.
3. Belediye başkanıyla konuş. Çocuk Belediye Başkanı unvanının temsilî
   olduğu, gerçek belediye/acil durum yetkisi vermediği açıkça anlatılır.
4. Masadaki beratı inceleyip **Beratı kabul et** seçeneğiyle kabul et.
   Geç seçeneği kabul yerine geçmez.
5. Kent planındaki okul vurgusunu incele; **Rotayı not et** ile
   “Güvenkent İlkokuluna git, güvenli sınıfı birlikte keşfedelim” hedefini al.
6. Görev defteri mevcut hedefi her aşamada özetler. Yanlış sıradaki nesneler
   anlaşılır geri bildirim verir; ilerlemeyi atlatmaz veya geriye almaz.
7. Ön kapıdan meydana dön. Okul girişi vurgulanır; okula varış tanınır.
   Okul/sınıf risk avı bu fazda yalnızca sonraki aşama geçiş noktasıdır.

AFİ üç kademeli ipucu verir (AFİ düğmesi, robotun kendisi veya H). Masaüstü
WASD/yön tuşları, E/Enter; dokunmatikte sanal yön tuşları, zemine dokunarak
yürüme, nesneye dokunarak yaklaşma ve Etkileşim vardır. Diyaloglar 1–2 kısa
cümlelik sayfalardır; Devam/Geç ve klavye karşılıkları bulunur. Zorunlu
uyarı, konuşma balonları ve tüm sesler kapalıyken de okunur.

## Mimari ve değişen dosyalar

| Dosya | Değişiklik |
| --- | --- |
| `src/game/AdventureScene.ts` | Mevcut hareket hızı, kamera yaklaşımı, karakter görselleri ve AFİ takibi ortaklaştırıldı; gerçek kamera koordinatlarında nesne seçimi, y derinliği, çarpışma, geçiş ve dinleyici temizliği eklendi. |
| `src/game/CitySquareScene.ts` | Mevcut meydan görseli ve hareket sınırları korundu; belediye kapısı iç mekâna, okul hedefi ortak hikâyeye bağlandı. |
| `src/game/TownHallScene.ts` | Oda kabuğu, bağımsız masa/başkan/kent planı/defter katmanları ve okul vurgusu. |
| `src/game/townHallData.ts` | Nesne hitbox'ları, yaklaşım noktaları, mobilya/başkan/ön duvar çarpışmaları, varlık yolları. |
| `src/game/story.ts` | Tipli ortak oturum; `notStarted → speakToMayor → inspectCertificate → reviewCityPlan → goToSchool`; diyalog, görev defteri, güvenlik açıklaması ve ipuçları. |
| `src/components/GamePreview.tsx` | Tek Phaser örneğinde iki sahne; kısa diyaloglar, AFİ ipucu, ayarlar köprüsü, açık görsel yükleme uyarısı. |
| `src/styles/app.css` | Küçük diyalog eylemleri, güvenlik yazısı ve mobil yerleşim. |
| `public/assets/town-hall/` | Beş yeni yerel konsept PNG ve sanat/eksik varlık açıklaması. |
| `tests/story.test.ts`, `tests/townHallData.test.ts` | Görev sırası/kabul/güvenlik/ipuçları ve erişilebilir yaklaşım/çarpışma kontrolleri. |
| `tests/town_hall_smoke.py`, `tests/browser_smoke.py` | Gerçek girdilerle mevcut meydanı da kapsayan genişletilmiş kabul akışı. |
| `docs/screenshots/town-hall-*.png` | Son kabul çalışmasının gerçek ekran görüntüleri. |
| `README.md`, `.gitignore` | Güncel çalıştırma/test akışı ve Python test önbelleğinin dışlanması. |

Mevcut `public/assets/city/` dosyaları, önceki meydan ekran görüntüleri ve
React giriş/öğretmen/ayarlar ekranının kaynak dosyası `src/main.tsx` değişmedi.
Belediye kapısındaki eski tek adımlı görev artık bu belgedeki iç mekân
hikâyesini takip eder; meydanın hareket ve kamera mekanikleri korunur.

## Komutlar ve sonuçlar

Node 24.19.0, npm 11.9.0 ve sistem Chromium kullanıldı.

```sh
npm install --package-lock=false --cache /workspace/.npm-cache --no-audit --no-fund
npm run build
node --experimental-strip-types --test tests/*.test.ts
npm run dev -- --port 5173 --strictPort
# Ayrı terminal; Python Playwright ve /usr/bin/chromium gerektirir:
python tests/browser_smoke.py
```

Repoda kilit dosyası bulunmadığı için yeni kilit dosyası üretilmedi;
`package.json` ve bağımlılık sürüm aralıkları değiştirilmedi.

- Kurulum başarılı. TypeScript ve üretim derlemesi başarılı. Vite'ın
  500 kB üzerindeki JS paket uyarısı devam eder; derleme hatası değildir.
- **12/12 birim testi geçti.** Mevcut üç Faz 1 birim testi de çalıştırıldı.
- **1440×1000 masaüstü**: öğrenci adı doğrulaması, WASD ve yön tuşları,
  uzaktan nesne seçip gerçekten yaklaşma, E/Enter, yanlış sıra, başkanın
  güvenlik sayfası, açık berat kabulü, kent planı ve görev defteri.
- **390×844 dokunmatik Chromium emülasyonu**: gerçek touch/pointer capture,
  sanal yön kontrolü, ayrı nesnelere dokunma, tüm diyalog ve kabul adımları,
  kapı giriş/çıkışı ve okul yönlendirmesi. Bir yaklaşımda CPU 4× yavaşlatıldı.
  Fiziksel tablet/telefon bu ortamda test edilmedi.
- **Her iki boyutta beşer tam giriş/çıkış döngüsü**: ilerleme korunur;
  tek etkin sahne/tek tuval, sabit nesne/dinleyici/doku sayıları doğrulanır.
  GC sonrası JS heap ölçümüyle belirgin büyüme kontrol edilir; bu sınırlı
  kontrol uzun süreli bellek profilinin yerine geçmez. Son turda belediye
  sahnesi her dönüşte 18 nesne, 4 blur/1 pointer/3 etkileşim klavye dinleyicisi
  ve 8 doku ile sabit kaldı. GC sonrası JS heap farkı masaüstünde yaklaşık
  +0,21 MiB, dokunmatikte +0,18 MiB oldu.
- Kısa E/Enter basışları kare güncellemesine kadar kuyrukta tutulur; aynı
  karede keyup gelmesi etkileşimi kaybettirmez. Klavye dinleyicileri sahne
  kapanışında kaldırılır.
- Ayarlara gidip dönünce iç mekân, konum ve görev korunur. Sessiz mod,
  beş bağımsız tercih ve azaltılmış hareket bozulmaz; seçilen tercihler
  yeniden yüklemede korunur. Azaltılmış harekette AFİ süzülmesi durur.
- Tek NPC görseli engellenerek yükleme hatası denendi: anlaşılır uyarı çıktı,
  hareket ve hikâye kullanılabilir kaldı; yakalanmamış JavaScript hatası yok.
- Başarılı akışlarda JavaScript hatası ve yatay ekran taşması görülmedi.
  Çağrı, AFİ ve başkanın görünümü ekran görüntülerinde ayrıca incelendi.

QA testleri `?qa=1` ile yalnızca okunur bir tanı görünümünü kullanır; oyuncu
konumu veya görev durumu bu arayüzden değiştirilemez. Testler gerçek klavye,
farenin/dokunmanın girişleriyle yürür; teleport veya otomatik görev atlatma yoktur.

## Görsel inceleme

- [Masaüstü — 1440×1000](screenshots/town-hall-desktop.png)
- [Dokunmatik — 390×844](screenshots/town-hall-mobile.png)

GitHub üzerinden:

- https://github.com/e4414mre-lab/afet-kahramanlari-guvenkent/blob/feat/town-hall-interior/docs/screenshots/town-hall-desktop.png
- https://github.com/e4414mre-lab/afet-kahramanlari-guvenkent/blob/feat/town-hall-interior/docs/screenshots/town-hall-mobile.png

## Sanat durumu ve sınırlar

Yeni oda, ayrı belediye masası/berat, kent planı, görev defteri ve başkan
sprite'ları AI ile üretilmiş yüksek ayrıntılı **konseptlerdir**. Büyük etiket
kutularıyla donatılmış bir arka plan veya primitif oda çizimi kullanılmadı.
Varlıkların en/boy oranları korunur. Kaynak ve eksiklerin tam listesi:
[`public/assets/town-hall/README.md`](../public/assets/town-hall/README.md).

Çağrı/AFİ'nin mevcut kimliği ve görselleri korundu. Yönlü yürüyüş atlasları,
başkan tepki kareleri, nihai atlas/maskeler, menteşeli kapı animasyonu ve ses
varlıkları hâlâ eksiktir; nihai sanat teslimi tamamlanmış sayılmaz. Kapı için
bu fazda kısa kararma kullanılır. Berat masa görselinin parçasıdır; ayrı
inceleme/kabul etkileşimi işlevseldir. Mobilyalar ve NPC oda kabuğundan
bağımsızdır. Görsel oranlar, perspektif uyumu ve üretim sanatı kullanıcı
onayından sonra geliştirilebilir.

İlerleme yalnızca açık oturumda tutulur; sunucuya kayıt veya öğretmen hesabı
iddiası yoktur. Yeni afet bölgesi, Supabase, sınav, okul içi veya öğretmen
paneli geliştirilmedi. Gerçek dağıtım yapılmadı.

**Sonraki aşamaya geçmeden kullanıcı görsel ve işlevsel onayı beklenir.**
