# FAZ 11 — ÖĞRETMEN PANELİ, SINIF BAĞLANTISI VE ÖĞRENCİ İLERLEME TAKİBİ

**Kaynak dal:** `feat/final-assessment` (GitHub'da doğrulandı)  
**Yeni dal:** `feat/teacher-dashboard-supabase` — mevcut kaynak daldan açılacak  
**Durum:** Uygulama şartnamesi. Henüz canlı Supabase kurulumu veya öğretmen hesabı oluşturulduğu anlamına gelmez.  
**Kural:** Ana dalda merge veya production Vercel deployment yok. Gerçek öğrenci verileriyle test yok.

## 1. Hedef
Afet Kahramanları – Güvenkent öğretmenlere sınıf oluşturma, öğrencilere bağlantı üzerinden takma adla katılma, ilerlemeyi görme, sorulara ait performansı inceleme ve sınıfın ilk 5 başarı sıralamasını gösterme imkânı sağlar. React + Phaser + TypeScript korunur. Supabase Auth, Postgres, RLS ve güvenli sunucu fonksiyonları kullanılır.

## 2. Güvenlik ve pedagojik ilkeler
- Öğretmen **gerçek Supabase Auth** ile giriş yapar. Uygulama içine sabit şifre veya demo öğretmen şifresi gömme.
- Öğrenci yalnızca **ad veya takma ad** girer, öğrenci şifresi istemeyiz. Ancak bu kimlik doğrulama **değildir**: öğrenci adı başkası tarafından girilebilir. Dolayısıyla öğrenciye bireysel gizli kayıt gösterilmez.
- Sınıf bağlantısı **rastgele, tahmin edilmesi zor, iptal edilebilir** katılım token'ı kullanır. URL'de öğretmen API anahtarı, öğretmen oturumu veya sınıfın herkese açık listesi yok.
- Takma adların sınıf içindeki gösterimi kontrol edilir; çocuklara soyadı, doğum tarihi, okul numarası, telefon, veli bilgisi, açık adres veya fotoğraf sorulmaz.
- Öğretmen, yalnızca **kendi sınıflarının** verisini görür. Farklı öğretmen/sınıf erişimi RLS ve sunucu tarafında engellenir.
- Çocukların verileri için kurumun gizlilik politikası, uygun aydınlatma ve gerekli izin süreçleri yayına çıkmadan önce değerlendirilir; bu prototipte gerçek çocuk verisi toplama.
- Kimlik doğrulamasız takma ad girişinden doğan başkası adına işlem riskini öğretmen arayüzünde açıkla; canlı kullanımda sınıf içi doğrulama/oturum yenileme politikası tasarla.
- Sınıf katılım token'ı **erişim anahtarıdır, şifrelenmiş gizli bilgi sayılmalı**; token veritabanında hash'lenmeli, kısa ömür/iptal/yenileme ve hız kısıtı düşünülmeli.
- Supabase `service_role` ve diğer gizli anahtarlar yalnızca güvenilir sunucu/Edge Function üzerinde; client bundle veya repo içinde yok. `VITE_` ile yalnızca yayımlanabilir URL ve anon/publishable key kullanılabilir.

## 3. Ekranlar
### Öğretmen giriş ekranı
- E-posta + güvenli parola / Supabase Auth.
- Giriş/çıkış, oturum hataları, parola sıfırlama akışı.
- Öğretmen kaydı kurumca yönetilebilir; herkes tek tıkla öğretmen rolü kazanamaz.

### Öğretmen paneli
- Sınıflarım listesi, yeni sınıf oluştur (örn. 5-A, 5-B).
- Sınıf detayında öğrenciler (takma ad, takma/anonim kimlik, tamamlama durumu, son etkinlik, son sınav, en iyi sınav).
- Sınıf için paylaşılabilir rastgele bağlantı, katılım kapat/aç, bağlantıyı yenile.
- İlk beş öğrenci sıralaması: **en iyi geçerli final sınav puanı** (maksimum 300), beraberlikte daha erken tamamlanma, tamamen aynı durumdaysa sunucu tarafı kararlı ID sırası. Kısmi ilerleme final puanına dahil edilmez.
- Sınav sonuçları: toplam, konu başına 0–60, etkinlik türüne göre başarı, ilk/son/en iyi deneme, zaman damgaları ve değerlendirme havuzu sürümü.
- Öğrenci detay görünümünde doğru/yanlış sonuçlar ve konu bazlı gelişim önerileri; gerekmedikçe öğrenci ham cevap metinlerini ve kişisel kayıtları fazla toplama.
- İsteğe bağlı sınıf içi öğretmen serbest gezi / ders modu: öğretmen tüm bölgeleri sırayla ilerleme koşulu olmadan gösterir; öğrencilerin hikâye ve puanlarını değiştirmez.

### Öğrenci katılımı
- Öğretmen bağlantısı -> sınıf adı göster -> ad veya takma ad -> katıl.
- Her katılım için sunucuda benzersiz rastgele `student_id` + gizli oturum kapasitesi oluşturulur; yalnız takma adla veri sahibini kanıtladığını iddia etme.
- Aynı adla iki katılım olabilir; öğretmen panelinde çakışmayı ayırt edici kısa rastgele kod göster.
- Öğrencinin cihazında oturum anahtarı yalnızca kendisine erişebileceği verilere izin verir; kullanıcı başka öğrenci ID'si göndererek puan değiştiremez.
- Öğrenci dersin başından veya öğretmen serbest gezide izleme modundan başlayabilir; oyun içi ses/yazı/erişilebilirlik ayarları korunur.

## 4. Önerilen veritabanı modeli
Bütün tablolar için **RLS açık** (public erişim en az ayrıcalık). Şema örneği; kurulu Supabase projesindeki mevcut şemayla çakışma kontrolü zorunlu:

- `teacher_profiles(user_id uuid PK references auth.users, display_name text, created_at timestamptz)`
- `classes(id uuid PK, teacher_id uuid FK, label text, join_token_hash text UNIQUE, join_enabled boolean, created_at timestamptz, archived_at timestamptz)`
- `students(id uuid PK, class_id uuid FK, nickname text, nickname_public_code text, created_at timestamptz, is_active boolean)`
- `student_sessions(id uuid PK, student_id uuid FK, token_hash text, expires_at timestamptz, revoked_at timestamptz)`
- `progress(student_id uuid FK, chapter_key text, task_key text, state text, updated_at timestamptz, PRIMARY KEY(student_id,chapter_key,task_key))`
- `assessment_attempts(id uuid PK, student_id uuid FK, question_bank_version text, seed text, started_at timestamptz, finished_at timestamptz, final_score int CHECK (final_score between 0 and 300), status text CHECK (status in ('started','completed')))`
- `assessment_answers(attempt_id uuid FK, question_id text, answer_json jsonb, awarded_score int CHECK (awarded_score between 0 and 20), answered_at timestamptz, PRIMARY KEY(attempt_id,question_id))`

**Alternatif:** Eğer veritabanında existing uygun tablolar varsa `CREATE TABLE` ile çift isim/bozulma yaratmadan migrate et. Kimlik referansları ve yabancı anahtarlar doğru.

## 5. En önemli güvenlik ilkesi: sunucu tarafı puanlama
- İstemciden “final puanım 300” şeklinde değer gelince **asla doğrudan güvenme**.
- Sunucu, izinli sorular, doğru cevap anahtarı, atanmış sınav seed ve deneme ID'sine göre değerlendirme yapar.
- Doğru cevap anahtarı öğrencinin client bundle'ına koyulmamalı; hazır havuzda tüm yanıtlar bulunuyorsa içerik client'a **cevap anahtarsız** biçimde servis edilir. Tam soru bankası ve değerlendirici yalnız sunucu fonksiyonunda olur.
- Başlatma `start_attempt`: öğrenci oturumu doğrulanır, benzersiz seçilen 15 soru ve seed sunucu tarafında kaydedilir; 5/5/5 tür, 5/6/4 zorluk ve her afet×tür bir kez.
- Cevap `submit_answer`: öğrenci oturumu + attempt sahipliği, aktif soru, 1 cevap / soru, idempotency key, süre/oran sınırlamaları, maksimum 20 ve kısmi puan doğrulaması.
- Final `finalize_attempt`: 15 etkinlik cevaplanmış, tek seferlik finalizasyon; 0..300 toplam sunucuda hesaplanır. Devamlı tekrar eden istek iki kere puan yazmaz.
- Leaderboard öğretmen veya güvenli sunucu sorgusuyla, sadece tamamlanmış denemelerin **MAX(best)** skorunu alır. Öğrenciler diğer öğrencilerin ham verilerine erişemez.
- Öğretmene gösterilen sonuç ile öğrenci istemcisindeki geçici puan tutarlı olmalı, bağlantı koparsa durum tekrar senkronize edilir.

## 6. API / işlem uçları ve yetkilendirme
- Öğretmen: `create_class`, `rotate_join_link`, `close_join_link`, `get_class_dashboard` — yalnız auth.uid() sınıf sahibi.
- Öğrenci: `join_class`, `resume_session`, `save_progress`, `start_attempt`, `submit_answer`, `finalize_attempt` — imzalı/tesadüfi oturum token doğrulama, yetki sınırı ve rate-limit.
- Supabase RLS öğretmenin kendi sınıfını okumasını sağlar; öğrenci işlemleri yalnız doğrulanmış RPC/Edge Function aracılığıyla, servis anahtarı istemciye verilmeden yapılmalı.
- Supabase veritabanı fonksiyonları `SECURITY DEFINER` gerekiyorsa `search_path` sabit, revocation ve EXECUTE grant'leri kesin sınırlı.
- Uygun güvenlik incelemesi olmadan herkese açık `students`, `assessment_answers`, `classes` SELECT policy yazma.
- CSRF, girdi doğrulama, XSS, token denemesi ve toplu istek saldırılarına karşı kontroller; nickname uzunluğu 2–30, kontrol karakterleri temizle, UI'da HTML olarak render etme.

## 7. Mahremiyet ve yönetim
- Saklama süresi ve veri silme akışları belgeye yaz; öğretmen sınıf arşivleyebilir ve kurumsal politika kapsamında silebilir.
- Gerçek isim zorunlu değildir. Takma adla aynı öğrenciyi yeniden tanıma kesin garanti değildir.
- Öğrenci liste raporları varsayılan olarak sadece sınıf öğretmenine açık; gerçek öğrenci fotoğrafı yok.
- Kaynak kodda, screenshot veya dokümantasyonda gerçek çocuk adı ve sonuçları bulunmasın; testler takma adlarla.
- Öğretmen rolü kullanıcının kendi verdiği bir `role=teacher` parametresiyle yükseltilemez.
- Supabase yapılandırması yokken sahte başarılı “giriş yapıldı”/“puan kaydedildi” mesajı verme; yalnız güvenli demo modu, belirgin **“Demo – veri kaydedilmiyor”** etiketi.

## 8. UI ve tasarım
- Öğretmen paneli oyunun sıcak turkuaz/krem renkleriyle uyumlu, fakat veri yoğun tablolar okunaklı ve profesyonel.
- Masaüstü ve tablet; mobilde yatay taşma yapmayan öğrenci kartları, filtre/sıralama.
- Öğrenci modunda mevcut yüksek kaliteli Phaser sahnelerine dokunma; yalnız oturum durumunu ve arka plan senkronizasyonunu bağla.
- Yükleme, boş liste, çevrimdışı, oturum zaman aşımı ve hatalı bağlantı durumları ayrı ekranlar.
- Erişilebilirlik: klavye, görünür odak, yeterli kontrast, ekran okuyucu başlıkları.
- İlk 5 sıralaması sonuç almayan sınıfta **“Henüz tamamlanan sınav yok”** gösterir.

## 9. Ortam kurulumu
- `supabase/migrations/*` altında yeniden çalıştırılabilir migration, `supabase/seed.sql` yalnız takma verilerle.
- `.env.example`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`; gizli fonksiyon sunucu anahtarlarını yalnız proje platformunda sakla.
- Ayrı development/staging ve production Supabase projelerini tercih et. Üretim ortamına otomatik migration uygulama.
- Supabase hesabı/anahtarları mevcut değilse **önce devre dışı/bağlanmamış ama derlenebilir panel iskeleti + şema/test** teslim et. Kullanıcıdan yalnız resmî arayüze gidip proje oluşturmasını iste; özel anahtarları sohbete veya GitHub'a gönderme.

## 10. Test ve kabul
1. `npm run build` ve tüm önceki oyun/sınav testleri geçer.
2. Migration şema, RLS ve token yetkileri test edilir; başka öğretmen sınıfına erişim **başarısız** olmalıdır.
3. Başka öğrenci ID'siyle puan yazma **başarısız** olmalı.
4. Client'tan 300 puan göndererek sunucu skoru değiştirme **başarısız** olmalı.
5. Tekrarlı cevap/finalizasyon puan çiftlemesi yaratmaz.
6. Sınav seçimi sunucuda 15 soru, 5/5/5, 5/6/4 ve doğru topic/type dağılımını korur.
7. Öğretmen ilk 5 sıralaması yalnız en iyi tamamlanmış sınav üzerinden hesaplanır; beraberlik deterministik.
8. Öğrenci katılımı yalnız takma ad ile yapılabilir; veri sahibi doğrulama sınırlaması açık anlatılır.
9. Öğretmen sınıf bağlantısını iptal edebilir/yenileyebilir; eski bağlantı geçersizdir.
10. Oturum kapanışı/bitimi sonrası eski token ile erişim engellenir.
11. Masaüstü 1440x1000, mobil 390x844, tablet ve dokunmatik test.
12. Gerçek Supabase bağlanmadıysa bu durum raporda **entegrasyon eksik** olarak açık gösterilir.
13. Gerçek kişisel veri olmadan şu ekran görüntüleri üretilir:
    `docs/screenshots/teacher-login.png`, `teacher-classes.png`, `teacher-class-progress.png`, `teacher-top5.png`, `teacher-student-details.png`, `student-class-join.png`, `teacher-mobile.png`.
14. `docs/FAZ_11_TESLIM_RAPORU.md` değişen dosyalar, migration testleri, güvenlik sınırları, bağlantı durumu, kalan işler.

## 11. Teslim
- `feat/final-assessment` dalından `feat/teacher-dashboard-supabase` oluştur.
- Kod, veri tabanı migration, tests, ekran görüntüleri ve raporu **yalnız yeni dala** push et.
- Mevcut oyun sahnelerini, sınıf risk avını, dört afet bölgesini, üçüncü günü ve final değerlendirmeyi bozma.
- `main` merge yapma, Vercel production yayını yapma.
- Kullanıcıdan ekranların ve güvenlik testlerinin onayını bekle; sonraki aşamaya geçme.
