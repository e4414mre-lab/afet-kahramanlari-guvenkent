# FAZ 02 — BELEDİYE BİNASI: İÇ MEKÂN VE İLK HİKÂYE GÖREVİ

> DURUM: Uygulama talimatı. Henüz uygulanmış kod değildir.
> KAYNAK DAL: `feat/city-square-prototype` (GitHub'da doğrulandı)
> HEDEF DAL: `feat/town-hall-interior` (Codex oluşturacak)
> Ana dala birleştirme: kullanıcı görsel ve işlevsel onay verene kadar YASAK.

## 1. Amaç
Güvenkent meydanındaki onaylı sanat kalitesine sadık, sıcak ve oynanabilir **belediye iç mekânı** üretmek. İlk 3–5 dakikalık hikâyeyi oyuncunun *hareket ettiği ve nesnelerle etkileşime girdiği* bir oyun olarak kurmak.

## 2. Görsel tasarım — değişmez sınırlar
- Var olan şehir meydanı görselini, kamera açısını, Çağrı ve AFİ'nin kimliğini, kontrol mekaniklerini **bozma**.
- Belediye sahnesi şehir meydanıyla aynı görsel aileden: **yüksek kaliteli stilize 2.5D, sıcak ışık, izometrik/3-çeyrek perspektif, ayrıntılı ama okunaklı**.
- Belediye içi: sıcak ahşap zemin, büyük pencereler, belediye masası, kent planı panosu, görev defteri, raf/bitkiler; maket-kesit görünümünde oda.
- Nesneler ve karakterler **bağımsız katman**. Hazır arka plan resmi üzerine etiket/yazı bindirerek sahte 3D oluşturma. Varsa gerçek sprite kullan, yoksa eksik varlıkları teslim raporunda belirt.
- Daha önceki başarısız görüntüdeki üst üste binmiş etiketler, dev açıklama kutuları, primitif oda çizgileri **kesinlikle kullanılmayacak**.
- Sahne, ekranın yaklaşık %80'ini doldurmalı; yalnızca kısa konuşma paneli ve küçük görev kartı bulunmalı.
- Karakter/nesne ölçeği, ayak-temas noktaları ve z-index/derinlik sırası gerçekçi ve sabit.
- Zorunlu eğitimsel uyarı ses veya konuşma balonu kapalı olsa da okunabilir.

## 3. Sahne akışı
A. Şehir meydanındaki belediye kapısına yürü; yeterince yakınken **E / Enter / dokunarak** etkileşim.
B. Kısa kararma/kapı animasyonuyla `TownHallScene` aç; sürekli yükleme ya da sahne çakışması olmasın.
C. İçeride belediye başkanına yaklaş; kısa diyalog. Çağrı'nın “Çocuk Belediye Başkanı” unvanının **temsili** olduğu net anlatılır; çocuk gerçek belediye veya acil durum yetkisi üstlenmez.
D. Görev masasındaki **beratı** inceleyip kabul et (tek kısa metin).
E. Kent planı üzerinde okul bölgesini vurgula. **İlk görev:** “Güvenkent İlkokuluna git, güvenli sınıfı birlikte keşfedelim.”
F. Kapıdan tekrar meydan sahnesine dön; görev işaretçisi okul girişini gösterir; okul binası henüz tamamlanmadıysa bu yalnızca sonraki aşama geçiş noktasıdır.

## 4. Nesneler / etkileşimler
- Belediye Başkanı NPC: kısa diyalog ve görev.
- Belediye masası: görevlendirme beratını incele.
- Kent planı: okulun işaretini göster; kısa bilgi.
- Görev defteri: mevcut hedefi özetle.
- Kapı: şehir meydanına dönüş.
- AFİ: gerekiyorsa 3 kademeli ipucu; çözümü tek seferde vermez.

Nesne yakınlığı ve tıklama algısı kamera zoom seviyelerinde doğru kalır. Uzak nesneye tıklamak, Çağrı'nın yaklaşmasını sağlamalı ya da “Biraz yaklaş” geri bildirimi vermeli; sahne dışı dev buton açmamalı.

## 5. Etkileşim / UX
- Masaüstü: WASD/yön tuşları, E/Enter; fareyle nesne seçimi.
- Tablet: tıkla-git veya dokunmatik hareket kontrolleri; nesneye doğrudan dokunma.
- Diyalog: tek seferde en fazla 1–2 kısa cümle; Konuşmaya Devam / Geç ile erişilebilir.
- Menü durumunu, sessiz mod, 5 bağımsız ses-yazı tercihi ve azaltılmış hareket seçimini koru.
- Düşük FPS ve küçük ekranlarda kullanılabilirlik; sahne oranı bozulmasın.

## 6. Görev durumları ve teknik notlar
- `notStarted -> speakToMayor -> inspectCertificate -> reviewCityPlan -> goToSchool`.
- Görev durumu React–Phaser köprüsünde veya ortak typed store'da tutulmalı; sahne değişince kaybolmamalı.
- Diyaloglar ve hotspot'lar data-driven JSON veya TS veri kaynağında; sahne bileşenlerine sabit yüzlerce satır gömme.
- Geçersiz/eksik ses varlığı, görsel veya veri oyunu çökertmemeli.
- Şimdilik gerçek öğretmen hesabı, Supabase entegrasyonu veya yeni afet bölgeleri ekleme.
- Sahne geçişinde Phaser event ve listener temizliği; tekrar girişte duplicate diyalog/oyun örneği oluşmamalı.
- Kayıt kalıcılığı yoksa varmış gibi gösterme.

## 7. Kabul testleri
1. `npm install` ve `npm run build` (varsa mevcut testler) geçmeli.
2. Belediye kapısı giriş/çıkış 5 kez tekrarlandığında bellek/ekran sorunu olmamalı.
3. Çağrı, AFİ ve belediye başkanı üst üste binmemeli.
4. Masa, kent planı, görev defteri ve NPC ayrı ayrı seçilebilmeli.
5. 390x844 mobil ve 1440x1000 masaüstü ekranında okunur olmalı.
6. Tüm etkileşimlerin klavye ve dokunmatik karşılığı olmalı.
7. Görev durumu sahne dönüşünde korunmalı; yanlış sırada nesne seçildiğinde anlaşılır geri bildirim gösterilmeli.
8. Başarılı görev sonunda okul yönlendirmesi görünmeli.
9. `docs/screenshots/town-hall-desktop.png` ve `town-hall-mobile.png` üretilmeli; mümkünse ekrana doğrudan gösterilebilir veya GitHub'a push edilmiş olmalı.
10. Sanat varlıkları eksikse tamamlanmış gibi sunulmayacak; yüksek kaliteli grafik yoksa **görsel onay öncesi eksik teslim** olarak belirtilecek.

## 8. Teslim disiplini
- `feat/town-hall-interior` dalını **mevcut `feat/city-square-prototype` üzerinden aç**. `main` eski sürümdür; başlangıç olarak kullanma.
- Değişen dosyalar, komutlar, test sonuçları, ekran görüntüleri ve eksik görselleri `docs/FAZ_02_TESLIM_RAPORU.md` içinde yaz.
- Dalı GitHub'a push et; `main` ile birleştirme ve gerçek dağıtım yapma.
- Sonraki aşamaya geçme; kullanıcıdan **görsel onay** bekle.
