-- Private canonical bank; never expose this table through public SELECT.
begin;
insert into guvenkent.question_banks(version,content) values('1.1.0',$bank${
  "version": "1.1.0",
  "language": "tr",
  "educationalReviewRequired": true,
  "questions": [
    {
      "id": "earthquake-tf-1",
      "hazard": "earthquake",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Sarsıntı sırasında Çök–Kapan–Tutun uygulamak doğru bir davranıştır.",
      "correct": true,
      "explanation": "Sarsıntıda koşmak yerine Çök–Kapan–Tutun uygula; başını ve boynunu koru."
    },
    {
      "id": "earthquake-tf-2",
      "hazard": "earthquake",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Deprem sırasında asansör kullanmak güvenlidir.",
      "correct": false,
      "explanation": "Deprem sırasında asansör kullanılmaz. Sarsıntıda korun; sonrasında güvenli tahliye yönlendirmesini izle."
    },
    {
      "id": "earthquake-tf-3",
      "hazard": "earthquake",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Sabitlenmemiş yüksek dolabı çocuklar tek başına sabitlemelidir.",
      "correct": false,
      "explanation": "Ağır dolabı çocuklar taşımaz veya sabitlemez. Durumu yetişkine bildir; işi yetkili yetişkinler yapar."
    },
    {
      "id": "earthquake-tf-4",
      "hazard": "earthquake",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Sarsıntı bitince yetkililerin tahliye yönlendirmesine uymalıyız.",
      "correct": true,
      "explanation": "Sarsıntı bittikten sonra yetkili yönlendirmesiyle kontrollü tahliye ol; asansör kullanma."
    },
    {
      "id": "earthquake-match-1",
      "hazard": "earthquake",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Sarsıntı başladı",
          "right": "Çök–Kapan–Tutun uygula"
        },
        {
          "id": "p2",
          "left": "Korunurken başın açıkta",
          "right": "Başını ve boynunu koru"
        },
        {
          "id": "p3",
          "left": "Pencerenin yanında sarsıntı başladı",
          "right": "Camdan korunarak güvenli pozisyonda kal"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Sarsıntı başladı → Çök–Kapan–Tutun uygula · Korunurken başın açıkta → Başını ve boynunu koru · Pencerenin yanında sarsıntı başladı → Camdan korunarak güvenli pozisyonda kal."
    },
    {
      "id": "earthquake-match-2",
      "hazard": "earthquake",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Çanta sınıf kapısını kapatıyor",
          "right": "Sarsıntı öncesinde öğretmene bildir"
        },
        {
          "id": "p2",
          "left": "Yüksek dolap sabit değil",
          "right": "Yetişkinlerden yetkili sabitlemesi iste"
        },
        {
          "id": "p3",
          "left": "Aile afet çantası hazırlıyor",
          "right": "Bir yetişkinle ihtiyaç listesini kontrol et"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Çanta sınıf kapısını kapatıyor → Sarsıntı öncesinde öğretmene bildir · Yüksek dolap sabit değil → Yetişkinlerden yetkili sabitlemesi iste · Aile afet çantası hazırlıyor → Bir yetişkinle ihtiyaç listesini kontrol et."
    },
    {
      "id": "earthquake-match-3",
      "hazard": "earthquake",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Ağır pano gevşek görünüyor",
          "right": "Yaklaşmadan öğretmene ve teknik personele bildir"
        },
        {
          "id": "p2",
          "left": "Sarsıntı sırasında merdivene koşma isteği",
          "right": "Koşmak yerine Çök–Kapan–Tutun uygula"
        },
        {
          "id": "p3",
          "left": "Okulun toplanma yerini bilmiyorsun",
          "right": "Tatbikat öncesi öğretmeninden öğren"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Ağır pano gevşek görünüyor → Yaklaşmadan öğretmene ve teknik personele bildir · Sarsıntı sırasında merdivene koşma isteği → Koşmak yerine Çök–Kapan–Tutun uygula · Okulun toplanma yerini bilmiyorsun → Tatbikat öncesi öğretmeninden öğren."
    },
    {
      "id": "earthquake-match-4",
      "hazard": "earthquake",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Sarsıntı bitti ve tahliye yönlendirmesi geldi",
          "right": "Kontrollü biçimde belirtilen çıkışı kullan"
        },
        {
          "id": "p2",
          "left": "Tahliye sırasında asansör önündesin",
          "right": "Asansörü kullanmadan güvenli çıkış yönünü izle"
        },
        {
          "id": "p3",
          "left": "Toplanma alanına ulaştın",
          "right": "Grubunla kal ve yoklama yönlendirmesini izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Sarsıntı bitti ve tahliye yönlendirmesi geldi → Kontrollü biçimde belirtilen çıkışı kullan · Tahliye sırasında asansör önündesin → Asansörü kullanmadan güvenli çıkış yönünü izle · Toplanma alanına ulaştın → Grubunla kal ve yoklama yönlendirmesini izle."
    },
    {
      "id": "earthquake-drag-1",
      "hazard": "earthquake",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Sarsıntı sırasında"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Baş ve boynu koru",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Asansöre koş",
          "correctZone": "no"
        }
      ],
      "explanation": "“Baş ve boynu koru” bu etkinlikte “Sarsıntı sırasında” başlığına uyar. “Asansöre koş” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "earthquake-drag-2",
      "hazard": "earthquake",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Önceden hazırlık"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Afet çantasını hazırla",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Camın yanında bekle",
          "correctZone": "no"
        }
      ],
      "explanation": "“Afet çantasını hazırla” bu etkinlikte “Önceden hazırlık” başlığına uyar. “Camın yanında bekle” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "earthquake-drag-3",
      "hazard": "earthquake",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Yetişkin işi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yetkili yetişkinin ağır dolabı sabitlemesi",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çocuk tek başına ağır dolabı taşır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yetkili yetişkinin ağır dolabı sabitlemesi” bu etkinlikte “Yetişkin işi” başlığına uyar. “Çocuk tek başına ağır dolabı taşır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "earthquake-drag-4",
      "hazard": "earthquake",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Sarsıntı sonrasında"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yönlendirmeyle toplanma alanına git",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Sarsıntı sırasında dışarı fırla",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yönlendirmeyle toplanma alanına git” bu etkinlikte “Sarsıntı sonrasında” başlığına uyar. “Sarsıntı sırasında dışarı fırla” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "flood-tf-1",
      "hazard": "flood",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Taşkın suyu olan bir yol yürüyerek geçilmemelidir.",
      "correct": true,
      "explanation": "Taşkın suyunun derinliği ve akıntısı yanıltabilir; yürüyerek veya araçla geçmeye çalışma."
    },
    {
      "id": "flood-tf-2",
      "hazard": "flood",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Çocuklar tıkalı yağmur suyu giderini suya girerek açmalıdır.",
      "correct": false,
      "explanation": "Suya girip gider açmak çocukların görevi değildir. Güvenli yerden yetişkine ve belediyeye bildir."
    },
    {
      "id": "flood-tf-3",
      "hazard": "flood",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Erken taşkın uyarıları olası zararı azaltabilir.",
      "correct": true,
      "explanation": "Erken uyarı, güvenli yönlendirme için zaman kazandırabilir; taşkın tehlikesini tamamen yok etmez."
    },
    {
      "id": "flood-tf-4",
      "hazard": "flood",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Hazırlık yapıldığında bütün taşkın tehlikesi ortadan kalkar.",
      "correct": false,
      "explanation": "Hazırlık zararı azaltabilir; taşkın tehlikesini sıfırlamaz. Uyarılara ve kapalı yollara uymaya devam et."
    },
    {
      "id": "flood-match-1",
      "hazard": "flood",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yolun üstünden taşkın suyu geçiyor",
          "right": "Suya girmeden güvenli yerde kal"
        },
        {
          "id": "p2",
          "left": "Arkadaşın taşkınlı yola yürüyor",
          "right": "Suya girmemesi için uyar ve yetişkine bildir"
        },
        {
          "id": "p3",
          "left": "Güvenli yolun nerede olduğunu bilmiyorsun",
          "right": "Yetişkinden resmî rota bilgisini öğren"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yolun üstünden taşkın suyu geçiyor → Suya girmeden güvenli yerde kal · Arkadaşın taşkınlı yola yürüyor → Suya girmemesi için uyar ve yetişkine bildir · Güvenli yolun nerede olduğunu bilmiyorsun → Yetişkinden resmî rota bilgisini öğren."
    },
    {
      "id": "flood-match-2",
      "hazard": "flood",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yağmur suyu gideri tıkalı görünüyor",
          "right": "Güvenli yerden belediye ekibine bildir"
        },
        {
          "id": "p2",
          "left": "Giderin çevresi suyla dolmuş",
          "right": "Temizlemeye çalışmadan alandan uzak dur"
        },
        {
          "id": "p3",
          "left": "Yetkili bakım ekibi geliyor",
          "right": "Çalışma alanını ekibe bırak"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yağmur suyu gideri tıkalı görünüyor → Güvenli yerden belediye ekibine bildir · Giderin çevresi suyla dolmuş → Temizlemeye çalışmadan alandan uzak dur · Yetkili bakım ekibi geliyor → Çalışma alanını ekibe bırak."
    },
    {
      "id": "flood-match-3",
      "hazard": "flood",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Köprüde su yükseliyor",
          "right": "Köprüye girmeden güvenli konumda kal"
        },
        {
          "id": "p2",
          "left": "Köprüye kapatma bariyeri konmuş",
          "right": "Bariyeri aşmadan alternatif rotayı izle"
        },
        {
          "id": "p3",
          "left": "Güvenli rota bilgisi güncellenmiş",
          "right": "Yeni resmî yönlendirmeyi bir yetişkinle kontrol et"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Köprüde su yükseliyor → Köprüye girmeden güvenli konumda kal · Köprüye kapatma bariyeri konmuş → Bariyeri aşmadan alternatif rotayı izle · Güvenli rota bilgisi güncellenmiş → Yeni resmî yönlendirmeyi bir yetişkinle kontrol et."
    },
    {
      "id": "flood-match-4",
      "hazard": "flood",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yoğun yağış uyarısı geldi",
          "right": "Ailenle güvenli güzergâhı önceden öğren"
        },
        {
          "id": "p2",
          "left": "Hazırlıktan sonra da taşkın uyarısı var",
          "right": "Önlemlere rağmen uyarıyı izlemeye devam et"
        },
        {
          "id": "p3",
          "left": "İki planın etkisi karşılaştırılıyor",
          "right": "Yağışı aynı tutup yalnız hazırlıkları karşılaştır"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yoğun yağış uyarısı geldi → Ailenle güvenli güzergâhı önceden öğren · Hazırlıktan sonra da taşkın uyarısı var → Önlemlere rağmen uyarıyı izlemeye devam et · İki planın etkisi karşılaştırılıyor → Yağışı aynı tutup yalnız hazırlıkları karşılaştır."
    },
    {
      "id": "flood-drag-1",
      "hazard": "flood",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Risk belirtisi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Tıkalı yağmur suyu gideri",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Açık ve güvenli tahliye yolu",
          "correctZone": "no"
        }
      ],
      "explanation": "“Tıkalı yağmur suyu gideri” bu etkinlikte “Risk belirtisi” başlığına uyar. “Açık ve güvenli tahliye yolu” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "flood-drag-2",
      "hazard": "flood",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Yetkili ekip işi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yetkili ekibin gider temizliği",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çocuk suya girer",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yetkili ekibin gider temizliği” bu etkinlikte “Yetkili ekip işi” başlığına uyar. “Çocuk suya girer” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "flood-drag-3",
      "hazard": "flood",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Güvenli yönlendirme"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Taşkınlı köprüden uzak dur",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Suyu yürüyerek geç",
          "correctZone": "no"
        }
      ],
      "explanation": "“Taşkınlı köprüden uzak dur” bu etkinlikte “Güvenli yönlendirme” başlığına uyar. “Suyu yürüyerek geç” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "flood-drag-4",
      "hazard": "flood",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Hazırlık sonrası"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Erken uyarı yayılır",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Taşkın riski sıfırlanır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Erken uyarı yayılır” bu etkinlikte “Hazırlık sonrası” başlığına uyar. “Taşkın riski sıfırlanır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "wildfire-tf-1",
      "hazard": "wildfire",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Uzaktaki şüpheli duman güvenli yerden yetişkinlere bildirilmelidir.",
      "correct": true,
      "explanation": "Dumana yaklaşmadan güvenli yönde uzaklaş ve bir yetişkine haber ver; müdahaleyi yetkililere bırak."
    },
    {
      "id": "wildfire-tf-2",
      "hazard": "wildfire",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Çocuk küçük yangını tek başına söndürmeye çalışmalıdır.",
      "correct": false,
      "explanation": "Çocuklar yangına müdahale etmez. Güvenli yönde uzaklaş ve yetişkine haber ver."
    },
    {
      "id": "wildfire-tf-3",
      "hazard": "wildfire",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Erken bildirim ve güvenli yönlendirme riski azaltabilir.",
      "correct": true,
      "explanation": "Erken bildirim ve güvenli yönlendirme insanların uzaklaşmasına yardım edebilir; tehlike sürer."
    },
    {
      "id": "wildfire-tf-4",
      "hazard": "wildfire",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Orman bakım planı yangın ihtimalini kesin sıfırlar.",
      "correct": false,
      "explanation": "Orman bakımı riski azaltmaya yardımcı olabilir, yangın ihtimalini sıfırlamaz. Resmî uyarılar izlenir."
    },
    {
      "id": "wildfire-match-1",
      "hazard": "wildfire",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Uzaktan şüpheli duman görüyorsun",
          "right": "Yaklaşmadan güvenli yerden yetişkine bildir"
        },
        {
          "id": "p2",
          "left": "Arkadaşın dumana yaklaşmak istiyor",
          "right": "Yaklaşmamasını söyle ve güvenli yönde kal"
        },
        {
          "id": "p3",
          "left": "Yetkililer çıkış yönü gösteriyor",
          "right": "Belirtilen güvenli çıkışı izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Uzaktan şüpheli duman görüyorsun → Yaklaşmadan güvenli yerden yetişkine bildir · Arkadaşın dumana yaklaşmak istiyor → Yaklaşmamasını söyle ve güvenli yönde kal · Yetkililer çıkış yönü gösteriyor → Belirtilen güvenli çıkışı izle."
    },
    {
      "id": "wildfire-match-2",
      "hazard": "wildfire",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yasak alanda ateş yakıldığını görüyorsun",
          "right": "Güvenli uzaklıktan yetişkine haber ver"
        },
        {
          "id": "p2",
          "left": "Bir çocuk ateşi söndürmeye hazırlanıyor",
          "right": "Müdahaleyi yetişkinlere bırakmasını söyle"
        },
        {
          "id": "p3",
          "left": "Orman görevlisi alanı kapatmış",
          "right": "Kapatılan alanın dışında kal"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yasak alanda ateş yakıldığını görüyorsun → Güvenli uzaklıktan yetişkine haber ver · Bir çocuk ateşi söndürmeye hazırlanıyor → Müdahaleyi yetişkinlere bırakmasını söyle · Orman görevlisi alanı kapatmış → Kapatılan alanın dışında kal."
    },
    {
      "id": "wildfire-match-3",
      "hazard": "wildfire",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Ziyaretçi çıkışı için resmî rota duyurulmuş",
          "right": "Grubunla belirtilen güvenli rotayı izle"
        },
        {
          "id": "p2",
          "left": "Alevlere yakın bir kestirme var",
          "right": "Kestirmeye girmeden yetkili yönlendirmesini izle"
        },
        {
          "id": "p3",
          "left": "Grubun güvenli buluşma yerine ulaştı",
          "right": "Grubunla kal ve yoklama bilgisini bekle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Ziyaretçi çıkışı için resmî rota duyurulmuş → Grubunla belirtilen güvenli rotayı izle · Alevlere yakın bir kestirme var → Kestirmeye girmeden yetkili yönlendirmesini izle · Grubun güvenli buluşma yerine ulaştı → Grubunla kal ve yoklama bilgisini bekle."
    },
    {
      "id": "wildfire-match-4",
      "hazard": "wildfire",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Kuru bitki bakımı gerekiyor",
          "right": "Bakım işini yetkili ekibin planlamasına bırak"
        },
        {
          "id": "p2",
          "left": "Bakım sonrası yeni yangın uyarısı geldi",
          "right": "Risk sürdüğü için uyarıyı izlemeye devam et"
        },
        {
          "id": "p3",
          "left": "İki hazırlık planı karşılaştırılıyor",
          "right": "Hava ve rüzgârı aynı tutup hazırlıkları değiştir"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Kuru bitki bakımı gerekiyor → Bakım işini yetkili ekibin planlamasına bırak · Bakım sonrası yeni yangın uyarısı geldi → Risk sürdüğü için uyarıyı izlemeye devam et · İki hazırlık planı karşılaştırılıyor → Hava ve rüzgârı aynı tutup hazırlıkları değiştir."
    },
    {
      "id": "wildfire-drag-1",
      "hazard": "wildfire",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Güvenli davranış"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Dumanı yetişkine bildir",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Ateşi kendin söndür",
          "correctZone": "no"
        }
      ],
      "explanation": "“Dumanı yetişkine bildir” bu etkinlikte “Güvenli davranış” başlığına uyar. “Ateşi kendin söndür” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "wildfire-drag-2",
      "hazard": "wildfire",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Uzman görevi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yetkili ekibin orman bakım planı",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çocuk alevlere girer",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yetkili ekibin orman bakım planı” bu etkinlikte “Uzman görevi” başlığına uyar. “Çocuk alevlere girer” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "wildfire-drag-3",
      "hazard": "wildfire",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Hazırlık"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Erken uyarı ve güvenli rota",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Yangın kesin çıkmaz",
          "correctZone": "no"
        }
      ],
      "explanation": "“Erken uyarı ve güvenli rota” bu etkinlikte “Hazırlık” başlığına uyar. “Yangın kesin çıkmaz” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "wildfire-drag-4",
      "hazard": "wildfire",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Duman görülünce"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Uzaklaşıp resmî uyarıları izle",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Merak edip yakından bak",
          "correctZone": "no"
        }
      ],
      "explanation": "“Uzaklaşıp resmî uyarıları izle” bu etkinlikte “Duman görülünce” başlığına uyar. “Merak edip yakından bak” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "landslide-tf-1",
      "hazard": "landslide",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Yamaçtaki yeni çatlakları güvenli konumdan yetişkine bildirmek uygundur.",
      "correct": true,
      "explanation": "Çatlağa yaklaşmadan güvenli gözlem noktasından yetişkine bildir; incelemeyi uzman yapar."
    },
    {
      "id": "landslide-tf-2",
      "hazard": "landslide",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Her yağmur kesinlikle heyelana neden olur.",
      "correct": false,
      "explanation": "Her yağış kesin heyelan demek değildir. Yağış, eğim ve zemin birlikte değerlendirilir; kararı uzmanlar verir."
    },
    {
      "id": "landslide-tf-3",
      "hazard": "landslide",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Çocuklar şevde tek başlarına kazı ve drenaj çalışması yapmalıdır.",
      "correct": false,
      "explanation": "Kazı ve drenaj uzmanlık işidir. Çocuklar yamaca girmez; belirtileri güvenli yerden bildirir."
    },
    {
      "id": "landslide-tf-4",
      "hazard": "landslide",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Riskli yolun zamanında kapatılması zararı azaltabilir.",
      "correct": true,
      "explanation": "Yol kapatma insanların tehlikeden uzak kalmasına yardım eder; heyelan tehlikesini ortadan kaldırmaz."
    },
    {
      "id": "landslide-match-1",
      "hazard": "landslide",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yamaçta yeni çatlak görüyorsun",
          "right": "Güvenli gözlem yerinden yetişkine bildir"
        },
        {
          "id": "p2",
          "left": "Arkadaşın çatlağa yaklaşmak istiyor",
          "right": "Yaklaşmamasını söyle ve güvenli konumda kal"
        },
        {
          "id": "p3",
          "left": "Yol için kapatma uyarısı gelmiş",
          "right": "Kapalı yola girmeden yönlendirmeyi izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yamaçta yeni çatlak görüyorsun → Güvenli gözlem yerinden yetişkine bildir · Arkadaşın çatlağa yaklaşmak istiyor → Yaklaşmamasını söyle ve güvenli konumda kal · Yol için kapatma uyarısı gelmiş → Kapalı yola girmeden yönlendirmeyi izle."
    },
    {
      "id": "landslide-match-2",
      "hazard": "landslide",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yamaçta yüzey suyu birikiyor",
          "right": "Güvenli yerden uzman drenaj incelemesi iste"
        },
        {
          "id": "p2",
          "left": "Bir çocuk yamaçta kanal kazmayı öneriyor",
          "right": "Kazıyı uzmanlara bırakmasını söyle"
        },
        {
          "id": "p3",
          "left": "İnceleme ekibi çalışma alanı kurmuş",
          "right": "Çalışma alanının dışında kal"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yamaçta yüzey suyu birikiyor → Güvenli yerden uzman drenaj incelemesi iste · Bir çocuk yamaçta kanal kazmayı öneriyor → Kazıyı uzmanlara bırakmasını söyle · İnceleme ekibi çalışma alanı kurmuş → Çalışma alanının dışında kal."
    },
    {
      "id": "landslide-match-3",
      "hazard": "landslide",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Ev dik yamaca yakın görünüyor",
          "right": "Güvenliğini uzman zemin incelemesiyle değerlendirt"
        },
        {
          "id": "p2",
          "left": "Yamaçta yeni bir yapı öneriliyor",
          "right": "Yer seçimini yetkili uzmanların değerlendirmesine bırak"
        },
        {
          "id": "p3",
          "left": "Yağışla birlikte yeni çatlak uyarısı var",
          "right": "Yapıyı kendin incelemeden güvenli yönlendirmeyi izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Ev dik yamaca yakın görünüyor → Güvenliğini uzman zemin incelemesiyle değerlendirt · Yamaçta yeni bir yapı öneriliyor → Yer seçimini yetkili uzmanların değerlendirmesine bırak · Yağışla birlikte yeni çatlak uyarısı var → Yapıyı kendin incelemeden güvenli yönlendirmeyi izle."
    },
    {
      "id": "landslide-match-4",
      "hazard": "landslide",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yamaç yolu kapatılmış",
          "right": "Resmî alternatif güvenli rotayı izle"
        },
        {
          "id": "p2",
          "left": "Hazırlıktan sonra da uyarı sürüyor",
          "right": "Risk bitmediği için kapalı alandan uzak dur"
        },
        {
          "id": "p3",
          "left": "İki hazırlık senaryosu karşılaştırılıyor",
          "right": "Yağış ve zemin koşullarını aynı tut"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yamaç yolu kapatılmış → Resmî alternatif güvenli rotayı izle · Hazırlıktan sonra da uyarı sürüyor → Risk bitmediği için kapalı alandan uzak dur · İki hazırlık senaryosu karşılaştırılıyor → Yağış ve zemin koşullarını aynı tut."
    },
    {
      "id": "landslide-drag-1",
      "hazard": "landslide",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Belirti"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yamaçta yeni çatlak",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Eğimde koş",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yamaçta yeni çatlak” bu etkinlikte “Belirti” başlığına uyar. “Eğimde koş” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "landslide-drag-2",
      "hazard": "landslide",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Uzman önlemi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Uzmanın zemin incelemesi",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çatlağa yaklaş",
          "correctZone": "no"
        }
      ],
      "explanation": "“Uzmanın zemin incelemesi” bu etkinlikte “Uzman önlemi” başlığına uyar. “Çatlağa yaklaş” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "landslide-drag-3",
      "hazard": "landslide",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Güvenli davranış"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Resmî yol kapanışına uy",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Şevde kazı yap",
          "correctZone": "no"
        }
      ],
      "explanation": "“Resmî yol kapanışına uy” bu etkinlikte “Güvenli davranış” başlığına uyar. “Şevde kazı yap” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "landslide-drag-4",
      "hazard": "landslide",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Hazırlık sonrası"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Uyarı ve alternatif rota",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Heyelan ihtimali kesin sıfır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Uyarı ve alternatif rota” bu etkinlikte “Hazırlık sonrası” başlığına uyar. “Heyelan ihtimali kesin sıfır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "avalanche-tf-1",
      "hazard": "avalanche",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Çığ riski nedeniyle kapatılan yola girilmemelidir.",
      "correct": true,
      "explanation": "Kapatılan yolun bariyerini aşma. Güvenli konumda kal ve resmî alternatif rotayı izle."
    },
    {
      "id": "avalanche-tf-2",
      "hazard": "avalanche",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Karın güvenliğini anlamak için dik yamaçta zıplanmalıdır.",
      "correct": false,
      "explanation": "Karın güvenliğini zıplayarak test etme; dik karlı yamaca girme. Değerlendirme uzmanların işidir."
    },
    {
      "id": "avalanche-tf-3",
      "hazard": "avalanche",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Resmî çığ uyarısı ve güvenli rota bilgisi önemlidir.",
      "correct": true,
      "explanation": "Güncel resmî uyarı ve güvenli rota bilgisi izlenir; kapalı yola girilmez."
    },
    {
      "id": "avalanche-tf-4",
      "hazard": "avalanche",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Hazırlık önlemleri tüm çığ riskini yok eder.",
      "correct": false,
      "explanation": "Hazırlıklar riski azaltmaya yardımcı olabilir; çığ tehlikesini sıfırlamaz. Resmî uyarılara uy."
    },
    {
      "id": "avalanche-match-1",
      "hazard": "avalanche",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Karlı yol çığ riskiyle kapatılmış",
          "right": "Bariyeri aşmadan kapalı yoldan uzak dur"
        },
        {
          "id": "p2",
          "left": "Arkadaşın bariyeri geçmek istiyor",
          "right": "Geçmemesini söyle ve yetişkine bildir"
        },
        {
          "id": "p3",
          "left": "Güvenli rota duyurulmuş",
          "right": "Grubunla belirtilen rotayı izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Karlı yol çığ riskiyle kapatılmış → Bariyeri aşmadan kapalı yoldan uzak dur · Arkadaşın bariyeri geçmek istiyor → Geçmemesini söyle ve yetişkine bildir · Güvenli rota duyurulmuş → Grubunla belirtilen rotayı izle."
    },
    {
      "id": "avalanche-match-2",
      "hazard": "avalanche",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Dik kar yamacı önündesin",
          "right": "Güvenli gözlem alanında kal"
        },
        {
          "id": "p2",
          "left": "Bir çocuk karı zıplayarak test etmek istiyor",
          "right": "Test etmemesini söyle ve yetişkine bildir"
        },
        {
          "id": "p3",
          "left": "Kar güvenliği için inceleme gerekiyor",
          "right": "Değerlendirmeyi çığ uzmanlarına bırak"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Dik kar yamacı önündesin → Güvenli gözlem alanında kal · Bir çocuk karı zıplayarak test etmek istiyor → Test etmemesini söyle ve yetişkine bildir · Kar güvenliği için inceleme gerekiyor → Değerlendirmeyi çığ uzmanlarına bırak."
    },
    {
      "id": "avalanche-match-3",
      "hazard": "avalanche",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Resmî çığ uyarısı geldi",
          "right": "Bir yetişkinle güncel güvenli rota bilgisini öğren"
        },
        {
          "id": "p2",
          "left": "Uyarıyla bir yol kapatıldı",
          "right": "Kapatılan yola girmeden yönlendirmeyi izle"
        },
        {
          "id": "p3",
          "left": "Grubun güvenli buluşma alanına ulaştı",
          "right": "Grubunla kal ve yoklama yönlendirmesini izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Resmî çığ uyarısı geldi → Bir yetişkinle güncel güvenli rota bilgisini öğren · Uyarıyla bir yol kapatıldı → Kapatılan yola girmeden yönlendirmeyi izle · Grubun güvenli buluşma alanına ulaştı → Grubunla kal ve yoklama yönlendirmesini izle."
    },
    {
      "id": "avalanche-match-4",
      "hazard": "avalanche",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Bölgenin çığ tehlikesi incelenmeli",
          "right": "Yetkili kurum ve çığ uzmanının değerlendirmesini iste"
        },
        {
          "id": "p2",
          "left": "Hazırlık sonrası da çığ uyarısı var",
          "right": "Risk sürdüğü için kapalı alana girme"
        },
        {
          "id": "p3",
          "left": "İki planın etkisi karşılaştırılıyor",
          "right": "Kar ve eğim koşullarını aynı tutup hazırlıkları değiştir"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Bölgenin çığ tehlikesi incelenmeli → Yetkili kurum ve çığ uzmanının değerlendirmesini iste · Hazırlık sonrası da çığ uyarısı var → Risk sürdüğü için kapalı alana girme · İki planın etkisi karşılaştırılıyor → Kar ve eğim koşullarını aynı tutup hazırlıkları değiştir."
    },
    {
      "id": "avalanche-drag-1",
      "hazard": "avalanche",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Güvenli davranış"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Kapalı yoldan uzak dur",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Bariyeri aş",
          "correctZone": "no"
        }
      ],
      "explanation": "“Kapalı yoldan uzak dur” bu etkinlikte “Güvenli davranış” başlığına uyar. “Bariyeri aş” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "avalanche-drag-2",
      "hazard": "avalanche",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Uzman görevi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Çığ tehlikesi değerlendirmesi",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çocuk karı test eder",
          "correctZone": "no"
        }
      ],
      "explanation": "“Çığ tehlikesi değerlendirmesi” bu etkinlikte “Uzman görevi” başlığına uyar. “Çocuk karı test eder” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "avalanche-drag-3",
      "hazard": "avalanche",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Hazırlık"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Alternatif güvenli rotanın duyurulması",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Risk kesin sıfır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Alternatif güvenli rotanın duyurulması” bu etkinlikte “Hazırlık” başlığına uyar. “Risk kesin sıfır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "avalanche-drag-4",
      "hazard": "avalanche",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Önce/sonra aynı"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yamaç eğimi ve kar koşulları",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Uyarı erişimi hep aynıdır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yamaç eğimi ve kar koşulları” bu etkinlikte “Önce/sonra aynı” başlığına uyar. “Uyarı erişimi hep aynıdır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    }
  ],
  "sourceVersion": "1.0.0"
}
$bank$::jsonb) on conflict(version) do nothing;
do $$begin if (select content from guvenkent.question_banks where version='1.1.0') <> $bank${
  "version": "1.1.0",
  "language": "tr",
  "educationalReviewRequired": true,
  "questions": [
    {
      "id": "earthquake-tf-1",
      "hazard": "earthquake",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Sarsıntı sırasında Çök–Kapan–Tutun uygulamak doğru bir davranıştır.",
      "correct": true,
      "explanation": "Sarsıntıda koşmak yerine Çök–Kapan–Tutun uygula; başını ve boynunu koru."
    },
    {
      "id": "earthquake-tf-2",
      "hazard": "earthquake",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Deprem sırasında asansör kullanmak güvenlidir.",
      "correct": false,
      "explanation": "Deprem sırasında asansör kullanılmaz. Sarsıntıda korun; sonrasında güvenli tahliye yönlendirmesini izle."
    },
    {
      "id": "earthquake-tf-3",
      "hazard": "earthquake",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Sabitlenmemiş yüksek dolabı çocuklar tek başına sabitlemelidir.",
      "correct": false,
      "explanation": "Ağır dolabı çocuklar taşımaz veya sabitlemez. Durumu yetişkine bildir; işi yetkili yetişkinler yapar."
    },
    {
      "id": "earthquake-tf-4",
      "hazard": "earthquake",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Sarsıntı bitince yetkililerin tahliye yönlendirmesine uymalıyız.",
      "correct": true,
      "explanation": "Sarsıntı bittikten sonra yetkili yönlendirmesiyle kontrollü tahliye ol; asansör kullanma."
    },
    {
      "id": "earthquake-match-1",
      "hazard": "earthquake",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Sarsıntı başladı",
          "right": "Çök–Kapan–Tutun uygula"
        },
        {
          "id": "p2",
          "left": "Korunurken başın açıkta",
          "right": "Başını ve boynunu koru"
        },
        {
          "id": "p3",
          "left": "Pencerenin yanında sarsıntı başladı",
          "right": "Camdan korunarak güvenli pozisyonda kal"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Sarsıntı başladı → Çök–Kapan–Tutun uygula · Korunurken başın açıkta → Başını ve boynunu koru · Pencerenin yanında sarsıntı başladı → Camdan korunarak güvenli pozisyonda kal."
    },
    {
      "id": "earthquake-match-2",
      "hazard": "earthquake",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Çanta sınıf kapısını kapatıyor",
          "right": "Sarsıntı öncesinde öğretmene bildir"
        },
        {
          "id": "p2",
          "left": "Yüksek dolap sabit değil",
          "right": "Yetişkinlerden yetkili sabitlemesi iste"
        },
        {
          "id": "p3",
          "left": "Aile afet çantası hazırlıyor",
          "right": "Bir yetişkinle ihtiyaç listesini kontrol et"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Çanta sınıf kapısını kapatıyor → Sarsıntı öncesinde öğretmene bildir · Yüksek dolap sabit değil → Yetişkinlerden yetkili sabitlemesi iste · Aile afet çantası hazırlıyor → Bir yetişkinle ihtiyaç listesini kontrol et."
    },
    {
      "id": "earthquake-match-3",
      "hazard": "earthquake",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Ağır pano gevşek görünüyor",
          "right": "Yaklaşmadan öğretmene ve teknik personele bildir"
        },
        {
          "id": "p2",
          "left": "Sarsıntı sırasında merdivene koşma isteği",
          "right": "Koşmak yerine Çök–Kapan–Tutun uygula"
        },
        {
          "id": "p3",
          "left": "Okulun toplanma yerini bilmiyorsun",
          "right": "Tatbikat öncesi öğretmeninden öğren"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Ağır pano gevşek görünüyor → Yaklaşmadan öğretmene ve teknik personele bildir · Sarsıntı sırasında merdivene koşma isteği → Koşmak yerine Çök–Kapan–Tutun uygula · Okulun toplanma yerini bilmiyorsun → Tatbikat öncesi öğretmeninden öğren."
    },
    {
      "id": "earthquake-match-4",
      "hazard": "earthquake",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Sarsıntı bitti ve tahliye yönlendirmesi geldi",
          "right": "Kontrollü biçimde belirtilen çıkışı kullan"
        },
        {
          "id": "p2",
          "left": "Tahliye sırasında asansör önündesin",
          "right": "Asansörü kullanmadan güvenli çıkış yönünü izle"
        },
        {
          "id": "p3",
          "left": "Toplanma alanına ulaştın",
          "right": "Grubunla kal ve yoklama yönlendirmesini izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Sarsıntı bitti ve tahliye yönlendirmesi geldi → Kontrollü biçimde belirtilen çıkışı kullan · Tahliye sırasında asansör önündesin → Asansörü kullanmadan güvenli çıkış yönünü izle · Toplanma alanına ulaştın → Grubunla kal ve yoklama yönlendirmesini izle."
    },
    {
      "id": "earthquake-drag-1",
      "hazard": "earthquake",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Sarsıntı sırasında"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Baş ve boynu koru",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Asansöre koş",
          "correctZone": "no"
        }
      ],
      "explanation": "“Baş ve boynu koru” bu etkinlikte “Sarsıntı sırasında” başlığına uyar. “Asansöre koş” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "earthquake-drag-2",
      "hazard": "earthquake",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Önceden hazırlık"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Afet çantasını hazırla",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Camın yanında bekle",
          "correctZone": "no"
        }
      ],
      "explanation": "“Afet çantasını hazırla” bu etkinlikte “Önceden hazırlık” başlığına uyar. “Camın yanında bekle” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "earthquake-drag-3",
      "hazard": "earthquake",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Yetişkin işi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yetkili yetişkinin ağır dolabı sabitlemesi",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çocuk tek başına ağır dolabı taşır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yetkili yetişkinin ağır dolabı sabitlemesi” bu etkinlikte “Yetişkin işi” başlığına uyar. “Çocuk tek başına ağır dolabı taşır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "earthquake-drag-4",
      "hazard": "earthquake",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Sarsıntı sonrasında"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yönlendirmeyle toplanma alanına git",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Sarsıntı sırasında dışarı fırla",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yönlendirmeyle toplanma alanına git” bu etkinlikte “Sarsıntı sonrasında” başlığına uyar. “Sarsıntı sırasında dışarı fırla” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "flood-tf-1",
      "hazard": "flood",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Taşkın suyu olan bir yol yürüyerek geçilmemelidir.",
      "correct": true,
      "explanation": "Taşkın suyunun derinliği ve akıntısı yanıltabilir; yürüyerek veya araçla geçmeye çalışma."
    },
    {
      "id": "flood-tf-2",
      "hazard": "flood",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Çocuklar tıkalı yağmur suyu giderini suya girerek açmalıdır.",
      "correct": false,
      "explanation": "Suya girip gider açmak çocukların görevi değildir. Güvenli yerden yetişkine ve belediyeye bildir."
    },
    {
      "id": "flood-tf-3",
      "hazard": "flood",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Erken taşkın uyarıları olası zararı azaltabilir.",
      "correct": true,
      "explanation": "Erken uyarı, güvenli yönlendirme için zaman kazandırabilir; taşkın tehlikesini tamamen yok etmez."
    },
    {
      "id": "flood-tf-4",
      "hazard": "flood",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Hazırlık yapıldığında bütün taşkın tehlikesi ortadan kalkar.",
      "correct": false,
      "explanation": "Hazırlık zararı azaltabilir; taşkın tehlikesini sıfırlamaz. Uyarılara ve kapalı yollara uymaya devam et."
    },
    {
      "id": "flood-match-1",
      "hazard": "flood",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yolun üstünden taşkın suyu geçiyor",
          "right": "Suya girmeden güvenli yerde kal"
        },
        {
          "id": "p2",
          "left": "Arkadaşın taşkınlı yola yürüyor",
          "right": "Suya girmemesi için uyar ve yetişkine bildir"
        },
        {
          "id": "p3",
          "left": "Güvenli yolun nerede olduğunu bilmiyorsun",
          "right": "Yetişkinden resmî rota bilgisini öğren"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yolun üstünden taşkın suyu geçiyor → Suya girmeden güvenli yerde kal · Arkadaşın taşkınlı yola yürüyor → Suya girmemesi için uyar ve yetişkine bildir · Güvenli yolun nerede olduğunu bilmiyorsun → Yetişkinden resmî rota bilgisini öğren."
    },
    {
      "id": "flood-match-2",
      "hazard": "flood",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yağmur suyu gideri tıkalı görünüyor",
          "right": "Güvenli yerden belediye ekibine bildir"
        },
        {
          "id": "p2",
          "left": "Giderin çevresi suyla dolmuş",
          "right": "Temizlemeye çalışmadan alandan uzak dur"
        },
        {
          "id": "p3",
          "left": "Yetkili bakım ekibi geliyor",
          "right": "Çalışma alanını ekibe bırak"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yağmur suyu gideri tıkalı görünüyor → Güvenli yerden belediye ekibine bildir · Giderin çevresi suyla dolmuş → Temizlemeye çalışmadan alandan uzak dur · Yetkili bakım ekibi geliyor → Çalışma alanını ekibe bırak."
    },
    {
      "id": "flood-match-3",
      "hazard": "flood",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Köprüde su yükseliyor",
          "right": "Köprüye girmeden güvenli konumda kal"
        },
        {
          "id": "p2",
          "left": "Köprüye kapatma bariyeri konmuş",
          "right": "Bariyeri aşmadan alternatif rotayı izle"
        },
        {
          "id": "p3",
          "left": "Güvenli rota bilgisi güncellenmiş",
          "right": "Yeni resmî yönlendirmeyi bir yetişkinle kontrol et"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Köprüde su yükseliyor → Köprüye girmeden güvenli konumda kal · Köprüye kapatma bariyeri konmuş → Bariyeri aşmadan alternatif rotayı izle · Güvenli rota bilgisi güncellenmiş → Yeni resmî yönlendirmeyi bir yetişkinle kontrol et."
    },
    {
      "id": "flood-match-4",
      "hazard": "flood",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yoğun yağış uyarısı geldi",
          "right": "Ailenle güvenli güzergâhı önceden öğren"
        },
        {
          "id": "p2",
          "left": "Hazırlıktan sonra da taşkın uyarısı var",
          "right": "Önlemlere rağmen uyarıyı izlemeye devam et"
        },
        {
          "id": "p3",
          "left": "İki planın etkisi karşılaştırılıyor",
          "right": "Yağışı aynı tutup yalnız hazırlıkları karşılaştır"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yoğun yağış uyarısı geldi → Ailenle güvenli güzergâhı önceden öğren · Hazırlıktan sonra da taşkın uyarısı var → Önlemlere rağmen uyarıyı izlemeye devam et · İki planın etkisi karşılaştırılıyor → Yağışı aynı tutup yalnız hazırlıkları karşılaştır."
    },
    {
      "id": "flood-drag-1",
      "hazard": "flood",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Risk belirtisi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Tıkalı yağmur suyu gideri",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Açık ve güvenli tahliye yolu",
          "correctZone": "no"
        }
      ],
      "explanation": "“Tıkalı yağmur suyu gideri” bu etkinlikte “Risk belirtisi” başlığına uyar. “Açık ve güvenli tahliye yolu” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "flood-drag-2",
      "hazard": "flood",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Yetkili ekip işi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yetkili ekibin gider temizliği",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çocuk suya girer",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yetkili ekibin gider temizliği” bu etkinlikte “Yetkili ekip işi” başlığına uyar. “Çocuk suya girer” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "flood-drag-3",
      "hazard": "flood",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Güvenli yönlendirme"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Taşkınlı köprüden uzak dur",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Suyu yürüyerek geç",
          "correctZone": "no"
        }
      ],
      "explanation": "“Taşkınlı köprüden uzak dur” bu etkinlikte “Güvenli yönlendirme” başlığına uyar. “Suyu yürüyerek geç” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "flood-drag-4",
      "hazard": "flood",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Hazırlık sonrası"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Erken uyarı yayılır",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Taşkın riski sıfırlanır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Erken uyarı yayılır” bu etkinlikte “Hazırlık sonrası” başlığına uyar. “Taşkın riski sıfırlanır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "wildfire-tf-1",
      "hazard": "wildfire",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Uzaktaki şüpheli duman güvenli yerden yetişkinlere bildirilmelidir.",
      "correct": true,
      "explanation": "Dumana yaklaşmadan güvenli yönde uzaklaş ve bir yetişkine haber ver; müdahaleyi yetkililere bırak."
    },
    {
      "id": "wildfire-tf-2",
      "hazard": "wildfire",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Çocuk küçük yangını tek başına söndürmeye çalışmalıdır.",
      "correct": false,
      "explanation": "Çocuklar yangına müdahale etmez. Güvenli yönde uzaklaş ve yetişkine haber ver."
    },
    {
      "id": "wildfire-tf-3",
      "hazard": "wildfire",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Erken bildirim ve güvenli yönlendirme riski azaltabilir.",
      "correct": true,
      "explanation": "Erken bildirim ve güvenli yönlendirme insanların uzaklaşmasına yardım edebilir; tehlike sürer."
    },
    {
      "id": "wildfire-tf-4",
      "hazard": "wildfire",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Orman bakım planı yangın ihtimalini kesin sıfırlar.",
      "correct": false,
      "explanation": "Orman bakımı riski azaltmaya yardımcı olabilir, yangın ihtimalini sıfırlamaz. Resmî uyarılar izlenir."
    },
    {
      "id": "wildfire-match-1",
      "hazard": "wildfire",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Uzaktan şüpheli duman görüyorsun",
          "right": "Yaklaşmadan güvenli yerden yetişkine bildir"
        },
        {
          "id": "p2",
          "left": "Arkadaşın dumana yaklaşmak istiyor",
          "right": "Yaklaşmamasını söyle ve güvenli yönde kal"
        },
        {
          "id": "p3",
          "left": "Yetkililer çıkış yönü gösteriyor",
          "right": "Belirtilen güvenli çıkışı izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Uzaktan şüpheli duman görüyorsun → Yaklaşmadan güvenli yerden yetişkine bildir · Arkadaşın dumana yaklaşmak istiyor → Yaklaşmamasını söyle ve güvenli yönde kal · Yetkililer çıkış yönü gösteriyor → Belirtilen güvenli çıkışı izle."
    },
    {
      "id": "wildfire-match-2",
      "hazard": "wildfire",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yasak alanda ateş yakıldığını görüyorsun",
          "right": "Güvenli uzaklıktan yetişkine haber ver"
        },
        {
          "id": "p2",
          "left": "Bir çocuk ateşi söndürmeye hazırlanıyor",
          "right": "Müdahaleyi yetişkinlere bırakmasını söyle"
        },
        {
          "id": "p3",
          "left": "Orman görevlisi alanı kapatmış",
          "right": "Kapatılan alanın dışında kal"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yasak alanda ateş yakıldığını görüyorsun → Güvenli uzaklıktan yetişkine haber ver · Bir çocuk ateşi söndürmeye hazırlanıyor → Müdahaleyi yetişkinlere bırakmasını söyle · Orman görevlisi alanı kapatmış → Kapatılan alanın dışında kal."
    },
    {
      "id": "wildfire-match-3",
      "hazard": "wildfire",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Ziyaretçi çıkışı için resmî rota duyurulmuş",
          "right": "Grubunla belirtilen güvenli rotayı izle"
        },
        {
          "id": "p2",
          "left": "Alevlere yakın bir kestirme var",
          "right": "Kestirmeye girmeden yetkili yönlendirmesini izle"
        },
        {
          "id": "p3",
          "left": "Grubun güvenli buluşma yerine ulaştı",
          "right": "Grubunla kal ve yoklama bilgisini bekle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Ziyaretçi çıkışı için resmî rota duyurulmuş → Grubunla belirtilen güvenli rotayı izle · Alevlere yakın bir kestirme var → Kestirmeye girmeden yetkili yönlendirmesini izle · Grubun güvenli buluşma yerine ulaştı → Grubunla kal ve yoklama bilgisini bekle."
    },
    {
      "id": "wildfire-match-4",
      "hazard": "wildfire",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Kuru bitki bakımı gerekiyor",
          "right": "Bakım işini yetkili ekibin planlamasına bırak"
        },
        {
          "id": "p2",
          "left": "Bakım sonrası yeni yangın uyarısı geldi",
          "right": "Risk sürdüğü için uyarıyı izlemeye devam et"
        },
        {
          "id": "p3",
          "left": "İki hazırlık planı karşılaştırılıyor",
          "right": "Hava ve rüzgârı aynı tutup hazırlıkları değiştir"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Kuru bitki bakımı gerekiyor → Bakım işini yetkili ekibin planlamasına bırak · Bakım sonrası yeni yangın uyarısı geldi → Risk sürdüğü için uyarıyı izlemeye devam et · İki hazırlık planı karşılaştırılıyor → Hava ve rüzgârı aynı tutup hazırlıkları değiştir."
    },
    {
      "id": "wildfire-drag-1",
      "hazard": "wildfire",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Güvenli davranış"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Dumanı yetişkine bildir",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Ateşi kendin söndür",
          "correctZone": "no"
        }
      ],
      "explanation": "“Dumanı yetişkine bildir” bu etkinlikte “Güvenli davranış” başlığına uyar. “Ateşi kendin söndür” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "wildfire-drag-2",
      "hazard": "wildfire",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Uzman görevi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yetkili ekibin orman bakım planı",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çocuk alevlere girer",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yetkili ekibin orman bakım planı” bu etkinlikte “Uzman görevi” başlığına uyar. “Çocuk alevlere girer” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "wildfire-drag-3",
      "hazard": "wildfire",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Hazırlık"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Erken uyarı ve güvenli rota",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Yangın kesin çıkmaz",
          "correctZone": "no"
        }
      ],
      "explanation": "“Erken uyarı ve güvenli rota” bu etkinlikte “Hazırlık” başlığına uyar. “Yangın kesin çıkmaz” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "wildfire-drag-4",
      "hazard": "wildfire",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Duman görülünce"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Uzaklaşıp resmî uyarıları izle",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Merak edip yakından bak",
          "correctZone": "no"
        }
      ],
      "explanation": "“Uzaklaşıp resmî uyarıları izle” bu etkinlikte “Duman görülünce” başlığına uyar. “Merak edip yakından bak” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "landslide-tf-1",
      "hazard": "landslide",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Yamaçtaki yeni çatlakları güvenli konumdan yetişkine bildirmek uygundur.",
      "correct": true,
      "explanation": "Çatlağa yaklaşmadan güvenli gözlem noktasından yetişkine bildir; incelemeyi uzman yapar."
    },
    {
      "id": "landslide-tf-2",
      "hazard": "landslide",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Her yağmur kesinlikle heyelana neden olur.",
      "correct": false,
      "explanation": "Her yağış kesin heyelan demek değildir. Yağış, eğim ve zemin birlikte değerlendirilir; kararı uzmanlar verir."
    },
    {
      "id": "landslide-tf-3",
      "hazard": "landslide",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Çocuklar şevde tek başlarına kazı ve drenaj çalışması yapmalıdır.",
      "correct": false,
      "explanation": "Kazı ve drenaj uzmanlık işidir. Çocuklar yamaca girmez; belirtileri güvenli yerden bildirir."
    },
    {
      "id": "landslide-tf-4",
      "hazard": "landslide",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Riskli yolun zamanında kapatılması zararı azaltabilir.",
      "correct": true,
      "explanation": "Yol kapatma insanların tehlikeden uzak kalmasına yardım eder; heyelan tehlikesini ortadan kaldırmaz."
    },
    {
      "id": "landslide-match-1",
      "hazard": "landslide",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yamaçta yeni çatlak görüyorsun",
          "right": "Güvenli gözlem yerinden yetişkine bildir"
        },
        {
          "id": "p2",
          "left": "Arkadaşın çatlağa yaklaşmak istiyor",
          "right": "Yaklaşmamasını söyle ve güvenli konumda kal"
        },
        {
          "id": "p3",
          "left": "Yol için kapatma uyarısı gelmiş",
          "right": "Kapalı yola girmeden yönlendirmeyi izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yamaçta yeni çatlak görüyorsun → Güvenli gözlem yerinden yetişkine bildir · Arkadaşın çatlağa yaklaşmak istiyor → Yaklaşmamasını söyle ve güvenli konumda kal · Yol için kapatma uyarısı gelmiş → Kapalı yola girmeden yönlendirmeyi izle."
    },
    {
      "id": "landslide-match-2",
      "hazard": "landslide",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yamaçta yüzey suyu birikiyor",
          "right": "Güvenli yerden uzman drenaj incelemesi iste"
        },
        {
          "id": "p2",
          "left": "Bir çocuk yamaçta kanal kazmayı öneriyor",
          "right": "Kazıyı uzmanlara bırakmasını söyle"
        },
        {
          "id": "p3",
          "left": "İnceleme ekibi çalışma alanı kurmuş",
          "right": "Çalışma alanının dışında kal"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yamaçta yüzey suyu birikiyor → Güvenli yerden uzman drenaj incelemesi iste · Bir çocuk yamaçta kanal kazmayı öneriyor → Kazıyı uzmanlara bırakmasını söyle · İnceleme ekibi çalışma alanı kurmuş → Çalışma alanının dışında kal."
    },
    {
      "id": "landslide-match-3",
      "hazard": "landslide",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Ev dik yamaca yakın görünüyor",
          "right": "Güvenliğini uzman zemin incelemesiyle değerlendirt"
        },
        {
          "id": "p2",
          "left": "Yamaçta yeni bir yapı öneriliyor",
          "right": "Yer seçimini yetkili uzmanların değerlendirmesine bırak"
        },
        {
          "id": "p3",
          "left": "Yağışla birlikte yeni çatlak uyarısı var",
          "right": "Yapıyı kendin incelemeden güvenli yönlendirmeyi izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Ev dik yamaca yakın görünüyor → Güvenliğini uzman zemin incelemesiyle değerlendirt · Yamaçta yeni bir yapı öneriliyor → Yer seçimini yetkili uzmanların değerlendirmesine bırak · Yağışla birlikte yeni çatlak uyarısı var → Yapıyı kendin incelemeden güvenli yönlendirmeyi izle."
    },
    {
      "id": "landslide-match-4",
      "hazard": "landslide",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Yamaç yolu kapatılmış",
          "right": "Resmî alternatif güvenli rotayı izle"
        },
        {
          "id": "p2",
          "left": "Hazırlıktan sonra da uyarı sürüyor",
          "right": "Risk bitmediği için kapalı alandan uzak dur"
        },
        {
          "id": "p3",
          "left": "İki hazırlık senaryosu karşılaştırılıyor",
          "right": "Yağış ve zemin koşullarını aynı tut"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Yamaç yolu kapatılmış → Resmî alternatif güvenli rotayı izle · Hazırlıktan sonra da uyarı sürüyor → Risk bitmediği için kapalı alandan uzak dur · İki hazırlık senaryosu karşılaştırılıyor → Yağış ve zemin koşullarını aynı tut."
    },
    {
      "id": "landslide-drag-1",
      "hazard": "landslide",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Belirti"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yamaçta yeni çatlak",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Eğimde koş",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yamaçta yeni çatlak” bu etkinlikte “Belirti” başlığına uyar. “Eğimde koş” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "landslide-drag-2",
      "hazard": "landslide",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Uzman önlemi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Uzmanın zemin incelemesi",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çatlağa yaklaş",
          "correctZone": "no"
        }
      ],
      "explanation": "“Uzmanın zemin incelemesi” bu etkinlikte “Uzman önlemi” başlığına uyar. “Çatlağa yaklaş” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "landslide-drag-3",
      "hazard": "landslide",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Güvenli davranış"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Resmî yol kapanışına uy",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Şevde kazı yap",
          "correctZone": "no"
        }
      ],
      "explanation": "“Resmî yol kapanışına uy” bu etkinlikte “Güvenli davranış” başlığına uyar. “Şevde kazı yap” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "landslide-drag-4",
      "hazard": "landslide",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Hazırlık sonrası"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Uyarı ve alternatif rota",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Heyelan ihtimali kesin sıfır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Uyarı ve alternatif rota” bu etkinlikte “Hazırlık sonrası” başlığına uyar. “Heyelan ihtimali kesin sıfır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "avalanche-tf-1",
      "hazard": "avalanche",
      "type": "true_false",
      "difficulty": "easy",
      "points": 20,
      "statement": "Çığ riski nedeniyle kapatılan yola girilmemelidir.",
      "correct": true,
      "explanation": "Kapatılan yolun bariyerini aşma. Güvenli konumda kal ve resmî alternatif rotayı izle."
    },
    {
      "id": "avalanche-tf-2",
      "hazard": "avalanche",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Karın güvenliğini anlamak için dik yamaçta zıplanmalıdır.",
      "correct": false,
      "explanation": "Karın güvenliğini zıplayarak test etme; dik karlı yamaca girme. Değerlendirme uzmanların işidir."
    },
    {
      "id": "avalanche-tf-3",
      "hazard": "avalanche",
      "type": "true_false",
      "difficulty": "medium",
      "points": 20,
      "statement": "Resmî çığ uyarısı ve güvenli rota bilgisi önemlidir.",
      "correct": true,
      "explanation": "Güncel resmî uyarı ve güvenli rota bilgisi izlenir; kapalı yola girilmez."
    },
    {
      "id": "avalanche-tf-4",
      "hazard": "avalanche",
      "type": "true_false",
      "difficulty": "hard",
      "points": 20,
      "statement": "Hazırlık önlemleri tüm çığ riskini yok eder.",
      "correct": false,
      "explanation": "Hazırlıklar riski azaltmaya yardımcı olabilir; çığ tehlikesini sıfırlamaz. Resmî uyarılara uy."
    },
    {
      "id": "avalanche-match-1",
      "hazard": "avalanche",
      "type": "matching",
      "difficulty": "easy",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Karlı yol çığ riskiyle kapatılmış",
          "right": "Bariyeri aşmadan kapalı yoldan uzak dur"
        },
        {
          "id": "p2",
          "left": "Arkadaşın bariyeri geçmek istiyor",
          "right": "Geçmemesini söyle ve yetişkine bildir"
        },
        {
          "id": "p3",
          "left": "Güvenli rota duyurulmuş",
          "right": "Grubunla belirtilen rotayı izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Karlı yol çığ riskiyle kapatılmış → Bariyeri aşmadan kapalı yoldan uzak dur · Arkadaşın bariyeri geçmek istiyor → Geçmemesini söyle ve yetişkine bildir · Güvenli rota duyurulmuş → Grubunla belirtilen rotayı izle."
    },
    {
      "id": "avalanche-match-2",
      "hazard": "avalanche",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Dik kar yamacı önündesin",
          "right": "Güvenli gözlem alanında kal"
        },
        {
          "id": "p2",
          "left": "Bir çocuk karı zıplayarak test etmek istiyor",
          "right": "Test etmemesini söyle ve yetişkine bildir"
        },
        {
          "id": "p3",
          "left": "Kar güvenliği için inceleme gerekiyor",
          "right": "Değerlendirmeyi çığ uzmanlarına bırak"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Dik kar yamacı önündesin → Güvenli gözlem alanında kal · Bir çocuk karı zıplayarak test etmek istiyor → Test etmemesini söyle ve yetişkine bildir · Kar güvenliği için inceleme gerekiyor → Değerlendirmeyi çığ uzmanlarına bırak."
    },
    {
      "id": "avalanche-match-3",
      "hazard": "avalanche",
      "type": "matching",
      "difficulty": "medium",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Resmî çığ uyarısı geldi",
          "right": "Bir yetişkinle güncel güvenli rota bilgisini öğren"
        },
        {
          "id": "p2",
          "left": "Uyarıyla bir yol kapatıldı",
          "right": "Kapatılan yola girmeden yönlendirmeyi izle"
        },
        {
          "id": "p3",
          "left": "Grubun güvenli buluşma alanına ulaştı",
          "right": "Grubunla kal ve yoklama yönlendirmesini izle"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Resmî çığ uyarısı geldi → Bir yetişkinle güncel güvenli rota bilgisini öğren · Uyarıyla bir yol kapatıldı → Kapatılan yola girmeden yönlendirmeyi izle · Grubun güvenli buluşma alanına ulaştı → Grubunla kal ve yoklama yönlendirmesini izle."
    },
    {
      "id": "avalanche-match-4",
      "hazard": "avalanche",
      "type": "matching",
      "difficulty": "hard",
      "points": 20,
      "instruction": "Her durumu ona uygun güvenli davranışla eşleştir. Önce bir durum, sonra bir davranış seç.",
      "pairs": [
        {
          "id": "p1",
          "left": "Bölgenin çığ tehlikesi incelenmeli",
          "right": "Yetkili kurum ve çığ uzmanının değerlendirmesini iste"
        },
        {
          "id": "p2",
          "left": "Hazırlık sonrası da çığ uyarısı var",
          "right": "Risk sürdüğü için kapalı alana girme"
        },
        {
          "id": "p3",
          "left": "İki planın etkisi karşılaştırılıyor",
          "right": "Kar ve eğim koşullarını aynı tutup hazırlıkları değiştir"
        }
      ],
      "explanation": "Duruma uygun güvenli davranışı seç: Bölgenin çığ tehlikesi incelenmeli → Yetkili kurum ve çığ uzmanının değerlendirmesini iste · Hazırlık sonrası da çığ uyarısı var → Risk sürdüğü için kapalı alana girme · İki planın etkisi karşılaştırılıyor → Kar ve eğim koşullarını aynı tutup hazırlıkları değiştir."
    },
    {
      "id": "avalanche-drag-1",
      "hazard": "avalanche",
      "type": "drag_drop",
      "difficulty": "easy",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Güvenli davranış"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Kapalı yoldan uzak dur",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Bariyeri aş",
          "correctZone": "no"
        }
      ],
      "explanation": "“Kapalı yoldan uzak dur” bu etkinlikte “Güvenli davranış” başlığına uyar. “Bariyeri aş” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "avalanche-drag-2",
      "hazard": "avalanche",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Uzman görevi"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Çığ tehlikesi değerlendirmesi",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Çocuk karı test eder",
          "correctZone": "no"
        }
      ],
      "explanation": "“Çığ tehlikesi değerlendirmesi” bu etkinlikte “Uzman görevi” başlığına uyar. “Çocuk karı test eder” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "avalanche-drag-3",
      "hazard": "avalanche",
      "type": "drag_drop",
      "difficulty": "medium",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Hazırlık"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Alternatif güvenli rotanın duyurulması",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Risk kesin sıfır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Alternatif güvenli rotanın duyurulması” bu etkinlikte “Hazırlık” başlığına uyar. “Risk kesin sıfır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    },
    {
      "id": "avalanche-drag-4",
      "hazard": "avalanche",
      "type": "drag_drop",
      "difficulty": "hard",
      "points": 20,
      "instruction": "İki kartı da uygun başlığa yerleştir. Kartı seçip hedefe dokunabilir veya sürükleyebilirsin.",
      "zones": [
        {
          "id": "yes",
          "label": "Önce/sonra aynı"
        },
        {
          "id": "no",
          "label": "Bu başlığa uymaz"
        }
      ],
      "items": [
        {
          "id": "i1",
          "text": "Yamaç eğimi ve kar koşulları",
          "correctZone": "yes"
        },
        {
          "id": "i2",
          "text": "Uyarı erişimi hep aynıdır",
          "correctZone": "no"
        }
      ],
      "explanation": "“Yamaç eğimi ve kar koşulları” bu etkinlikte “Önce/sonra aynı” başlığına uyar. “Uyarı erişimi hep aynıdır” bu başlığa uymaz. Başlığa uymamak her zaman tehlikeli olmak demek değildir. Tehlikeli alanlara girme; müdahaleyi yetkili yetişkinlere bırak. Hazırlık riski tamamen yok etmez."
    }
  ],
  "sourceVersion": "1.0.0"
}
$bank$::jsonb then raise exception 'Immutable question bank version conflict';end if;end$$;
commit;
