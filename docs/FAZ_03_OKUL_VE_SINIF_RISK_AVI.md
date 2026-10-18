# FAZ 03 — GÜVENKENT İLKOKULU VE SINIF RİSK AVI

**Kaynak dal:** `feat/town-hall-interior` (mevcut meydan + belediye oynanışı buradadır).
**Geliştirme dalı:** `feat/school-risk-hunt` — kaynak daldan oluşturulacak.
**Kural:** `main` dalına birleştirme yapma. Sonraki afete geçmeden ekran görüntüsü ve oyun onayı bekle.

## 1. Hedef

5. sınıf düzeyinde **okulda deprem öncesi riskleri fark etme** becerisini geliştiren gerçek bir keşif görevi. Öğrenciler riskli nesneyi sahnenin içinde bulmalı, neden riskli olduğunu anlamalı ve **bir yetişkin / yetkili görevlinin yapacağı** güvenli çözümü seçmelidir.

## 2. Görsel kalite

- Onaylanan şehir meydanı / belediye iç mekânı kalitesini referans al: sıcak ışık, tutarlı 2.5D 3/4 izometrik görüş, derinlik ve gölge.
- **Güvenkent İlkokulu** dış kapısı şehir sahnesine organik şekilde bağlanır; girişte kısa sahne geçişi.
- **5-A sınıfı:** masalar, sıralar, pencere, öğretmen masası, pano, kitaplık, dolap, okul çantaları, sınıf kapısı; yaşa uygun, temiz, ayrıntılı ve okunabilir.
- Sınıf objeleri ayrı etkileşim katmanlarında olmalı. Tek bir düz resmin içine gömülü sahte tıklanabilir nesneler kullanma.
- Kaplayan metin kutuları, büyük emoji düğmeleri, üst üste yığılan etiketler YASAK. Oyun dünyası ekranın ana öğesi.
- Karakterler sınıfa ölçeklenmiş şekilde yerleşir; zemine temas, gerçekçi gölge ve z-index/y-sort korunur.
- Gerekli görseller henüz yoksa jenerik geometrik şekilleri bitmiş sanat sayma; eksikleri açıkça raporla.

## 3. Oyuncu akışı

1. Belediye görevinde **okula git** hedefi açılır. Haritada okul yönlendirmesi görünür.
2. Öğrenci Çağrı'yı okul girişine götürür; bina giriş etkileşimi ile sınıf sahnesine geçer. Ara koridor şart değildir; sonraki sürüme ertelenebilir.
3. AFİ: “Sınıfımızı güvenli hâle getirmeye yardım eder misin? Önce dikkatlice inceleyelim.” Kısa, sesli/yazılı; kullanıcı ayarlarına uyar.
4. İlk **2 risk** AFİ'nin aşamalı ipuçlarıyla; kalan **4 risk** öğrencinin bağımsız keşfiyle bulunur. İpucu düğmesi isteğe bağlı, 3 kademeli.
5. Riskli objeye yaklaş / tıkla: yakından inceleme görünümü, kısa seçim paneli: “Bu neden riskli?”, “Ne yapmalıyız?”
6. Güvenli karar seçilince işaretlenen bulgu **belirlendi -> çözüm planlandı -> yetişkine/teknik personele bildirildi -> yetişkin tarafından güvenli hâle getirildi** durumlarını izler.
7. Risk olmayan 4 nesne de incelenebilir: doğru farkındalığı destekleyen kısa geri bildirim gösterilir; öğrenci cezalandırılmaz.
8. Öğrenci tüm altı riski bulunca AFİ kısa özet verir; gün 1 sonraki görevi için hazırlık tamamlanır. Gerçek deprem anı tatbikatı **sonraki aşamada** yapılacaktır.

## 4. İncelenecek 6 risk (zorunlu)

| id | Risk | Eğitsel açıklama | Güvenli karar |
|---|---|---|---|
| bookshelf | Sabitlenmemiş uzun kitaplık | Sarsıntıda devrilebilir | Yetişkin/teknik personel tarafından sabitlenmesini iste |
| exit_bags | Kapı geçişini kapatan çantalar | Tahliye yolunu engeller | Öğretmen gözetiminde geçişin düzenlenmesini iste |
| heavy_boxes | Dolap tepesindeki ağır kutular | Sarsıntıda düşebilir | Yetkili yetişkin tarafından aşağı alınmasını iste |
| tall_cabinet | Sabitlenmemiş yüksek dolap | Devrilme riski var | Teknik personele bildirilip sabitlenmesini iste |
| window_heavy | Pencere yakınındaki sabitlenmemiş ağır eşya | Sarsıntıda hareket edebilir / düşebilir | Öğretmene bildir, güvenli yerleşim planlat |
| wall_board | Sağlam sabitlenmemiş ağır pano | Duvarından ayrılabilir | Yetkili kişi bağlantılarını kontrol etsin |

**Önemli:** Çocuklara ağır eşyaları kaldırma, sabitleme, cam yakınındaki riskli nesneyi tek başına taşıma vb. tehlikeli eylemler yaptırma.

## 5. Dört güvenli nesne (yanıltıcı olmayan seçenek)

- Sabitlenmiş alçak kitap rafı
- Düzenli, kapıdan uzakta sıralanmış öğrenci çantaları
- Kapalı, zeminde yer alan hafif malzeme kutusu
- Güvenli şekilde sabitlenmiş ve doğru yükseklikte pano

Güvenli nesneye dokununca “Bu nesne neden daha güvenli?” sorusuyla kısa açıklama göster.

## 6. Etkileşim ve puanlama

- Gerçek sahne içi hotspot; fare, dokunmatik ve klavye ile ulaşılır. Klavyeyle yakındaki nesneler arasında Tab/alternatif erişilebilir kontrol sağla.
- İnceleme paneli küçük ve kapatılabilir; afetzede/güvenlik kaygısını gereksiz artırma.
- Yanlış seçimlerde “Tekrar düşünelim” + kısa ipucu; öğrenci ilerleyebilir, keyfi ceza puanı verme.
- Bulgu sayacı `0/6` -> `6/6`; dört güvenli nesne sayaçta risk sayılmamalı.
- Tekrar tıklamalarla aynı risk ikinci kez puan üretmemeli.
- Bu fazda öğretmen lider tablosuna otomatik puan aktarımı varmış gibi gösterme.
- Görev verileri tipli, veri odaklı ve test edilebilir olsun.

## 7. Mimari

- `SchoolClassroomScene` Phaser Scene; şehir / belediye ile sahne geçişleri.
- Öğrenci görev durumları: `notFound`, `identified`, `planned`, `assigned`, `verifiedFixed`.
- AFİ 3 aşamalı ipuçları; ilk iki riskte yönlendirme, kalan dört riskte talep üzerine.
- Eski ses tercihleri ve reduced motion ayarları korunacak.
- Gerçek ses dosyası yoksa yazılı görev metni görünür.
- Phaser sahne shutdown ve listener temizliği; yeniden girince çift overlay açılmasın.

## 8. Test ve kabul ölçütleri

1. `npm run build` geçmeli; mevcut testler de çalışmalı.
2. Şehir meydanı ve belediye odası eskisi gibi çalışmalı.
3. Belediye görevinden okula geçiş ve okuldan dönüş çalışmalı.
4. Altı risk ve dört güvenli nesnenin hepsi bağımsız doğru etkileşimlere sahip olmalı.
5. İlk iki risk rehberli, diğerleri araştırma odaklı olmalı.
6. Doğru/yanlış kararlarda açıklayıcı geri bildirim çalışmalı.
7. Tekrar tıklamayla çift tamamlanma/puan yok.
8. Mobil 390x844 ve masaüstü 1440x1000 ekranında nesneler tıklanabilir; görüntü taşmaz.
9. 5 defa sahneye girip çıkmak birden fazla Phaser listener/arayüz oluşturmaz.
10. Temel klavye kullanımı ve azaltılmış hareket seçeneği korunur.
11. Görsel kontrol için `docs/screenshots/school-classroom-desktop.png` ve `school-classroom-mobile.png` GitHub dalında erişilebilir.
12. `docs/FAZ_03_TESLIM_RAPORU.md` içinde test sonuçları ve **varlık eksikleri** listelenir.

## 9. Geliştirme ve teslim

- Başlangıç noktası **`feat/town-hall-interior`**, `main` değil.
- Yeni dal: `feat/school-risk-hunt`.
- Sınıf ve okul girişini geliştir; **ev, deprem tatbikatı, sel, yangın, heyelan, çığ, final sınavı ve öğretmen paneline geçme**.
- Değişiklikleri yeni dalda commit/push yap.
- Kod hatası gizleme, çalışmayan özelliğe “tamamlandı” deme.
- Kullanıcı görseli görüp onaylamadan sonraki aşamaya geçme.
