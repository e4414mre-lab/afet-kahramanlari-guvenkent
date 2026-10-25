# FAZ 11 — Öğretmen paneli ve güvenli öğrenci takibi

Tarih: **26 Ekim 2026**. Kaynak: `feat/final-assessment`, `be10636`.
Teslim dalı: `feat/teacher-dashboard-supabase`.

## Bağlantı durumu — canlı entegrasyon eksik

**Gerçek bir Supabase projesi bağlı değildir.** Bu ortamda Supabase proje URL'si,
yayımlanabilir/anon anahtarı veya sunucu service-role anahtarı bulunmuyor.
Canlı öğretmen hesabı oluşturulmadı; gerçek çocuk verisi kullanılmadı.

| Özellik | Gerçekte çalışan kapsam | Bağlantı bekleyen kısım |
| --- | --- | --- |
| Öğretmen ekranları | Masaüstü/mobil/tablet arayüzü, arama, sıralama, detay ve boş durum; açıkça etiketli kurgusal demo | Gerçek Auth girişi/çıkışı, e-posta/parola sıfırlama uçtan uca doğrulaması |
| Sınıf oluşturma ve bağlantı | SQL fonksiyonları, sahiplik, hash, 24 saat süre, yenileme/kapatma testleri gerçek yerel PostgreSQL'de | Staging migration/Edge dağıtımı ve gerçek öğretmenle sınıf oluşturma |
| Öğrenci katılımı | Form ve hata/bağlantısız durum, token'ın URL'den kaldırılması; SQL katılım/oturum testleri | Canlı bağlantıyla katılma, ağ üzerinden oturum doğrulama |
| İlerleme ve sonuç takibi | Sunucu şeması/RPC ve sınıfa bağlı oyun eşitleme adaptörü; öğretmen görünümü | Gerçek Supabase projesinde kalıcı kayıt ve yeniden eşitlemenin uçtan uca kabulü |
| İlk beş | Sunucuda en iyi tamamlanmış sınav ve deterministik beraberlik SQL sorgusu; gerçek PostgreSQL testleri | Gerçek proje üzerindeki verilerle doğrulama |
| Final değerlendirme | Mevcut ekran/etkileşimler, 60 kayıt, seçici ve puanlayıcı; Node/Vite alıştırma sunucusu üzerinde çalışır | Sınıf modunda Edge + PostgreSQL üzerinden canlı sınav doğrulaması |

**Demo – veri kaydedilmiyor** etiketi bütün örnek öğretmen ekranlarında vardır.
Demo bir giriş yöntemi değildir. Sabit şifre/öğretmen hesabı yoktur. Demo sınıf
oluşturma, gerçek bağlantı üretme ve kaydetme düğmeleri devre dışıdır. Supabase
ayarları yokken gerçek giriş ve sınıfa katılım düğmeleri de devre dışıdır.
Örnek görünümden hiçbir Supabase isteği gönderilmediği tarayıcıda doğrulanır.

## Gerçek Auth ve yetkilendirme tasarımı

Öğretmen REST istemcisi gerçek Supabase Auth parola girişi, bellek içi access/
refresh token, yenileme, çıkış ve parola sıfırlama API'lerini kullanır. Auth
kullanıcısı olmak tek başına öğretmen yetkisi vermez: kurum yöneticisinin
`guvenkent.teacher_profiles` kaydı gerekir. Kullanıcının metadata'sındaki
`role=teacher` veya istek gövdesindeki rol/öğrenci ID'si yetki oluşturmaz.
Oturum hatasında sınıf ve öğrenci verileri ekrandan temizlenir.

Öğretmen token'ları localStorage'a yazılmaz. Sayfa yenilemesi yeniden giriş
ister. Parola sıfırlama dönüşünde fragment temizlenir; geçerli Auth token'ı
olmadan parola değiştirilemez. Auth/JWT'nin gerçek ağ davranışı ve e-posta
akışı henüz **canlı projede test edilmedi**. Access JWT'nin kalan geçerliliği
Supabase Auth ayarlarına bağlıdır; kurum kısa JWT süresi ve hesap iptal
politikasını staging'de doğrulamalıdır.

Öğretmen sınıf listesi ve her mutasyon `auth.uid()` ile sınıf sahibini denetler.
RLS bütün uygulama tablolarında açıktır. Öğrencilerde anonim takma adla
Supabase DB okuma/yazma yetkisi açılmaz. Öğrenci işlemleri yalnız Edge Function
ve servis rolüne sınırlandırılmış RPC'lerden geçer. Gizli anahtar yalnız Edge
ortamındadır; repo veya VITE değişkeninde yoktur.

## Öğrenci kimliği ve bağlantılar

- Öğrenci sadece 2–30 karakterlik ad/takma ad verir. NFKC normalizasyonu,
  uzunluk ve kontrol karakteri denetimi hem istemci hem sunucu sınırında vardır.
  React metin olarak render eder; kullanıcı HTML'i çalıştırılmaz.
- Takma ad **kimlik doğrulaması değildir**. Her katılım yeni rastgele UUID,
  ayırt edici kısa kod ve ayrı 256 bit oturum kapasitesi alır. Aynı adla iki
  katılım başka öğrencinin kaydını açmaz. Öğretmen sınıfta sözlü doğrulama yapar.
- Katılım bağlantısı 256 bit rastgele token içerir, veritabanında yalnız
  SHA-256 hash'i tutulur; 24 saatte biter. Yenileme eskisini iptal eder.
  Kapatma yeni katılımı durdurur; arşivleme mevcut öğrenci oturumlarını da iptal eder.
- Link fragment kullanır (`/join#class=...`); fragment adres çubuğundan hemen
  temizlenir, standart HTTP Referer yoluna yazılmaz. Ham link öğretmene yalnız
  üretim/yenileme yanıtında gösterilir. Bağlantı erişim anahtarıdır.
- Öğrenci oturumu 8 saatle sınırlıdır; hash'i sunucuda, ham kapasite yalnız
  ilgili sekmenin sessionStorage'ındadır. API öğrenciyi bu kapasiteden bulur;
  istemciden gelen `studentId` kabul edilmez. Çıkış/sona erme sonrası eski
  kapasite reddedilir. Çevrimdışı çıkışta sunucu iptalinin doğrulanamadığı
  açıklanır; cihazdaki kapasite temizlenir.
- Başka öğrencilerin listesi, ham yanıtları veya sıralaması öğrenciye açılmaz.
  Takma adını yeniden yazmak eski oturumu geri kazandırmaz.

## Sunucu tarafı final puanlaması

Önceki finalin oyun ekranı, soru türleri, dokunmatik/klavye etkileşimleri ve
pedagojik v1.1 içeriği korunur; **tarayıcıda cevap anahtarıyla puanlama kaldırıldı**.

`RemoteFinalFlow` iki dürüst çalışma yolunu ayırır:

1. **Sınıfa bağlı mod:** öğrenci kapasitesiyle Edge Function → PostgreSQL.
   Soru seçimi ve puanlama SQL'de yapılır. Bağlantı/oturum hatasında yerel
   puanlamaya sessiz geçiş yoktur; aynı deneme yeniden eşitlenir.
2. **Yerel sunucu alıştırması:** `npm run dev` / `npm run preview` içindeki
   Node middleware eski saf seçici/puanlayıcıyı sunucuda çalıştırır. Öğretmen
   sınıfına hiçbir kayıt yazmaz; bu durum final ekranında açıklanır. Oturum
   bir saatlik, bellek içi ve sınırlı sayıda anonim alıştırmadır.

**Statik `dist` dosyaları tek başına artık final puanlama sunucusu değildir.**
Node/Vite alıştırma sunucusu yoksa ve öğrenci bağlı bir Supabase sınıfında
oynamıyorsa final ekranı sunucu eksikliğini gösterir; sahte 300 puan veya
başarılı sınıf kaydı üretmez. Vercel üretim yayını yapılmadı.

Tam banka/veri ve eski saf değerlendirici geriye dönük testler için kaynak
konumlarında tutulur; tarayıcı çalışma ağacına import edilmez. Yeni
`assessmentPresentation.ts` yalnız sunum sabitleri ve cevapsız tipler içerir.
Üretim paketinde 60 özel açıklama, D/Y ifadelerinin tam havuzu ve `correctZone`
bulunmadığı test edilir. Geliştirme sunucusu banka, eski özel değerlendirici,
Node sunucu, migration ve Vite yapılandırma dosyalarına HTTP erişimini engeller.
Gizli anahtar yanlışlıkla VITE anahtarına konursa derleme **pakete yazmadan önce** durur.

Sınıfa bağlı sınavda:

- Sunucu rastgele seed üretir ve 15 soru kimliğini kaydeder. Her afet×tür bir kez,
  5/5/5 tür ve 5 kolay/6 orta/4 zor korunur. SQL tohumlu hash sıralaması kullanır;
  seed denemeye aittir, istemci tarafından seçilemez.
- Eşleştirmede sol/sağ kartlar ayrı ve ilişkisiz opak kimliklerle servis edilir.
  Aynı `p1` ID'si doğru çifti ele vermez. Sürükle kartlarında `correctZone`, D/Y'de
  `correct` gönderilmez. Açıklama ancak ilgili ilk yanıtın geri bildiriminde açılır.
- `submit_answer` kapasiteyi, sahipliği, aktif soruyu, yanıt şekli/hedefleri ve
  UUID idempotency anahtarını doğrular. İlk yanıt kilitlenir; farklı tekrar
  reddedilir. Eşzamanlı işlemler deneme satırı kilidiyle serileştirilir.
- D/Y 0/20; eşleştirme/kart puanı `round(20 × doğru / toplam)`; 15 yanıt olmadan
  finalizasyon yoktur. Toplam yalnız saklanan sunucu puanlarından hesaplanır.
  Aynı finalizasyon aynı kaydı döndürür; puan biriktirmez.
- İlk/son/en iyi sunucudan alınır. Yanıt/finalizasyon sonucunda ağ belirsizliği
  olursa “kaydedilmedi” diye kesin hüküm verilmez; yeniden eşitleme önerilir.
- Puansız düzeltme ayrı doğrulanır, ilk puanı değiştirmez. Üç AFİ ipucu korunur;
  sınıf modunda ipucu önceden cevap anahtarını servis etmez.
- İlk beş yalnız tamamlanmış denemelerin öğrenci başına en iyi puanından gelir.
  Beraberlikte en iyi puanın daha erken tamamlanması, sonra öğrenci UUID sırası
  kullanılır. Başlanmış sınavın geçici puanı sıralamaya girmez.

## İlerleme, mahremiyet ve saklama

Bölüm ilerlemesi cihazın bildirimi olarak işaretlidir; akademik başarı kanıtı
veya final puanı değildir. Yalnız izinli sekiz bölüm anahtarı yazılır. Tamamlanan
bildirim geriye düşürülmez. Eşitleme hatası ve oturum değişmesi/süre bitimi
oyuncuya açıklanır. Eski oyuncunun ilerlemesi yeni kapasiteye aktarılmaz.

Sunucudaki ilerleme ve sınavlar saklanır; sayfa yenilendiğinde Phaser sahne
konumu ve yerel hikâye sayaçları otomatik geri yüklenmez. Bu teslimde kalıcı
“aynı noktadan oyuna devam” özelliği iddia edilmez. Sınıf oturumu sekme
kapasitesiyle doğrulanarak yeniden kullanılabilir; öğretmen kayıtları korunur.

Ham yanıtlar yalnız bool/anonim kart kimlikleridir; serbest kişisel cevap metni,
fotoğraf, veli bilgisi vb. toplanmaz. Öğretmen UI'sine soru kimliği ve doğru/kısmi/
yanlış sayıları gider; ham cevap JSON'u gitmez. Tablo okuma hakları da ham yanıt
ve idempotency sütunlarını öğretmen istemcisine açmaz. Öğrenci oturum hash'leri
ve soru bankası öğretmen SELECT yetkisine bile açık değildir.

Önerilen prototip saklama sınırı: dersin bitiminden itibaren **en fazla 90 gün**;
kurum daha kısa süre belirleyebilir. Öğretmen sınıfı arşivleyebilir; açık bir
onay ekranından sonra sınıfı ve bağlı öğrenci/ilerleme/denemeleri kalıcı
silebilir. Yetkili yönetici planlı temizlikte arşiv tarihini ve kurum politikasını
kontrol eder; bu teslim otomatik üretim temizleme işi kurmaz. Öğretmen hesabı
silinirse FK zinciri de bağlı kayıtları siler. Test verisi olan Docker veritabanı
silinerek tamamen kaldırılabilir.

Gerçek çocuk verisi öncesinde kurumun aydınlatma/izin, erişim, saklama/silme ve
sınıf içi doğrulama politikası tamamlanmalıdır. Bu prototip bunların yerine geçmez.

## Migration ve kurulum

`supabase/migrations/`:

- `202610260001_guvenkent.sql`: ad alanı, tablolar, RLS, roller, sınıf/oturum/ilerleme API'si.
- `202610260002_assessment.sql`: özel seçici, cevapsız sorular, puanlayıcı, final ve öğretmen raporu.
- `202610260003_bank.sql`: değişmez v1.1 bankası; aynı sürümün farklı içeriği reddedilir.
- `202610260004_api_limits_history.sql`: kalıcı API oran sınırı ve öğrenci deneme özeti.

Migration'lar transaction içindedir, yeniden uygulanabilir. Önceden bilinmeyen
`guvenkent` şeması veya `gk_*` API çakışması durdurulur. Yine de gerçek projenin
mevcut şeması hiç incelenmedi: **kurulu projede çakışma ve yedek kontrolü staging'de
zorunludur**. Kurulu `pgcrypto` uzantısının `extensions` şemasındaki konumu da
kontrol edilmelidir. Üretim ortamına otomatik migration uygulanmaz.

Staging bağlantısını tamamlamak için:

1. Supabase'in resmî panelinde ayrı development/staging projesi oluştur.
2. Mevcut şemayı inceleyip migration'ları yetkili araçla staging'e uygula.
   `seed.sql` gerçek hesap/çocuk veya sabit şifre oluşturmaz.
3. Kurum yöneticisi gerçek Auth öğretmen hesabını oluşturur; aynı `auth.users.id`
   için `guvenkent.teacher_profiles` kaydını yetkili SQL oturumunda ekler.
   Genel kayıt açıksa bile sıradan Auth kullanıcısı öğretmen yetkisi kazanamaz.
4. Edge Function `guvenkent` dağıtılır; `ALLOWED_ORIGINS` yalnız onaylı uygulama
   origin'lerini içerir. Sunucu `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY`
   değerleri platformdaki güvenli ortamdan okunur. Sohbete veya GitHub'a koyma.
5. Uygulama ortamına yalnız `.env.example` içindeki `VITE_SUPABASE_URL` ve
   anon/publishable anahtarı gir; Auth dönüş URL'lerini ve e-posta akışını ayarla.
6. İki gerçek staging öğretmeni ve kurgusal öğrencilerle Auth, Edge CORS,
   sınıf oluşturma/yenileme, katılım, kopma/yeniden eşitleme ve raporu uçtan uca
   doğrula. Bu canlı kabul **henüz yapılmadı**.

Edge API, izinli Origin + POST, 16 KB sınır, kesin alan listesi, kontrol karakteri
ve kimlik doğrulaması uygular. JSON dışı/ekstra `score`, `studentId`, `role`
alanları reddedilir. Oran sınırı ayrı bir DB transaction'ında tüketilir; başarısız
asıl işlem sayacı geri almaz. Genel/katılım/kapasite ve sınav başlatma sınırları
vardır. Bu staging taban çizgisidir; büyük ölçekli hizmet engelleme koruması,
gateway/WAF ve gerçek Auth dağıtımı için ayrıca canlı güvenlik incelemesi gerekir.

## Test sonuçları

- `npm run build`: başarılı; mevcut büyük Phaser paket uyarısı sürüyor.
- Otomatik TypeScript/Node testleri **65/65** başarılı. Önceki saf oyun/final
  testleri ve yeni alan/kimlik/anahtar/sıralama kontrolleri geçti; seçici 10.000
  tohumla doğrulanıyor.
- Gerçek PostgreSQL **17.11** üzerinde **28 güvenlik kontrolü** başarılı:
  başka öğretmen, başka öğrenci, sahte 300 puan, aktif soru sırası, kısmi 7/10
  puanlar, tekrar/aynı anda başlatma-finalizasyon, hash, süre, iptal, arşiv,
  silme ve RLS. İki eşzamanlı başlatma aynı denemeyi, iki finalizasyon aynı
  tek sonucu verdi. Sıralama yalnız en iyi tamamlanan puandan hesaplandı.
- Sabit digest'li Docker imajıyla temiz migration kurulumu ve yeniden uygulama
  başarılı; tanınmayan test container'ı reddediliyor.
- Edge Function, Deno 2.5.6 ile tip kontrolünden geçti. Bu **canlı Edge/Auth
  entegrasyonu testi değildir**.
- İstemci paketindeki özel banka/anahtar yokluğu, gizli VITE anahtarında
  derlemenin durması ve altı özel geliştirme HTTP yolunun **403** dönmesi geçti.
- Öğretmen/katılım ekranları **1440×1000**, **390×844** ve **768×1024**:
  giriş devre dışı, açık demo, sınıflar, 8 ilerleme kartı, aynı takma ad filtresi,
  ilk 5, öğrenci detayı, boş sıralama, çevrimdışı/yeniden çevrimiçi bildirimleri,
  token fragment temizliği ve oyun canvas'ı başarılı. Demo hiçbir canlı Supabase
  isteği göndermedi; yatay taşma ve yakalanan sayfa hatası yok.
- Yeni sunucu adaptörüyle masaüstü/mobil final bileşen kontrolleri ve kasıtlı
  görünüm hatasından kurtarma başarılı. Aynı deneme/yanıt/20 puan korundu.
- Üretim derlemesinde iki düzende **14 başarılı tam oyun sonucu**:
  okul/ev, sel, orman, heyelan, çığ, üçüncü gün ve final zinciri. Her düzende
  iki final sınavı tamamlandı; son ve en iyi puan **300**, belediye kaynağı
  **50** olarak ayrı kaldı. Klavye/sürükleme/dokunarak yerleştirme başarılı.
- Eski sahne, varlık ve veri dosyalarından **106** dosya, eski CSS başlangıcı
  ve görev mantığı korundu. Hikâye dosyasında yalnız final taşıma katmanı değişti.
- **27 PNG** dosyası çözülerek, ölçü ve SHA-256 ile doğrulandı: 25 öğretmen/
  katılım görünümü açık demo/bağlantısız durumdur; 2 final görüntüsü sınıfa
  kaydedilmeyen gerçek Node sunucu alıştırmasıdır.

İlk tam regresyonda eski Karlıtepe testinin hedefi 80 piksellik etkileşim
çemberinden 0,62 piksel dışarıda kaldı. Test güvenli platformun biraz içindeki
600 y koordinatına yürütülecek şekilde düzeltildi; oyun sahnesi veya güvenlik
assertion'ları değiştirilmedi. Yukarıdaki 14 sonuç düzeltilen tam koşuya aittir.
Asenkron finalin yeniden denemesinde eski opak kart taslaklarının temizlenmesi
de tarayıcı testinde yakalanıp düzeltildi.

[Makinece okunabilir sonuçlar](screenshots/teacher-test-results.json),
[SQL güvenlik kontrolleri](screenshots/teacher-database-security-results.json),
[kaynak koruma](screenshots/teacher-source-regression.json),
[özel HTTP yol kontrolleri](screenshots/teacher-private-path-results.json).

Tekrar çalıştırma: `npm ci`, `npm run build`,
`node --experimental-strip-types --test tests/*.test.ts`,
`bash tests/database/run.sh`. Vite dev 5173 portunda final bileşen/hata testleri;
üretim önizlemesi 4175 portunda
`GUVENKENT_TEST_URL=http://127.0.0.1:4175 python tests/teacher_dashboard_smoke.py`
ve aynı ortam değişkeniyle `python tests/final_assessment_smoke.py` çalışır.
`python tests/build_security.py` ve `python tests/teacher_source_regression.py`
ayrıca yeniden üretilebilir. Uzun tam zincir testleri eski ekran kanıtlarını
geçici yeniden çekebilir; bu teslimde yalnız yeni FAZ 11 görüntüleri tutuldu.

Yeni lockfile için `npm ci` temiz dizinde de doğrulandı. Bulut ortamının
`install_script` ve `start_skill` taslağı yeni kurulum/Node alıştırma sunucusu
adımlarıyla güncellendi; ortam yayını veya Supabase bağlantısı yapılmadı.

Test PostgreSQL'indeki `auth.uid()` bağdaştırıcısı JWT claim'i taklit eder;
gerçek GoTrue/JWT doğrulayıcısının testi değildir. RLS ve SQL fonksiyonları ise
**gerçek PostgreSQL motorunda** çalıştırıldı; regex/mok ile geçmiş sayılmadı.
Telefon/tablet kontrolleri Chromium dokunma emülasyonudur; fiziksel cihaz
sertifikasyonu değildir. Gerçek öğrenci verisiyle hiçbir test yapılmadı.

## Ekran görüntüleri

Bütün öğretmen veri ekranları **DEMO** etiketlidir. Giriş ve gerçek öğrenci
katılımı bağlantısız/devre dışı olarak gösterilir. Bunlar canlı Supabase başarı
kanıtı değildir. Bazı veri ekranları bütün kart/sıralamayı göstermek için tam sayfadır.

| Görünüm | Masaüstü | Mobil |
| --- | --- | --- |
| Öğretmen girişi / bağlantısız durum | [PNG](screenshots/teacher-login.png) | [PNG](screenshots/teacher-login-mobile.png) |
| Örnek sınıflar | [PNG](screenshots/teacher-classes.png) | [PNG](screenshots/teacher-classes-mobile.png) |
| Örnek ilerleme | [PNG](screenshots/teacher-class-progress.png) | [PNG](screenshots/teacher-class-progress-mobile.png) |
| Örnek ilk beş | [PNG](screenshots/teacher-top5.png) | [PNG](screenshots/teacher-top5-mobile.png) |
| Örnek öğrenci gelişimi | [PNG](screenshots/teacher-student-details.png) | [PNG](screenshots/teacher-student-details-mobile.png) |
| Katılım / bağlantısız durum | [PNG](screenshots/student-class-join.png) | [PNG](screenshots/student-class-join-mobile.png) |
| Örnek katılım formu | [PNG](screenshots/student-class-join-demo.png) | [PNG](screenshots/student-class-join-demo-mobile.png) |

[Boş sıralama](screenshots/teacher-empty.png),
[mobil panel](screenshots/teacher-mobile.png) ve
[tablet paneli](screenshots/teacher-class-progress-tablet.png) ayrıca kaydedildi.

## Değişen parçalar ve sınırlar

Yeni öğretmen/katılım bileşenleri, Auth/Edge istemcisi, public soru sunumu,
asenkron final adaptörü, cihaz ilerleme eşitlemesi, Node alıştırma middleware'i,
Supabase migration/Edge dosyaları ve testler eklendi. `main.tsx` gezinmeyi bağlar;
Phaser dünya çizimleri/varlıkları değiştirilmez. Final saf puanlama/60 kayıt
regresyon testleri korunur; GameSession testi artık eşzamanlı tarayıcı puanlaması
varsaymaz. Tarayıcı testleri cevabı QA'dan almıyor; testin sunucu tarafındaki
onaylı bankasını beklenen cevap için kullanıyor.

`@types/node` geliştirme bağımlılığı ve tekrar üretilebilir `package-lock.json`
eklendi; çalışma zamanı istemcisine Supabase service SDK/secret eklenmedi.
Yeni üretim dağıtımı, `main` birleştirmesi ve sonraki aşama yoktur.
Canlı Supabase entegrasyonu ve kullanıcı görsel/güvenlik onayı beklenir.


Yerel sunucu finalinin ek kanıtları: [masaüstü](screenshots/teacher-final-practice-desktop.png) · [mobil](screenshots/teacher-final-practice-mobile.png). Öğretmen raporu elle “Güncelle” ile yenilenir; WebSocket ile canlı abonelik veya isteğe bağlı öğretmen serbest gezi modu eklenmedi.
