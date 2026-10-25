# FAZ 10 — FİNAL DEĞERLENDİRME: 60 ETKİNLİK / 15 ETKİNLİKLİ SINAV

**Kaynak dal:** `feat/day3-budget-planning`; **yeni dal:** `feat/final-assessment`. Main'e merge etme.

## Ön koşul
`docs/data/final-question-bank-v1.json` dosyasında 60 içerik kaydı vardır: beş afet × üç etkinlik türü × dört soru. Bu dosyayı kullan, rastgele üretilmiş örnek sorularla değiştirme. Henüz pedagojik nihai onay verilmedi; özellikle eşleştirme ve sürükle-bırak maddelerinin oyun hissi ve yaşa uygunluğu test edilmeli. Eksik/geliştirilmesi gereken ifadeler raporlanmalı.

## Hedef
3. gün belediye raporundan sonra, Çağrı ve AFİ eşliğinde **15 etkinliklik, 300 puanlık** eğitsel final. Beş doğru–yanlış, beş eşleştirme, beş sürükle–bırak; her afet her türde **tam bir defa** temsil edilir. Toplam **5 kolay, 6 orta, 4 zor** etkinlik. Havuz grupları her tür-afette [1 kolay, 2 orta, 1 zor]. Seçicinin rastgele tohumu kayıt altına alınmalı; her yeni deneme yeni bir seçimi deneyebilir, hata tekrarında aynı deneme kaybolmamalı.

## Algoritma
15 (afet × tür) grubu oluştur. Her gruptan tam bir soru seç; zorluk hedefi 5 kolay, 6 orta, 4 zor olarak karşılanır. Önce zorluk atamasını 15 gruba seed'li karıştırmayla dağıt, sonra gruptaki uygun zorlukta soruyu seed'li seç. Sonrasında etkinlik sırasını karıştır; hiçbir grubun ikinci sorusu aynı sınavda kullanılmaz. Zorluk hedefinin mümkün olduğuna dair otomatik test yaz; sınavda her grubun 1 kez geçtiğini doğrula.

## Puanlama
Her etkinlik 20, üst sınır 300. D/Y tam doğru 20, yanlış 0. Eşleştirme 3 eşleştirmenin doğru sayısına göre `Math.round(20*correctPairs/totalPairs)`; sürükle–bırak 2 kart için aynı formül. Ara değerleri yalnız bir kez hesapla, toplamı 300 aşma. Başarı puanı üçüncü günün 1000 *planlama puanı* ile karışmaz. Yanlış cevap gerekçesi göster, öğretici yeniden deneme mümkün; **bir denemenin final kaydı finalizasyon anında bir kez** yapılır. İlk, son ve en iyi sınav ayrı takip edilir. Sonsuz tekrar toplam başarı puanı biriktiremez; liderlik sistemi daha sonra sunucu tarafında korunacak.

## UX / etkileşim
- Mevcut premium oyun sanatı korunur. Büyük tablolardan kaçın, görsel kartlar ve Çağrı/AFİ ile hafif oyun hissi; tamamlanma çubuğu.
- Sürükle-bırak için mobilde iki aşamalı “kartı seç → hedefe dokun” alternatifi ve klavye erişimi zorunlu.
- Eşleştirme fare/touch/klavye; 3 doğru çift, büyük dokunmatik hedefler.
- Bütün 15 etkinlik denendiğinde final tamamlanabilir; yanlış cevap öğrenciye bitirme engeli değildir.
- Her cevap sonrası kısa açıklama, 3 katmanlı isteğe bağlı ipucu; ilerlemeyi kaybetmeme.
- Yanlış cevap ile doğru cevabın kontrastı yalnız renk ile gösterilmez; sembol/metin olur.
- Öğrencinin 5 ses/yazı ayarı ve azaltılmış hareket ayarı korunur; kritik soru/güvenlik metinleri gizlenemez.
- Bitiş ekranında toplam, türlere göre performans, afet türüne göre gelişim önerileri, tekrar deneme. “Gerçek sertifika” veya resmi başarı belgesi vaat etme.

## Teknik veri ve kalite
- JSON için güvenli TypeScript şeması ve runtime doğrulaması ekle; ID benzersiz, her tipe 20, her hazard/tip grubuna 4, zorluk dağılımına uymalı.
- Eşleştirme havuzunda bazı kartlar genel kategoriler kullanıyor; içerik gerçekten anlamlı pedagojik eşleştirme göstermiyorsa, veri kayıtlarını koruyarak `v1.1` içerik revizyonu ve pedagojik not üret.
- Güvenli/tehlikeli davranışlar güncel AFAD ve ilgili resmi kurum önerileriyle yayın öncesi incelenecek; güvenlik garantisi iddia etme.
- React üst ekranı / Phaser sahne geçişi ortak typed store ile çalışsın, aynı etkinlik 2 kez puan kazandırmasın.
- Aşama 9 son rapor → final giriş → 15 soru → sonuç → güvenli geri dönüş yolunu test et.
- Henüz Supabase/öğretmen paneli yoksa yerel prototip puanını gerçek sınıf liderliğine gönderilmiş gibi gösterme.

## Test / teslim
1. `npm run build`, mevcut testler ve yeni otomatik seçici testleri geçer.
2. 60 kayıt validasyonu; 15 soruda 5/5/5 tür, 5 afet × 3 tür, 5/6/4 zorluk dağılımı doğrulanır.
3. 20×15=300 tavanı ve kısmi puanlar test edilir.
4. Üst üste yeniden oynatımda soru seçimi, puan ve ilerleme bozulmaz.
5. 1440x1000, 390x844, klavye, dokunmatik, reducedMotion ve sessiz mod testi.
6. Önceki oyun sahneleri için regresyon testleri.
7. Gerçek ekran görüntüleri: `docs/screenshots/final-intro.png`, `final-true-false.png`, `final-matching.png`, `final-drag-drop.png`, `final-result-desktop.png`, `final-result-mobile.png`.
8. `docs/FAZ_10_TESLIM_RAPORU.md` değişen dosyalar, testler, eksik görseller, soru inceleme notlarını içerir.
9. Kod/test/PNG/raporu `feat/final-assessment` dalına push et; `main` ile birleştirme, Vercel production ve öğretmen paneli YOK. Kullanıcı onayını bekle.
