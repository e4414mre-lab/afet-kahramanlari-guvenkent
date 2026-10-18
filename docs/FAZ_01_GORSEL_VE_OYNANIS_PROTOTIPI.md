# FAZ 1 — GÜVENKENT GÖRSEL VE OYNANIŞ PROTOTİPİ

## Hedef
İlk sürümde, öğrencinin kontrol edebildiği **tek bir kaliteli oyun bölümü**: Güvenkent şehir meydanı. 5. sınıf düzeyi; sıcak, okunaklı, renkli, 2.5D izometrik macera estetiği. Bu bir sunum slaytı veya etiketlerle dolu eğitim uygulaması **olamaz**.

## Kesin sanat yönü
- **2.5D izometrik mini-diorama şehir**; 3/4 görünüm, tutarlı ışık yönü, doğal gölgeler; canlı ama yorucu olmayan yeşil/turkuaz/sıcak mercan tonları.
- Belediye, okul, küçük evler, yol, park ve dere aynı dünya üzerinde algılanır. Uzak orman, yamaç ve karlı dağ siluetleri şehirle mekânsal olarak uyumlu olmalı.
- **Çağrı**: 10–11 yaş, açık yeşil üst, koyu pantolon, mavi ayakkabı; ölçekli, transparan arka planlı sprite.
- **AFİ**: beyaz/turkuaz/turuncu yuvarlak mini robot; Çağrı'yı izler, hafif yüzer.
- Kamera dünyaya odaklanır, **oyun alanı görünür alanın çoğunluğunu kaplar**. Ekrana yapıştırılmış dev kutular yok.
- Etkileşimde tıklanan nesne hafifçe vurgulanır; tek satırlık kısa, okunaklı diyalog paneli / gerektiğinde görev kartı gösterilir.
- Tüm görsellerin tutarlı ölçeği ve derinlik (y-sorting) korunur. PNG/WebP transparan sprite kullan; ekrandaki büyük düz geometrileri **nihai oyun sanatı olarak sunma**.

## Varlık üretimi için kesin kural
Onaylı sprite / arkaplan resimleri henüz repoda yoksa **varsayarak oluşturulmuş düz çizgileri tamamlanmış oyun diye sunma**. Bunun yerine güzel tasarlanmış, durumu açıkça belirten bir sanatsal konsept önizlemesi / kaliteli placeholder kullan ve eksik dosyaları raporla. Harici görsel URL'leri hotlinkleme; telif durumunu kontrol et. Bir arka plan görselinin içine karakteri gömme; karakterler ayrı sprite olacak.

## MVP davranışları
1. 'Keşfe Başla' ile Phaser şehir meydanına girilir.
2. Oyuncu Çağrı'yı WASD / yön tuşlarıyla hareket ettirebilir (dokunmatik cihazda ekranda sanal yön kontrolü veya basit tıkla-git).
3. AFİ, Çağrı'yı takip eder. Basit yüzer animasyon.
4. Belediyenin önündeki etkileşim alanına yaklaşınca 'Etkileşim' belirir; tıklayınca AFİ tek kısa görev verir: '**Okulumuzun çevresini tanıyalım.**'
5. Okulun giriş bölgesine gidince küçük görev tamamlandı diyaloğu gösterilir.
6. Bir sonraki adımda yapılacak sınıf risk avı için sahne geçiş noktası oluşturulur; sahnenin tamamlandığı iddia edilmez.
7. Kamera karakteri takip eder, harita sınırından dışarı çıkmaz.
8. Oyun içi **azaltılmış hareket** ayarı ve sessiz mod tercihleri korunur; zorunlu güvenlik uyarıları yazılı kalır.

## Kod sınırları
- React giriş/ayarlar; Phaser oyun dünyası. Mevcut çalışan bileşenleri koru.
- Phaser Scene olarak yeni `CitySquareScene` ve `BootScene` gerektiğinde oluştur.
- Harita etkileşimlerini veriyle tanımla, görev durumunu TypeScript ile tipli tut.
- Öğretmen kimlik doğrulaması, Supabase, üçüncü gün, sınav ve tüm afet senaryolarını **bu fazda yapma**.
- Yalnızca demoda öğrenci adı alınıyorsa adın veri tabanına kaydedildiğini söyleme.

## Kabul kriterleri
- `npm run build` temiz geçiyor.
- Öğrenci girişi ve ses ayarları bozulmuyor.
- Masaüstü klavye kullanımı + temel dokunmatik etkileşim var.
- Çağrı gerçekten hareket ediyor; AFİ takip ediyor; görev etkileşimi çalışıyor.
- En az iki etkileşim noktası (belediye ve okul) var.
- Hiçbir nesne etiketi karakterin üstüne taşmıyor; belirgin ekran taşmaları yok.
- Oyun içi önemli metinler kısa ve okunur.
- Eksik görsel varlıklarıyla başarı iddiası kurulmaz: proje raporunda açıkça listelenir.

## Codex teslimi
- Değişen dosyaları açıkla.
- Testleri ve sonuçlarını yaz.
- Var olan sanat dosyaları / gerekli yeni sanat dosyaları listesini sun.
- Kullanıcı görsel onayı olmadan diğer bölgelere geçme.
