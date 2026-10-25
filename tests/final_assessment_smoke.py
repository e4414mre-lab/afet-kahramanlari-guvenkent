"""Actual input acceptance. --component uses an explicitly isolated DEV scene;
without it, complete the production school/home/four-region/day3 chain first.
No writes through the read-only QA inspector, no progression bypass in production.
"""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from day3_smoke import run as day3
from home_smoke import HomePlayer
from town_hall_smoke import OUT
REGIONS=['flood','wildfire','landslide','avalanche']

def run(browser,mobile,fixture=False,board=False):
 mode='board-touch' if board else 'mobile' if mobile else 'desktop';folder=Path('/workspace/final-validation/component-images')/mode if fixture else OUT;folder.mkdir(parents=True,exist_ok=True)
 if fixture:
  p=HomePlayer(browser,mobile)
  if board:p.page.set_viewport_size({'width':1920,'height':1080})
  p.page.goto('http://127.0.0.1:5173/tests/final-fixture.html');p.stable('TownHall');p.approach('plan',remote=True);p.object('plan');p.wait('d.status.day3.open')
  p.choose('Bölge raporlarını incele')
  for i in range(4):p.tap(p.page.locator('.day3-regions button').nth(i))
  p.choose('1.000 puanla planlamaya başla');p.choose('Planı uygula');p.choose('Özete geç')
  for i in range(4):p.tap(p.page.locator('.day3-regions button').nth(i))
  p.tap(p.page.get_by_role('button',name='Farklı bölgelerin ihtiyaçları arasında denge kuruyorum.',exact=True));p.choose('Son planı onayla')
 else:p=day3(browser,mobile,keep_open=True)
 answer_viewport=p.page.viewport_size
 def state():return p.snapshot()['status']['finalAssessment']
 def choose(label):p.tap(p.page.get_by_role('button',name=label,exact=True).first)
 evidence=[]
 def capture(name):
  filename=('final-result-'+mode+'.png') if name=='result' else 'final-'+name+('-mobile' if mobile else '')+'.png'
  p.page.screenshot(path=str(folder/filename));evidence.append({'moment':name,'image':filename,'componentFixture':fixture,'scene':p.snapshot()['scene'],'viewport':p.page.viewport_size,'assessment':state()});(folder/('final-evidence-'+mode+'.json')).write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
 def input_button(locator):
  if mobile:p.tap(locator)
  else:locator.focus();p.page.keyboard.press('Enter')
 def place(source,target,drag=False):
  a=p.page.locator('[data-source="'+source+'"]');b=p.page.locator('[data-target="'+target+'"]')
  if drag:
   a.scroll_into_view_if_needed();box=a.bounding_box();p.page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);p.page.mouse.down()
   b.scroll_into_view_if_needed();box=b.bounding_box();p.page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2,steps=15);p.page.mouse.up()
  else:input_button(a);input_button(b)
 def answer(q,wrong=False,partial=False):
  if q['type']=='true_false':input_button(p.page.locator('[data-tf="'+str(not q['correct'] if wrong else q['correct']).lower()+'"]'))
  elif q['type']=='matching':
   for i,card in enumerate(q['pairs']):place(card['id'],q['pairs'][(i+1)%3]['id'] if wrong else card['id'])
  else:
   for i,card in enumerate(q['items']):
    target=next(z['id'] for z in q['zones'] if z['id']!=card['correctZone']) if wrong or partial and i==1 else card['correctZone']
    place(card['id'],target,drag=not mobile)
  choose('Yanıtımı kontrol et')
 p.choose('Çağrı ve AFİ ile final değerlendirmesi');p.wait('d.status.finalAssessment.open');capture('intro');seed_budget=p.snapshot()['status']['day3']['remainingBudget'];choose('15 etkinliğe başla')
 seed=state()['seed'];assert len(state()['questionIds'])==15;seen=set();expected=0
 position=p.snapshot()['player'];p.page.keyboard.press('ArrowRight');assert p.snapshot()['player']==position
 # Critical text survives text=false; all hints optional, capped, progress survives close/reopen.
 choose('AFİ’den ipucu 0/3');choose('AFİ’den ipucu 1/3');choose('AFİ’den ipucu 2/3');assert state()['hintLevel']==3
 choose('Belediye raporuna dön');assert not state()['open'];p.choose('Çağrı ve AFİ ile final değerlendirmesi');assert state()['seed']==seed and state()['index']==0 and state()['hintLevel']==3
 for i in range(15):
  q=state()['question'];kind=q['type'];first=kind not in seen
  if first:
   if mobile and kind!='true_false':
    target='.final-match' if kind=='matching' else '.final-drag-cards'
    p.page.locator('.final-body').evaluate('(el,selector)=>{const t=el.querySelector(selector);el.scrollTop+=t.getBoundingClientRect().top-el.getBoundingClientRect().top}',target)
   capture({'true_false':'true-false','matching':'matching','drag_drop':'drag-drop'}[kind]);seen.add(kind)
  # Wrong first activity (still allowed to finish), partial first drop, correct rest.
  wrong=i==0;partial=kind=='drag_drop' and first and not wrong
  answer(q,wrong,partial);record=state()['record'];assert record is not None
  assert record['points']==(0 if wrong else 10 if partial else 20),(q['id'],record)
  print(mode+' activity '+str(i+1)+' '+kind+' PASS',flush=True)
  expected+=record['points'];assert state()['points']==expected and state()['answered']==i+1
  if first:capture(kind+'-feedback')
  if i==0:
   choose('Puansız yeniden dene')
   # submit the correct answer through practice controls
   if q['type']=='true_false':input_button(p.page.locator('[data-tf="'+str(q['correct']).lower()+'"]'))
   elif q['type']=='matching':
    for card in q['pairs']:place(card['id'],card['id'])
   else:
    for card in q['items']:place(card['id'],card['correctZone'],drag=not mobile)
   choose('Alıştırmayı kontrol et');assert state()['points']==expected and state()['record']['practiceCorrect']==record['total']
  if i<14:choose('Sonraki etkinlik')
 assert seen=={'true_false','matching','drag_drop'};choose('Sonucumu gör');assert state()['phase']=='result' and state()['attempts']==1 and state()['last']['total']==expected<=300;capture('result')
 for i in range(5):p.page.locator('.final-hazard-results article').nth(i).scroll_into_view_if_needed()
 capture('result-details')
 assert sum(x['points'] for x in state()['last']['byType'])==expected and sum(x['points'] for x in state()['last']['byHazard'])==expected
 assert p.page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 choose('Belediye raporuna dön');assert p.snapshot()['status']['day3']['remainingBudget']==seed_budget;p.choose('Çağrı ve AFİ ile final değerlendirmesi');assert state()['attempts']==1
 first_ids=state()['questionIds'];choose('Yeni sınav dene');assert state()['seed']!=seed and state()['points']==0 and state()['answered']==0
 assert state()['questionIds']!=first_ids
 for i in range(15):answer(state()['question']);choose('Sonraki etkinlik' if i<14 else 'Sonucumu gör')
 assert state()['attempts']==2 and state()['first']['total']==expected and state()['last']['total']==300 and state()['best']['total']==300
 choose('Belediye raporuna dön');assert p.snapshot()['status']['day3']['remainingBudget']==seed_budget
 # Final settings and touch readability in the same real session, preserving results.
 p.choose('Çağrı ve AFİ ile final değerlendirmesi')
 profiles=[]
 if mobile:
  for name,w,h,font in [('phone',390,844,15),('tablet',768,1024,15),('board',1920,1080,20)]:
   p.page.set_viewport_size({'width':w,'height':h});body=p.page.locator('.final-body');body.evaluate('el=>el.scrollTop=0');assert float(body.evaluate('el=>getComputedStyle(el).fontSize').replace('px',''))>=font
   box=body.bounding_box();x=box['x']+box['width']*.5;y=box['y']+box['height']*.85
   p.cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
   for j in range(1,9):p.cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-box['height']*.6*j/8}]});p.page.wait_for_timeout(35)
   p.cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});p.page.wait_for_timeout(250);assert body.evaluate('el=>el.scrollTop')>20
   assert state()['last']['total']==300 and p.page.evaluate('document.documentElement.scrollWidth<=innerWidth+1');profiles.append({'name':name,'viewport':p.page.viewport_size,'nativeTouchScroll':'PASS','verifiedMinimumBodyFontPx':font})
  p.page.set_viewport_size({'width':390,'height':844})
 if not fixture:
  p.tap(p.page.locator('.final-header').get_by_role('button',name='Ayarlar',exact=True));checks=p.page.get_by_role('checkbox');assert checks.count()==6
  for i in range(5):assert not checks.nth(i).is_checked()
  assert checks.nth(5).is_checked();choose('← Oyuna dön');assert state()['last']['total']==300
 choose('Belediye raporuna dön');p.check()
 print(json.dumps({'mode':mode,'result':'PASS','componentFixture':fixture,'answerViewport':answer_viewport,'firstScore':expected,'lastScore':300,'bestScore':300,'attempts':2,'seed':seed,'keyboard':not mobile,'pointerDrag':not mobile,'tapPlacement':mobile,'nativeTouchProfiles':profiles,'budgetUnchanged':seed_budget,'scene':'TownHall'},ensure_ascii=False),flush=True);p.close()
if __name__=='__main__':
 # Final requires all four regions. Existing region runners share this CLI flag.
 if '--component' not in sys.argv and '--chain' not in sys.argv:sys.argv.append('--chain')
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
  for mobile in ([True] if '--mobile' in sys.argv or '--board' in sys.argv else [False] if '--desktop' in sys.argv else [False,True]):run(browser,mobile,'--component' in sys.argv,'--board' in sys.argv)
  browser.close()
