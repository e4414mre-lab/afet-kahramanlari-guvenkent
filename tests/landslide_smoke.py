"""Real UI acceptance: default first day -> Yamaç; --chain also plays flood+forest.
--component is a development-only scene test, not a first-day gate test.
"""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from forest_smoke import run as forest_day, first_day_direct
from home_smoke import HomePlayer
from town_hall_smoke import OUT
RISKS=['slopeCrack','slopeHouse','slopeDrain']
MEASURES=['Zemin / şev incelemesi ve uzman arazi kullanım kararı','Yetkili ekiplerle drenaj, istinat ve şev güvenliği planı','Erken uyarı, yol kısıtlaması ve güvenli buluşma güzergâhı']
def run(browser,mobile,fixture=False,keep_open=False):
 mode='mobile' if mobile else 'desktop';out=Path('/tmp/guvenkent-yamac-component') if fixture else OUT;out.mkdir(parents=True,exist_ok=True)
 if fixture:
  p=HomePlayer(browser,mobile);p.page.goto('http://127.0.0.1:5173/tests/landslide-fixture.html');p.page.wait_for_function('window.__guvenkent && window.__guvenkent().player');p.stable('Landslide')
 elif '--chain' in sys.argv:
  p=forest_day(browser,mobile,keep_open=True);p.choose('Meydana dön');p.stable('CitySquare')
 else:
  p=first_day_direct(browser,mobile)
  assert p.snapshot()['status']['flood']['completionCount']==p.snapshot()['status']['forest']['completionCount']==0
 def choice(label):p.tap(p.page.get_by_role('button',name=label,exact=True))
 def state():return p.snapshot()['status']['landslide']
 evidence=[]
 def capture(name):
  if 'feedback' in name:p.page.locator('.landslide-panel .inspection-feedback').scroll_into_view_if_needed()
  filename=f'yamac-overview-{mode}.png' if name=='overview' else 'yamac-'+name+('-mobile' if mobile else '')+'.png'
  p.page.screenshot(path=str(out/filename));d=p.snapshot()
  evidence.append({'moment':name,'image':filename,'componentFixture':fixture,'viewport':p.page.viewport_size,'scene':d['scene'],'player':d['player'],'robot':d['robot'],'landslide':d['status']['landslide'],'frame':d['landslideFrame'],'earthVisual':d['earthVisual'],'residents':d['residents']})
  (out/f'yamac-evidence-{mode}.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')
 def enter():
  choice('İkinci gün bölgelerini aç');assert p.page.get_by_role('button',name='Karlıtepe · Çığ farkındalığı',exact=True).is_enabled()
  for label in ['Dere Mahallesi · Sel ve taşkın','Çamlık · Orman yangını farkındalığı']:assert p.page.get_by_role('button',name=label,exact=True).is_enabled()
  choice('Yamaç · Heyelan farkındalığı');p.stable('Landslide');p.page.evaluate('window.scrollTo(0,0)')
 if not fixture:
  enter()
  control=p.page.get_by_label('Yamaç okuma sesi düzeyi');was_disabled=control.is_disabled()
  if not mobile:
   if was_disabled:choice('Ayarlar');p.tap(p.page.get_by_text('🔊 Seslendirme',exact=True));choice('← Oyuna dön')
   position=p.snapshot()['player'];control.select_option('0.25');p.wait('d.status.landslide.voiceVolume===0.25');control.select_option('0.5');p.wait('d.status.landslide.voiceVolume===0.5');assert p.snapshot()['player']==position
   if was_disabled:choice('Ayarlar');p.tap(p.page.get_by_text('🔊 Seslendirme',exact=True));choice('← Oyuna dön')
  assert control.is_disabled()==was_disabled;p.page.evaluate('window.scrollTo(0,0)');p.page.locator('.city-canvas').focus()
 def walk(identifier):
  h=p.hotspot(identifier);p.axis('x',900);p.axis('y',h['y']);p.axis('x',h['x']);p.page.wait_for_timeout(650)
 def inspect(identifier,remote=False):
  if not remote:walk(identifier)
  for _ in range(8):
   if p.snapshot()['status']['nearby']==p.hotspot(identifier)['name']:break
   p.page.keyboard.press('q');p.page.wait_for_timeout(100)
  if (not mobile and identifier=='slopeDrain') or (mobile and identifier=='slopeCrack'):p.interaction('Enter')
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
  else:p.page.wait_for_function("document.activeElement?.closest('.story-dialogue')");p.page.keyboard.press('Enter')
  p.wait('d.status.dialogue===null')
 def ground(x,y):
  d=p.snapshot();h=d['hotspots'][0];b=p.page.locator('canvas').bounding_box();z=d['zoom'];point=(b['x']+h['screen']['x']+(x-h['hit']['x'])*z,b['y']+h['screen']['y']+(y-h['hit']['y'])*z)
  assert p.page.evaluate("p=>document.elementFromPoint(p.x,p.y)?.tagName==='CANVAS'",{'x':point[0],'y':point[1]})
  p.page.touchscreen.tap(*point) if mobile else p.page.mouse.click(*point)
 p.axis('y',620);p.page.wait_for_timeout(500);capture('overview')
 start=p.snapshot()['player'];ground(980,620);p.wait('d.player.x>arg',start['x']+30);p.page.wait_for_timeout(500)
 inspect('murat');p.page.get_by_text('jeoloji mühendisi Murat.',exact=False).wait_for();capture('murat-dialogue');choice('Güvenli platformdan araştır');close_guide()
 for _ in range(3):choice('AFİ’den ipucu al');close_guide()
 assert state()['hintLevel']==3
 p.axis('x',900);p.axis('y',830)
 if mobile:
  b=p.page.get_by_role('button',name='Sağa',exact=True).bounding_box();p.cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':b['x']+b['width']/2,'y':b['y']+b['height']/2}]})
 else:p.page.keyboard.down('ArrowRight')
 p.page.wait_for_timeout(1900)
 if mobile:p.cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 else:p.page.keyboard.up('ArrowRight')
 assert p.snapshot()['player']['x']<1100
 p.page.wait_for_timeout(500);position=p.snapshot()['player'];ground(1310,830);close_guide();assert p.snapshot()['player']==position
 for identifier in RISKS:
  inspect(identifier,remote=identifier==RISKS[0] and not mobile);assert state()['risks'][identifier]=='identified';position=p.snapshot()['player']
  if identifier==RISKS[0]:capture('risk-investigation')
  for index in range(1,3 if identifier==RISKS[0] else 2):
   p.tap(p.page.locator('.landslide-panel .inspection-choices button').nth(index));p.wait('d.status.landslide.retry')
   assert state()['risks'][identifier]=='identified' and state()['feedback'] and p.snapshot()['player']==position
  if identifier==RISKS[0]:capture('risk-feedback-wrong')
  p.tap(p.page.locator('.landslide-panel .inspection-choices button').first);p.wait('d.status.landslide.risks[arg]==="decided"',identifier)
  assert not state()['retry'] and state()['feedback'] and p.snapshot()['player']==position
  if identifier==RISKS[0]:capture('risk-feedback-correct')
  choice('Gerekçeyi not et');print(mode+' '+identifier+' safe research + feedback PASS',flush=True)
 assert state()['investigated']==3 and state()['phase']=='choosePreparedness'
 # Reviewed objects remain read-only; reopening cannot duplicate findings.
 inspect('slopeDrain');choice('Araştırmaya dön');assert state()['investigated']==3
 inspect('landslidePreparedness')
 for label in MEASURES:choice(label)
 choice('Aynı koşulları karşılaştır');p.wait('d.status.landslide.phase==="beforeSimulation"');scenario=state()['scenario']
 p.page.wait_for_function('window.__guvenkent().landslideFrame.elapsed>0');assert p.snapshot()['residents']=={'x':720,'y':550}
 p.page.wait_for_function('window.__guvenkent().status.landslide.elapsed>=8',timeout=30000);capture('before');before=p.snapshot()['landslideFrame'];assert not before['residentsDirected'] and before['roadClosed'] and before['residualRisk']
 if not p.snapshot()['landslideAnimated']:
  earth=p.snapshot()['earthVisual'];p.page.wait_for_timeout(350);assert p.snapshot()['earthVisual']==earth
 if not fixture:
  choice('Ayarlar');elapsed=p.snapshot()['landslideFrame']['elapsed'];p.page.wait_for_timeout(400);assert p.snapshot()['landslideFrame']['elapsed']==elapsed;choice('← Oyuna dön')
 position=p.snapshot()['player'];p.page.keyboard.press('ArrowRight');assert p.snapshot()['player']==position
 choice('Geç / özeti göster');choice('Aynı koşulları hazırlıkla izle');assert state()['scenario']==scenario
 p.page.wait_for_function('window.__guvenkent().landslideFrame.elapsed>0');assert p.snapshot()['residents']=={'x':720,'y':550}
 p.page.wait_for_function('window.__guvenkent().status.landslide.elapsed>=8',timeout=30000);capture('after');after=p.snapshot()['landslideFrame'];assert after['residentsDirected'] and after['engineeringPlanned'] and after['surveyPlanned'] and after['roadClosed'] and after['residualRisk']
 assert p.snapshot()['player']==position
 choice('Geç / özeti göster');choice('Karşılaştırmayı aç');capture('comparison');p.check();choice('Kısa raporu al');p.wait('d.status.landslide.completionCount===1')
 choice('Karşılaştırmayı yeniden dene');choice('Aynı koşulları karşılaştır');choice('Geç / özeti göster');choice('Aynı koşulları hazırlıkla izle');choice('Geç / özeti göster');choice('Karşılaştırmayı aç');choice('Kısa raporu al');assert state()['completionCount']==1
 fields=('objects','blurListeners','pointerListeners','keyboardListeners','textureCount');baseline={k:p.snapshot()[k] for k in fields}
 previous={key:p.snapshot()['status'][key]['completionCount'] for key in ['home','flood','forest']}
 for _ in range(0 if fixture else 5):
  choice('Meydana dön');p.stable('CitySquare');enter();assert {k:p.snapshot()[k] for k in fields}==baseline;assert state()['completionCount']==1 and state()['investigated']==3
  assert {key:p.snapshot()['status'][key]['completionCount'] for key in previous}==previous;p.check()
 print(json.dumps({'mode':mode,'result':'PASS','componentFixture':fixture,'chain':'--chain' in sys.argv,'investigated':3,'sameScenario':scenario,'completionCount':1,'reentryCycles':0 if fixture else 5,'previousCompletionCounts':previous,'stableCounts':baseline},ensure_ascii=False),flush=True)
 if keep_open:return p
 p.close()
def main():
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
  modes=[True] if '--mobile' in sys.argv else [False] if '--desktop' in sys.argv else [False,True]
  for mobile in modes:run(b,mobile,'--component' in sys.argv)
  b.close()
if __name__=='__main__':main()
