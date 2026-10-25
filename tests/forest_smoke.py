"""Real scene input acceptance. Default plays first day and flood before forest.
--component is an isolated dev fixture; it does not claim gate/regression coverage.
"""
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from flood_smoke import run as flood_day
from home_smoke import HomePlayer, complete_school, HOME
from town_hall_smoke import OUT
RISKS=['forestEmbers','forestBrush','forestSign']
MEASURES=['Erken uyarı ve güvenli uzaklaşma güzergâhı','Yetkili ekiplerle uygun bakım ve yanıcı yük yönetimi','Gözetleme, erken bildirim ve ziyaretçi eğitimi']
def first_day_direct(browser,mobile):
 """Shortest real-input first-day route; proves forest may precede flood."""
 p=HomePlayer(browser,mobile);p.setup();complete_school(p)
 p.navigate('classroomExit');p.interaction('Enter');p.stable('CitySquare')
 p.axis('y',820);p.axis('x',760);p.axis('y',850);p.interaction('Enter');p.stable('Home');p.choose('Evi incelemeye başla')
 for identifier in HOME:
  p.home_open(identifier);p.tap(p.page.locator('.home-panel .inspection-choices button').first)
  if identifier not in ['homeTable','homeBag']:p.choose('Yetişkin çözümünü gör')
  p.home_close()
 p.home_open('homeTable');p.choose('Planlı tatbikatı başlat');p.choose('Çök–Kapan–Tutun; baş ve boynu koru, sarsıntı bitene kadar kal.');p.wait('d.status.home.phase === "afterShaking"')
 p.choose('Yetişkin yönlendirmesiyle açık çıkıştan buluşma alanına git.');p.home_walk('homeExit');p.interaction('Enter');p.stable('GatheringPoint');p.home_walk('gatherHere');p.interaction('Enter');p.wait('d.status.home.phase === "completed"')
 assert p.snapshot()['status']['forestUnlocked'] and p.snapshot()['status']['flood']['completionCount']==0
 p.choose('Meydana dön');p.stable('CitySquare')
 if mobile:
  p.tap(p.page.get_by_role('button',name='Ayarlar',exact=True));p.tap(p.page.get_by_role('button',name='Sessiz mod',exact=True));p.tap(p.page.get_by_text('♿ Azaltılmış hareket',exact=True));p.tap(p.page.get_by_text('💬 Konuşma balonları',exact=True));p.choose('← Oyuna dön')
 return p
def run(browser,mobile,fixture=False,keep_open=False):
 mode='mobile' if mobile else 'desktop'
 out=Path('/tmp/guvenkent-forest-component') if fixture else OUT;out.mkdir(parents=True,exist_ok=True)
 if fixture:
  p=HomePlayer(browser,mobile);p.page.goto('http://127.0.0.1:5173/tests/forest-fixture.html');p.page.wait_for_function('window.__guvenkent && window.__guvenkent().player');p.stable('CamlikForest')
 elif '--direct' in sys.argv:p=first_day_direct(browser,mobile)
 else:
  p=flood_day(browser,mobile,keep_open=True);assert p.snapshot()['status']['forestUnlocked'];p.choose('Meydana dön');p.stable('CitySquare')
 def choice(label):p.tap(p.page.get_by_role('button',name=label,exact=True))
 def state():return p.snapshot()['status']['forest']
 evidence=[]
 def capture(name):
  if "feedback" in name:p.page.locator(".forest-panel .inspection-feedback").scroll_into_view_if_needed()
  filename=f'camlik-overview-{mode}.png' if name=='overview' else 'camlik-'+name+('-mobile' if mobile else '')+'.png'
  p.page.screenshot(path=str(out/filename))
  d=p.snapshot();evidence.append({'moment':name,'image':filename,'componentFixture':fixture,'viewport':p.page.viewport_size,'scene':d['scene'],'player':d['player'],'robot':d['robot'],'forest':d['status']['forest'],'smokeVisual':d['smokeVisual'],'managedFuelArt':d['managedFuelArt'],'expertCount':d['expertCount']})
  (out/f'camlik-evidence-{mode}.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
 def enter():
  choice('İkinci gün bölgelerini aç')
  assert p.page.get_by_role('button',name='Karlıtepe · Çığ farkındalığı',exact=True).is_enabled()
  assert p.page.get_by_role('button',name='Dere Mahallesi · Sel ve taşkın',exact=True).is_enabled()
  choice('Çamlık · Orman yangını farkındalığı');p.stable('CamlikForest');p.page.evaluate('window.scrollTo(0,0)')
 if not fixture:enter()
 def walk(identifier):
  h=p.hotspot(identifier);p.axis('x',900);p.axis('y',h['y']);p.axis('x',h['x']);p.page.wait_for_timeout(650)
 def inspect(identifier):
  walk(identifier)
  for _ in range(8):
   if p.snapshot()['status']['nearby']==p.hotspot(identifier)['name']:break
   p.page.keyboard.press('q');p.page.wait_for_timeout(100)
  if not mobile and identifier=='forestSign':p.interaction('Enter')
  else:
   h=p.hotspot(identifier);b=p.page.locator('canvas').bounding_box();z=p.snapshot()['zoom'];target=None
   for dx in [0,-.2,.2,-.4,.4]:
    x=b['x']+h['screen']['x']+h['hit']['width']*dx*z;y=b['y']+h['screen']['y']
    if 0<x<p.page.viewport_size['width'] and 0<y<p.page.viewport_size['height'] and p.page.evaluate("p=>document.elementFromPoint(p.x,p.y)?.tagName==='CANVAS'",{'x':x,'y':y}):target=(x,y);break
   assert target,(identifier,h,b)
   p.page.touchscreen.tap(*target) if mobile else p.page.mouse.click(*target)
  p.page.get_by_role('dialog').wait_for()
 def close_guide():
  p.dialogue()
  if fixture or mobile:choice('Tamam')
  else:
   p.page.wait_for_function("document.activeElement?.closest('.story-dialogue')");p.page.keyboard.press('Enter')
  p.wait('d.status.dialogue===null')
 def ground(x,y):
  d=p.snapshot();h=d['hotspots'][0];b=p.page.locator('canvas').bounding_box();z=d['zoom'];point=(b['x']+h['screen']['x']+(x-h['hit']['x'])*z,b['y']+h['screen']['y']+(y-h['hit']['y'])*z)
  assert p.page.evaluate("p=>document.elementFromPoint(p.x,p.y)?.tagName==='CANVAS'",{'x':point[0],'y':point[1]})
  p.page.touchscreen.tap(*point) if mobile else p.page.mouse.click(*point)
 p.axis('y',570);p.page.wait_for_timeout(500);capture('overview')
 position=p.snapshot()['player'];ground(980,570);p.wait('d.player.x>arg',position['x']+30)
 p.page.wait_for_timeout(600)
 inspect('elif');p.page.get_by_text('Ben orman görevlisi Elif.',exact=False).wait_for();capture('elif-dialogue');choice('Güvenli seyir yolundan araştır');close_guide()
 assert state()['phase']=='inspectRisks'
 # Three optional AFI hints remain keyboard/touch accessible after the guided first clue.
 for _ in range(3):
  choice('AFİ’den ipucu al');close_guide()
 assert state()['hintLevel']==3
 # Holding toward the ridge hits the protected boundary.
 p.axis('x',900);p.axis('y',830)
 if mobile:
  b=p.page.get_by_role('button',name='Sağa',exact=True).bounding_box();p.cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':b['x']+b['width']/2,'y':b['y']+b['height']/2}]})
 else:p.page.keyboard.down('ArrowRight')
 p.page.wait_for_timeout(1900)
 if mobile:p.cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 else:p.page.keyboard.up('ArrowRight')
 assert p.snapshot()['player']['x']<=1120
 p.page.wait_for_timeout(500);position=p.snapshot()['player'];ground(1180,830);close_guide();assert p.snapshot()['player']==position
 for identifier in RISKS:
  inspect(identifier);assert state()['risks'][identifier]=='identified';position=p.snapshot()['player']
  if identifier==RISKS[0]:capture('risk-review')
  p.tap(p.page.locator('.forest-panel .inspection-choices button').nth(1));p.wait('d.status.forest.retry')
  assert state()['risks'][identifier]=='identified' and state()['feedback'] and p.snapshot()['player']==position
  if identifier==RISKS[0]:capture('risk-feedback-wrong')
  p.tap(p.page.locator('.forest-panel .inspection-choices button').first);p.wait('d.status.forest.risks[arg] === "decisionMade"',identifier)
  assert not state()['retry'] and state()['feedback'] and p.snapshot()['player']==position
  if identifier==RISKS[0]:capture('risk-feedback-correct')
  choice('Gerekçeyi not et');print(mode+' '+identifier+' feedback + safe position PASS',flush=True)
 assert state()['investigated']==3 and state()['phase']=='smokeDecision'
 p.page.wait_for_timeout(350);capture('smoke-decision');position=p.snapshot()['player']
 for label in ['Dumanı yakından incelemeye giderim.','Alevleri söndürmek için ormana girerim.']:
  choice(label);p.wait('d.status.forest.retry');assert not state()['smokeSolved'] and p.snapshot()['player']==position
  assert 'her duman kesin yangın demek değildir' in state()['feedback']
 capture('smoke-feedback')
 choice('Güvenli uzaklaşma yönlendirmesine uy; yetişkine, gerekirse 112’ye konumu bildir.');p.wait('d.status.forest.smokeSolved');choice('Güvenli kararı not et')
 inspect('forestPreparedness')
 for label in MEASURES:choice(label)
 choice('Aynı havayı karşılaştır');p.wait('d.status.forest.phase === "beforeSimulation"');weather=state()['scenario']
 assert weather['durationSeconds']==40
 p.page.wait_for_function('window.__guvenkent().status.forest.elapsed>=8',timeout=30000);capture('before');assert not p.snapshot()['forestFrame']['visitorsDirected'] and p.snapshot()['expertCount']==0 and not p.snapshot()['managedFuelArt'] and p.snapshot()['smokeVisible']
 if not p.snapshot()['forestSmokeAnimated']:
  visual=p.snapshot()['smokeVisual'];p.page.wait_for_timeout(350);assert p.snapshot()['smokeVisual']==visual
 if not fixture:
  choice('Ayarlar');elapsed=p.snapshot()['forestFrame']['elapsed'];p.page.wait_for_timeout(400);assert p.snapshot()['forestFrame']['elapsed']==elapsed;choice('← Oyuna dön')
 # No direction key or held touch may move the child during either locked run.
 position=p.snapshot()['player'];p.page.keyboard.press('ArrowRight');assert p.snapshot()['player']==position
 choice('Geç / özeti göster');choice('Aynı havayı hazırlıkla izle');p.wait('d.status.forest.phase === "afterSimulation"');assert state()['scenario']==weather
 p.page.wait_for_function('window.__guvenkent().status.forest.elapsed>=8',timeout=30000);capture('after');assert p.snapshot()['forestFrame']['visitorsDirected'] and p.snapshot()['expertCount']==2 and p.snapshot()['managedFuelArt'] and p.snapshot()['smokeVisible']
 assert p.snapshot()['player']==position and p.snapshot()['forestFrame']['residualRisk']
 choice('Geç / özeti göster');choice('Karşılaştırmayı aç');capture('comparison');p.check();choice('Kısa raporu al');p.wait('d.status.forest.completionCount===1')
 choice('Karşılaştırmayı yeniden dene');choice('Aynı havayı karşılaştır');choice('Geç / özeti göster');choice('Aynı havayı hazırlıkla izle');choice('Geç / özeti göster');choice('Karşılaştırmayı aç');choice('Kısa raporu al');assert state()['completionCount']==1
 fields=('objects','blurListeners','pointerListeners','keyboardListeners','textureCount');baseline={k:p.snapshot()[k] for k in fields}
 for _ in range(0 if fixture else 5):
  choice('Meydana dön');p.stable('CitySquare');enter();assert {k:p.snapshot()[k] for k in fields}==baseline
  assert state()['completionCount']==1 and state()['investigated']==3;p.check()
 print(json.dumps({'mode':mode,'result':'PASS','componentFixture':fixture,'forestBeforeFlood':'--direct' in sys.argv,'investigated':3,'smokeSolved':state()['smokeSolved'],'sameWeather':weather,'completionCount':1,'reentryCycles':0 if fixture else 5,'stableCounts':baseline},ensure_ascii=False),flush=True)
 if keep_open:return p
 p.close()
def main():
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
  modes=[True] if '--mobile' in sys.argv else [False] if '--desktop' in sys.argv else [False,True]
  for mobile in modes:run(b,mobile,'--component' in sys.argv)
  b.close()
if __name__=='__main__':main()
