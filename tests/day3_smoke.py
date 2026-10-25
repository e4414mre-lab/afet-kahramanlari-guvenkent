"""Full game -> four completed disaster regions -> day-three planning. --component is isolated dev coverage only."""
import sys,json,os
from pathlib import Path
from playwright.sync_api import sync_playwright
from avalanche_smoke import run as four_regions
from home_smoke import HomePlayer
from town_hall_smoke import OUT
REGIONS=['flood','wildfire','landslide','avalanche']
REASONS=['Önce uyarı ve güvenli ulaşımı güçlendirmek istiyorum.','Uzman değerlendirmesi ve bakıma öncelik veriyorum.','Farklı bölgelerin ihtiyaçları arasında denge kuruyorum.']
def run(browser,mobile,fixture=False,profile=None,keep_open=False):
 mode=profile or ('mobile' if mobile else 'desktop');folder=Path('/workspace/day3-quality/profile-images')/mode if fixture else OUT;folder.mkdir(parents=True,exist_ok=True)
 if fixture:
  p=HomePlayer(browser,mobile)
  if profile:p.page.set_viewport_size({'width':1920 if profile=='board-touch' else 1024 if profile=='tablet-landscape' else 768,'height':1080 if profile=='board-touch' else 768 if profile=='tablet-landscape' else 1024})
  p.page.goto('http://127.0.0.1:5173/tests/day3-fixture.html');p.wait('d.scene === "TownHall" && !!d.player');p.stable('TownHall')
 else:
  p=four_regions(browser,mobile,keep_open=True);p.choose('Meydana dön');p.stable('CitySquare');assert p.snapshot()['status']['day3Unlocked']
  p.choose('Üçüncü gün · Belediye planlamasına git');p.stable('TownHall')
 def state():return p.snapshot()['status']['day3']
 def choose(label):p.tap(p.page.get_by_role('button',name=label,exact=True))
 def swipe_reading_body():
  body=p.page.locator('.day3-body');body.evaluate('el=>el.scrollTop=0');p.page.wait_for_timeout(100)
  metrics=body.evaluate('el=>({height:el.clientHeight,total:el.scrollHeight,top:el.scrollTop})')
  if metrics['total']<=metrics['height']+35:return {'needed':False,'verified':True}
  box=body.bounding_box();x=box['x']+box['width']*.52;start=box['y']+box['height']*.8;end=box['y']+box['height']*.2
  player=p.snapshot()['player']
  p.cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':start}]})
  for i in range(1,9):p.cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':start+(end-start)*i/8}]});p.page.wait_for_timeout(35)
  p.cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});p.page.wait_for_timeout(300)
  delta=body.evaluate('el=>el.scrollTop')-metrics['top'];assert delta>20,('Native reading swipe failed',delta,metrics)
  assert p.snapshot()['player']==player
  return {'needed':True,'verified':True,'scrollDelta':delta}

 evidence=[]
 def capture(name):
  filename=f'day3-budget-{mode}.png' if name=='budget' else f'day3-{name}'+('-mobile' if mobile else '')+'.png'
  p.page.screenshot(path=str(folder/filename));snap=p.snapshot();evidence.append({'moment':name,'image':filename,'componentFixture':fixture,'scene':snap['scene'],'viewport':p.page.viewport_size,'player':snap['player'],'day3':snap['status']['day3']});(folder/f'day3-evidence-{mode}.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
 def region(id):p.tap(p.page.locator('.day3-regions button').nth(REGIONS.index(id)))
 def pick(id,keyboard=False):
  region({'F':'flood','W':'wildfire','L':'landslide','A':'avalanche'}[id[0]])
  button=p.page.get_by_role('button',name='Seç '+id,exact=True)
  before=state()['remainingBudget']
  if keyboard and not mobile:button.focus();p.page.keyboard.press('Enter')
  else:p.tap(button)
  p.wait('d.status.day3.pending===arg',id);assert state()['remainingBudget']==before
  reason=p.page.get_by_role('button',name=REASONS[0],exact=True)
  if keyboard and not mobile:reason.focus();p.page.keyboard.press('Enter')
  else:p.tap(reason)
  p.wait('d.status.day3.pending===null');assert id in state()['selectedIds']
 def remove(id):
  region({'F':'flood','W':'wildfire','L':'landslide','A':'avalanche'}[id[0]]);choose('Geri al '+id);assert id not in state()['selectedIds']
 def compare():
  choose('Planı uygula');p.wait('d.status.day3.step==="simulating"');p.wait('d.status.day3.elapsed>=1')
  location=p.snapshot()['player'];p.page.keyboard.press('ArrowRight');assert p.snapshot()['player']==location
  if not fixture and state()['planRevision']==1:
   choose('Planlama ayarları');elapsed=state()['elapsed'];p.page.wait_for_timeout(400);assert state()['elapsed']==elapsed
   checks=p.page.get_by_role('checkbox');assert checks.count()==6
   for i in range(5):checks.nth(i).set_checked(False)
   checks.nth(5).set_checked(True);choose('← Oyuna dön');p.page.locator('.day3-footer').get_by_text('Planlama puanları',exact=False).wait_for()
  choose('Özete geç');p.wait('d.status.day3.step==="comparing"')
  for id in REGIONS:
   region(id);o=next(o for o in state()['outcomes'] if o['region']==id)
   assert o['before']['baselineScenario']==o['after']['baselineScenario'];assert 'Risk sürer' in o['residualRisk']
  assert len(state()['viewed'])==4
  region('flood');assert p.snapshot()['player']==location
 p.approach('plan',remote=True);capture('town-hall');p.object('plan');p.wait('d.status.day3.open');choose('Bölge raporlarını incele')
 for id in REGIONS:region(id)
 assert state()['consulted']==REGIONS
 choose('1.000 puanla planlamaya başla');region('flood');assert state()['remainingBudget']==1000
 assert p.page.locator('.day3-afi').is_visible() and 'Son karar senin' in p.page.locator('.day3-afi').inner_text()
 if profile:
  font=float(p.page.locator('.day3-measure p').first.evaluate('el=>getComputedStyle(el).fontSize').replace('px',''));assert font>=(18 if profile=='board-touch' else 15)
 capture('budget')
 locked=p.snapshot()['player'];p.page.keyboard.press('ArrowLeft');assert p.snapshot()['player']==locked
 pick('F1',keyboard=True);assert state()['remainingBudget']==870;capture('measure-selected')
 for id in ['F2','F3','W1','W2','W3','A1','A3']:pick(id)
 assert state()['remainingBudget']==0 and len(state()['selectedIds'])==8
 assert sum(a['spent'] for a in state()['allocations'])==state()['spentBudget']==1000
 assert len(p.page.locator('.day3-nav-allocation').all())==4
 for i,a in enumerate(state()['allocations']):assert str(a['spent'])+' puan' in p.page.locator('.day3-regions button').nth(i).inner_text()
 region('landslide');choose('Seç L2');assert state()['remainingBudget']==0 and state()['pending'] is None and len(state()['selectedIds'])==8
 assert state()['budgetError']=={'measureId':'L2','cost':160,'remaining':0,'missing':160}
 assert '160 puan eksik' in state()['feedback'] and 'geri al' in state()['feedback'];assert state()['studentScore'] is None
 alert=p.page.locator('[data-budget-error]');alert.wait_for();box=alert.bounding_box();assert box['y']>=0 and box['y']+box['height']<=p.page.viewport_size['height']+1
 capture('insufficient-budget')
 compare();capture('before-after')
 summary=p.page.locator('.day3-overview summary');p.tap(summary);assert p.page.locator('.day3-regional-grid article').count()==4;capture('regional-comparison')
 if mobile and not profile:
  for i,id in enumerate(REGIONS):p.page.locator('.day3-regional-grid article').nth(i).scroll_into_view_if_needed();capture('regional-comparison-'+id)
 p.tap(summary)
 region('landslide');assert next(o for o in state()['outcomes'] if o['region']=='landslide')['selectedIds']==[]
 assert 'Yamaç Mahallesi' in p.page.locator('.day3-afi').inner_text() and 'Son karar senin' in p.page.locator('.day3-afi').inner_text();capture('unfunded-region')
 choose('Planı düzenle');remove('W2');assert state()['remainingBudget']==150;pick('L1');assert state()['remainingBudget']==0;capture('replanning');compare();assert state()['planRevision']==2
 choose('Planı düzenle');remove('F2');assert state()['remainingBudget']==150;pick('L3');assert state()['remainingBudget']==50;compare();assert state()['planRevision']==3
 assert state()['history'][0]['remainingBudget']==0 and state()['history'][2]['remainingBudget']==50
 p.tap(p.page.get_by_role('button',name=REASONS[2],exact=True));choose('Son planı onayla');assert state()['step']=='finalized' and state()['completionCount']==1;capture('final-report')
 assert len(state()['outcomes'])==4 and len(state()['selectedIds'])==8 and state()['remainingBudget']==50
 assert state()['spentBudget']==950 and sum(a['spent'] for a in state()['allocations'])==950
 assert p.page.locator('.day3-allocation li').count()==4 and '950' in p.page.locator('.day3-allocation').inner_text()
 assert p.page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 for i,id in enumerate(REGIONS):
  p.page.locator('.day3-final-grid article').nth(i).scroll_into_view_if_needed();capture('final-report-'+id)
 touch_scroll=swipe_reading_body() if mobile else {'needed':False,'verified':True}
 previous={key:p.snapshot()['status'][key]['completionCount'] for key in ['home','flood','forest','landslide','avalanche']}
 fields=['objects','blurListeners','pointerListeners','keyboardListeners','textureCount'];counts={k:p.snapshot()[k] for k in fields}
 for _ in range(0 if fixture else 5):
  choose('Belediye odasına dön');p.wait('!d.status.day3.open');p.approach('exit');p.interaction('Enter')
  if fixture:
   # The isolated fixture only registers the room, so do not claim city reentry.
   break
  p.stable('CitySquare');choose('Üçüncü gün · Belediye planlamasına git');p.stable('TownHall');p.approach('plan',remote=True);p.object('plan');p.wait('d.status.day3.open')
  assert state()['completionCount']==1 and state()['planRevision']==3 and state()['remainingBudget']==50
  assert {k:p.snapshot()[k] for k in fields}==counts
  assert {key:p.snapshot()['status'][key]['completionCount'] for key in previous}==previous
  p.check()
 display_profiles=[]
 if mobile and not fixture:
  original_viewport=p.page.viewport_size
  for name,w,h,minimum in [('tablet-portrait',768,1024,15),('tablet-landscape',1024,768,15),('board-touch',1920,1080,18)]:
   p.page.set_viewport_size({'width':w,'height':h});p.stable('TownHall')
   panel=p.page.locator('.day3-body');panel.evaluate('el=>el.scrollTop=0')
   font=float(p.page.locator('.day3-final-grid p').first.evaluate('el=>getComputedStyle(el).fontSize').replace('px',''));assert font>=minimum
   assert p.page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
   summary=p.page.locator('.day3-body details summary').last;p.tap(summary);assert p.page.locator('.day3-body details').last.get_attribute('open') is not None;p.tap(summary)
   profile_swipe=swipe_reading_body();panel.evaluate('el=>el.scrollTop=0');assert state()['planRevision']==3 and state()['spentBudget']==950 and state()['remainingBudget']==50
   filename='day3-'+name+'-final-report.png';p.page.screenshot(path=str(folder/filename));(folder/('day3-'+name+'-readability.json')).write_text(json.dumps({'profile':name,'viewport':p.page.viewport_size,'touch':True,'bodyFontPx':font,'nativeScroll':profile_swipe,'result':'PASS','image':filename},ensure_ascii=False,indent=2)+'\n')
   display_profiles.append({'profile':name,'viewport':p.page.viewport_size,'touch':True,'bodyFontPx':font,'nativeScroll':profile_swipe,'result':'PASS','image':filename})
  p.page.set_viewport_size(original_viewport);p.stable('TownHall')
 print(json.dumps({'mode':mode,'viewport':p.page.viewport_size,'touch':mobile,'nativeScroll':touch_scroll,'displayProfiles':display_profiles,'result':'PASS','componentFixture':fixture,'revisions':3,'replanningCycles':2,'remainingBudget':50,'selectedMeasures':8,'regionalReports':4,'reentryCycles':0 if fixture else 5,'previousCompletionCounts':previous,'stableCounts':counts},ensure_ascii=False),flush=True)
 if keep_open:return p
 p.close()
def main():
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
  modes=[True] if '--mobile' in sys.argv else [False] if '--desktop' in sys.argv else [False,True]
  profile=next((name for name in ['board-touch','tablet-landscape','tablet-portrait'] if '--'+name in sys.argv),None)
  if profile:run(browser,True,True,profile)
  else:
   for mobile in modes:run(browser,mobile,'--component' in sys.argv)
  browser.close()
if __name__=='__main__':main()
