# Faz 03 — Güvenkent İlkokulu ve 5-A sınıf risk avı

Son küçük çevre/kapı düzenlemeleri ve 18 gerçek oynanış kanıtı için
[güncel oynanış doğrulama raporuna](FAZ_03_OYNANIS_DOGRULAMA_RAPORU.md) bakın.
Aşağıdaki rapor önceki yerleşim tesliminin kaydıdır.

**İşlevsel keşif prototipi; sınıf yerleşimi revizyonu yeniden görsel onay bekliyor.**
Kaynak: GitHub `feat/town-hall-interior`, `c768aeb` (Faz 03 belgesi dâhil).
Geliştirme dalı: `feat/school-risk-hunt`. `main` ile birleştirme ve dağıtım yok.

## Sınıf düzeni revizyonu

Bu revizyon önceki `feat/school-risk-hunt` teslimi (`280e7cd`) üzerine yapılmıştır.

Kullanıcının görsel değerlendirmesine göre yalnızca sınıf düzeni yenilendi:

- Dört dağınık sıra yerine **4 sütun × 4 sıra = 16 tekli öğrenci yeri** var.
  Sandalyeler tahtaya dönük; ortada geniş, yanlarda ve sıra aralarında açık
  geçişler bulunur. Çağrı'nın tasarımı ve boyutu korunurken sıra genişliği
  120 dünya birimine ayarlandı; görsellerin en/boy oranları değiştirilmedi.
- Öğretmen masası tahtanın önündeki öğretim alanında; kitaplık pencere/duvar
  yanında, yüksek dolap sağ duvar tarafında, panolar duvar hizasında yer alır.
  Düzenli çantalar sağdaki saklama alanındadır. Riskli çantalar yalnızca çıkışın
  sol bölümünü daraltır; kapı ve çıkış etkileşimi erişilebilir kalır.
- Mevcut oda kabuğu, ışık ve parke aynen korunur. Açık ahşap/turkuaz kapı
  kanadı mevcut sağ kasaya yerleştirildi. Küçük **ÇIKIŞ ↓** levhası kapıyı
  belirtir; risk nesnelerine büyük uyarı işareti/etiketi eklenmedi.
- On incelenebilir nesnenin konumu/ölçeği, gerçek sprite seçim alanları,
  yaklaşım noktaları, 16 sıra çarpışması ve yetişkin çözümü sonrası taşınan
  nesnelerin konumları birlikte güncellendi. Görselin içine gömülü sahte
  etkileşim yoktur.
- Meydan/belediye sahneleri ve varlıkları, Çağrı/AFİ görselleri, ortak hareket
  kodu, görev durumu, ipucu, sayaç ve karar mantığı önceki commit ile aynıdır.
  Değişiklikler yalnızca sınıf sahnesi/verisi, sınıf görselleri, ilgili testler
  ve bu rapordadır. Yeni bağımlılık veya sonraki bölüm yoktur.
- `desk-facing-board.png` ve `door.png`, mevcut sınıf stiline uygun olarak
  OpenAI görsel üretim aracıyla hazırlandı. Eski sıra PNG'si de korundu.
  Kapı görselinden yalnızca kanat, Phaser doku çerçevesiyle kullanılır;
  mevcut kapı kasası ikinci bir kasayla örtülmez.

Mobil kabul sırasında yön düğmesine dokunmanın Phaser'ın pencere düzeyindeki
`touchstart` dinleyicisi üzerinden alttaki AFİ sprite'ına da ulaşabildiği
saptandı. Yalnızca `SchoolClassroomScene` içinde HTML düğmesi dokunmalarının
pencereye yayılması engellendi; React yön/inceleme/ipucu düğmeleri ve gerçek
tuval etkileşimleri korunur. Dinleyici sınıf kapanışında kaldırılır. Ortak
`AdventureScene`, meydan ve belediye girdisi değiştirilmedi.

**Yerleşim revizyonu yeniden görsel onay bekler.**


## Oynanabilir akış

- Mevcut belediye hikâyesiyle okul hedefini al; meydandaki okul kapısına yürü.
  E / Enter / Etkileşim veya kapıya tıklama/dokunma 5-A sınıfını açar.
  Onaylı meydan görselindeki okul cephesi korundu; ara koridor eklenmedi.
- Çağrı WASD/yön tuşları, zemine tıklama/dokunma veya sanal yön kontrolüyle
  yürür; AFİ takip eder. Sıraların çevresinde nesneye tıkla-git için sınıfa
  özgü yol bulma vardır. Meydan ve belediye eski hareket düzenini kullanır.
- Altı risk ve dört güvenli nesne bağımsız sprite/hitbox katmanlarıdır.
  Kameranın zoom ve kaydırma bilgisiyle gerçek dünya koordinatlarında seçilir.
- İlk iki bulgu kitaplık ve kapı çantaları için AFİ yönlendirmesi vardır.
  Sonraki dört riskin adı/çözümü otomatik gösterilmez; öğrenci keşfeder.
  İsteğe bağlı H / AFİ ipucu üç kademede ayrıntılanır.
- İnceleme kartında yakın görünüm, “Bu neden riskli?” ve “Ne yapmalıyız?”
  soruları bulunur. Yanlış seçim “Tekrar düşünelim” ve açıklayıcı ipucu verir;
  ilerleme veya puan kaybettirmez.
- Doğru karar sonrası **çözüm planlandı → öğretmene bildirildi → yetişkin
  çözümü görüldü** adımları açıkça bir canlandırmadır. Çocuğa ağır eşya
  taşıma/sabitleme, panoyu çekme veya tırmanma eylemi yaptırılmaz.
- Kutular aşağı alınır, çantalar ayrılmış alana ve küre pencere kenarından
  içeri taşınır; sabitleme için küçük bağlantı/onay işaretleri görünür.
- Altı yetişkin çözümü tamamlanınca AFİ özet verir. Gün 1 için hazırlık
  tamamlanır; gerçek deprem anı tatbikatı ve yeni afet bölgeleri açılmaz.
- Okuldan meydana dönüş ve yeniden giriş mümkündür; bulgular, güvenli nesne
  incelemeleri ve görev ilerlemesi yalnızca açık oturumda korunur.

## Altı risk ve güvenli kararlar

| Bulgu | Neden riskli? | Güvenli karar |
| --- | --- | --- |
| Sabitlenmemiş uzun kitaplık | Devrilebilir | Teknik personele sabitleme için bildir |
| Kapı önündeki çantalar | Tahliye yolunu daraltır, takılmaya neden olabilir | Öğretmen gözetiminde geçişin düzenlenmesini iste |
| Dolap üstündeki ağır kutular | Sarsıntıda düşebilir | Yetkili yetişkinden aşağı almasını iste |
| Sabitlenmemiş yüksek dolap | Devrilebilir | Teknik personele bildir |
| Pencere yanındaki ağır küre | Hareket edebilir veya düşebilir | Öğretmene bildir; güvenli yerleşimi yetişkin planlasın |
| Gevşek bağlantılı ağır pano | Duvardan ayrılabilir | Yetkili kişi bağlantıları kontrol etsin |

Dört güvenli nesne: sabitlenmiş alçak raf, geçişten uzak düzenli çantalar,
zemindeki kapalı hafif kutu, sağlam ve uygun yükseklikteki pano. Her biri
“neden daha güvenli?” açıklamasını verir; risk sayacını artırmaz.

Durumlar `notFound → identified → planned → assigned → verifiedFixed`.
Bulgu sayacı ve yetişkin çözümü sayacı ayrı ayrı 0/6–6/6'dır; güvenli nesne
incelemeleri ayrı 0/4–4/4 tutulur. Aynı nesneye tekrar tıklama ikinci sayım
üretmez. Öğretmen lider tablosuna veya dış sisteme puan/bildirim gönderilmez.

## Dosyalar ve mimari

| Dosya | Görevi |
| --- | --- |
| `src/game/SchoolClassroomScene.ts` | Oda, bağımsız mobilya/nesneler, gölgeler, y sırası, yönlendirme, yetişkin çözümü görselleri ve sınıf çıkışı |
| `src/game/classroomData.ts` | Altı risk/dört güvenli nesne, gerekçeler, seçenekler, geri bildirimler ve ipuçları |
| `src/game/riskHunt.ts` | Test edilebilir tipli bulgu durumları, tekil sayaçlar, güvenli nesneler ve rehberlik |
| `src/game/schoolLayout.ts` | Dünya boyutu, sıra/duvar çarpışmaları, yaklaşım noktaları, yeniden yerleştirme ve varlık listesi |
| `src/game/navigation.ts` | Sınıf için sınırlı A* ve tam doğru parçası/engel kesişim kontrolü |
| `src/components/InspectionPanel.tsx` | Kapatılabilir yakın inceleme kartı ve erişilebilir karar düğmeleri |
| `src/game/AdventureScene.ts` | Sınıfa özgü isteğe bağlı yol bulma/nesne seçimi; mevcut hareket ve yaşam döngüsü korunur |
| `src/game/story.ts` | Ortak oturumda risk avı ve sahneler arası ilerleme/özet köprüsü |
| `src/game/CitySquareScene.ts` | Mevcut okul kapısına sınıf sahnesi geçişi |
| `src/components/GamePreview.tsx`, `src/styles/app.css` | Üç sahne, küçük sayaçlar/inceleme kartı, sınıfa özgü mobil görünüm |
| `public/assets/school/` | 15 yerel PNG ve kaynak/eksik varlık listesi |
| `tests/riskHunt.test.ts`, `tests/navigation.test.ts` | Durum, eğitim verisi, sayaç, rehberlik ve erişilebilir rota testleri |
| `tests/school_risk_hunt_smoke.py` | Gerçek girdilerle okul/sınıf kabul testleri |
| `tests/town_hall_smoke.py` | Mevcut belediye kabul akışı; okul kapısındaki yeni metin beklentisi güncellendi |

Mevcut `src/main.tsx`, `TownHallScene.ts`, meydan/belediye/karakter PNG'leri ve
`package.json` korunur. Yeni bağımlılık veya veri tabanı servisi yoktur.
Sahneler aynı Phaser örneğinde başlatılır/durdurulur; klavye, pointer ve blur
dinleyicileri kapanışta temizlenir. Tekrar girişte tek tuval/tek etkin sahne vardır.

Klavye: yakındaki nesneler için **Q**, etkileşim için **E / Enter**;
karar düğmelerinde **Tab / Shift+Tab / Enter**, kartı kapatmak için **Esc**.
Native HTML düğmelerinin Enter davranışı Phaser tarafından engellenmez ve
bir tuş basışı hem düğmeyi hem dünyayı iki kez tetiklemez.

## Doğrulama

Node 24.19.0, npm 11.9.0, Python Playwright ve sistem Chromium kullanıldı.

```sh
npm run build
node --experimental-strip-types --test tests/*.test.ts
npm run preview -- --port 4173 --strictPort
# Ayrı terminal; değişmeyen üretim çıktısında:
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/browser_smoke.py
GUVENKENT_TEST_URL=http://127.0.0.1:4173 python -u tests/school_risk_hunt_smoke.py
```

- **Üretim derlemesi başarılı.** Vite'ın mevcut büyük JS paket uyarısı devam eder; derleme hatası değildir.
- **21/21 birim testi geçti.** Eski 12 test de çalıştırıldı. Altı risk/dört güvenli nesne verisi, yanlış/doğru karar, beş durum, tekrar sayım, rehberlik ve tüm nesneler arası erişilebilir rotalar doğrulandı.
- **Mevcut meydan/belediye kabul paketi başarılı:** 1440×1000 masaüstü ve 390×844 dokunmatik emülasyonda görev akışı, ayarlar ve beşer giriş/çıkış. Eksik başkan görselinde de oyun kullanılabilir kaldı.
- **Sınıf kabul paketi başarılı:** her iki boyutta altı riskin yanlış/doğru neden ve çözüm seçenekleri, bildirim, yetişkin çözümü, dört güvenli nesne ve 6/6–4/4 sayaçları ayrı ayrı çalıştırıldı.
- **Tekrar inceleme çift sayılmadı.** Tab/Enter ile gerçek HTML seçimleri, Q ile yakındaki nesne seçimi ve Enter ile kartın yalnızca bir kez kapanması doğrulandı.
- **Her iki boyutta beşer sınıf çıkış/yeniden giriş döngüsü geçti:** ilerleme korunur; tek etkin sahne/tek tuval, 93 nesne, 4 blur/1 pointer/4 etkileşim klavye dinleyicisi ve 24 doku sabit kaldı.
- GC sonrası sınıf JS heap büyümesi iki görünümde de testin 15 MiB sınırını aşmadı. Bu kısa kontrol uzun süreli donanım profili değildir.
- İlk çıkış gerçek kapı hotspotuna fare/dokunma ile, sonraki dört çıkış etkileşim kontrolüyle yapıldı.
- **Uzaktan tıkla-git ayrıca gerçek tarayıcı girdisiyle denendi:** Çağrı, kitaplığa giderken aradaki sıraların çevresinden yürüdü; konum atlatma kullanılmadı. Kapı ve inceleme görüntüleri bu ek kontrolde alındı.
- **Yeni dokunmatik regresyon kontrolü geçti:** gerçek yön düğmesiyle hareket sırasında DOM dokunması Phaser pencere girdisine ulaşmadı; görünür AFİ ipucu düğmesi ayrıca çalıştırıldı.
- Sessiz mod, konuşma balonları kapalıyken zorunlu yazı, azaltılmış hareket ve ayarlardan dönüşte bulgu koruması geçti.
- Kitaplık görseli kasıtlı engellenince açık uyarı çıktı; inceleme ve hareket kullanılabilir kaldı. Başarılı akışlarda yakalanmamış JavaScript hatası ve yatay taşma görülmedi.
- Testler soğuk önbellekte de doğru nesneye tıklamak için takip kamerasının gerçekten durmasını bekler; sabit bir ilk kare süresi varsaymaz.


QA `?qa=1` ile salt okunur durum/konum incelemesi yapar; tarayıcı testleri
teleport, otomatik görev atlatma veya puan yazma kullanmaz. Tüm ilerleme gerçek
klavye, fare ve touch/pointer girdileriyle yürür. Fiziksel telefon/tablet bu
ortamda denenmedi; mobil sonuçlar Chromium dokunmatik emülasyonudur.

## Görseller

- [Masaüstü — 1440×1000](screenshots/school-classroom-desktop.png)
- [Dokunmatik — 390×844](screenshots/school-classroom-mobile.png)
- [Mobil kitaplık incelemesi sonrası görünüm](screenshots/school-classroom-bookshelf-mobile.png)
- [Kapı geçişi ve çantalar](screenshots/school-classroom-entrance-desktop.png)
- [Yakın inceleme / karar kartı](screenshots/school-classroom-inspection-desktop.png)

GitHub:

- https://github.com/e4414mre-lab/afet-kahramanlari-guvenkent/blob/feat/school-risk-hunt/docs/screenshots/school-classroom-desktop.png
- https://github.com/e4414mre-lab/afet-kahramanlari-guvenkent/blob/feat/school-risk-hunt/docs/screenshots/school-classroom-mobile.png

## Varlık eksikleri / kapsam

Yeni sınıf görselleri AI ile üretilmiş, onay bekleyen konseptlerdir. Büyük
etiket yığınları veya primitif geometrik oda nihai sanat olarak sunulmaz.
Oda kabuğunda yalnızca sabit mimari/dekor bulunur; on incelenebilir nesne
ve karakterler bağımsız katmanlardır. Kaynak ve eksiklerin tam listesi:
[`public/assets/school/README.md`](../public/assets/school/README.md).

Yönlü yürüyüş atlası, yetişkin müdahale/tepki animasyonları, seslendirme,
müzik/efektler, nihai atlas optimizasyonu ve ayrıntılı ön/arka kesişim maskeleri
hâlâ eksiktir. Mevcut Çağrı/AFİ PNG'leri değiştirilmedi; hareket ve takip
çalışır, nihai yürüyüş animasyonu iddia edilmez. Sabitleme canlandırması
bağlantı işaretleri ve nesne yerleşimiyle gösterilir; gerçek dünya denetimi değildir.

Sessiz mod, beş bağımsız tercih ve azaltılmış hareket korunur. Ses dosyası
olmadığından görev, karar ve zorunlu güvenlik metinleri yazılı kalır.
Oturumlar arası/kalıcı veri tabanı kaydı yoktur.

Ev, gerçek deprem tatbikatı, sel, yangın, heyelan, çığ, final sınavı veya
öğretmen paneli geliştirilmedi. `main` birleştirmesi ve dağıtım yapılmadı.

**Kullanıcı görsel onayından önce sonraki oyun bölümüne geçilmez.**
