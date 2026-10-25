"""DEV fixture network fault only: no production hooks or progression bypass."""
from playwright.sync_api import sync_playwright
from home_smoke import HomePlayer
from final_assessment_smoke import correct_value
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 p=HomePlayer(browser,False)
 def choose(label):
  p.tap(p.page.get_by_role('button',name=label,exact=True).first)
  p.wait('!d.status.finalAssessment.busy')
 p.choose=choose
 def inject(route):
  response=route.fetch();body=response.text();needle='const q = s.question;';assert needle in body
  body=body.replace(needle,needle+' if (new URLSearchParams(location.search).get("renderFault")==="1") throw new Error("Fixture intentional render failure");',1);route.fulfill(response=response,body=body)
 p.page.route('**/src/components/FinalAssessmentPanel.tsx*',inject)
 p.page.goto('http://127.0.0.1:5173/tests/final-fixture.html');p.stable('TownHall');p.approach('plan',remote=True);p.object('plan');p.wait('d.status.day3.open')
 p.choose('Bölge raporlarını incele')
 for i in range(4):p.tap(p.page.locator('.day3-regions button').nth(i))
 p.choose('1.000 puanla planlamaya başla');p.choose('Planı uygula');p.choose('Özete geç')
 for i in range(4):p.tap(p.page.locator('.day3-regions button').nth(i))
 p.choose('Farklı bölgelerin ihtiyaçları arasında denge kuruyorum.');p.choose('Son planı onayla');p.choose('Çağrı ve AFİ ile final değerlendirmesi');p.choose('15 etkinliğe başla')
 before=p.snapshot()['status']['finalAssessment'];seed=before['seed'];ids=before['questionIds']
 # Save one answer before deliberately making the view fail.
 q=before['question']
 if q['type']=='true_false':p.tap(p.page.locator('[data-tf="'+str(correct_value(q)).lower()+'"]'))
 elif q['type']=='matching':
  for pair in q['pairs']:p.tap(p.page.locator('[data-source="'+pair['id']+'"]'));p.tap(p.page.locator('[data-target="'+correct_value(q,pair)+'"]'))
 else:
  for item in q['items']:p.tap(p.page.locator('[data-source="'+item['id']+'"]'));p.tap(p.page.locator('[data-target="'+correct_value(q,item)+'"]'))
 p.choose('Yanıtımı kontrol et');assert p.snapshot()['status']['finalAssessment']['points']==20
 p.page.evaluate("history.replaceState({},'',location.pathname+'?renderFault=1')")
 p.choose('Sonraki etkinlik');p.page.get_by_role('alert').get_by_text('Etkinlik görünümü açılamadı').wait_for()
 p.choose('Belediye raporuna dön');assert not p.snapshot()['status']['finalAssessment']['open']
 p.choose('Çağrı ve AFİ ile final değerlendirmesi');p.page.get_by_role('alert').wait_for();p.page.evaluate("history.replaceState({},'',location.pathname)");p.choose('Görünümü yeniden aç')
 after=p.snapshot()['status']['finalAssessment'];assert after['seed']==seed and after['questionIds']==ids and after['points']==20 and after['answered']==1 and after['index']==1 and after['attempts']==0
 print('PASS: intentional view failure, safe return, same seed/question order/answer/20 points retained, no finalized duplicate')
 p.close();browser.close()
