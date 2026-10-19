"""Acceptance through real first-day inputs; no teleportation or quest writes."""
import json
import sys
from playwright.sync_api import sync_playwright
from home_smoke import run as first_day
from town_hall_smoke import OUT
from home_smoke import HomePlayer
from pathlib import Path
RISKS=['floodStorage','floodDrain','floodBridge']
def run(browser,mobile,fixture=False):
 out=Path('/tmp/guvenkent-flood-component') if fixture else OUT
 out.mkdir(parents=True,exist_ok=True)
 if fixture:
  p=HomePlayer(browser,mobile);p.page.goto('http://127.0.0.1:5173/tests/flood-fixture.html');p.page.wait_for_function('window.__guvenkent && window.__guvenkent().player');p.stable('Flood')
 else:
  p=first_day(browser,mobile,keep_open=True)
  assert p.snapshot()['status']['floodUnlocked']
  p.choose('Meydana dön');p.stable('CitySquare')
 def enter():
  p.tap(p.page.get_by_role('button',name='İkinci gün bölgelerini aç',exact=True))
  for name in ['Çamlık','Yamaç','Karlıtepe']:assert p.page.get_by_role('button',name=name+' · Henüz geliştiriliyor',exact=True).is_disabled()
  p.tap(p.page.get_by_role('button',name='Dere Mahallesi · Sel ve taşkın',exact=True));p.stable('Flood');p.page.evaluate('window.scrollTo(0,0)')
 if not fixture:enter()
 def status():return p.snapshot()['status']['flood']
 def walk(identifier):
  h=p.hotspot(identifier)
  # The interior plaza is clear; descend through its middle before moving right.
  p.axis('x',800);p.axis('y',h['y']);p.axis('x',h['x']);p.page.wait_for_timeout(500)
 def open_near(identifier):
  walk(identifier)
  # Q selects only safe observation approaches, never teleports to the artwork.
  for _ in range(7):
   if p.snapshot()['status']['nearby']==p.hotspot(identifier)['name']:break
   p.page.keyboard.press('q');p.page.wait_for_timeout(100)
  if not mobile and identifier=='floodDrain':p.interaction('Enter')
  else:
   h=p.hotspot(identifier);b=p.page.locator('canvas').bounding_box();z=p.snapshot()['zoom'];target=None
   for dx in [0,-.25,-.42,.25]:
    x=b['x']+h['screen']['x']+h['hit']['width']*dx*z;y=b['y']+h['screen']['y']
    if 0<x<p.page.viewport_size['width'] and 0<y<p.page.viewport_size['height'] and p.page.evaluate("p=>document.elementFromPoint(p.x,p.y)?.tagName==='CANVAS'",{'x':x,'y':y}):target=(x,y);break
   assert target,(identifier,h,b)
   if mobile:p.page.touchscreen.tap(*target)
   else:p.page.mouse.click(*target)
  p.page.get_by_role('dialog').wait_for()
 def choice(label):p.tap(p.page.get_by_role('button',name=label,exact=True))
 # Muted and reduced motion from the first-day replay remain intact on entry.
 assert p.snapshot()['waterAnimation'] is False
 open_near('hasan');choice('Güvenli meydandan araştır')
 p.wait('d.status.flood.phase === "investigate3"')
 if fixture and '--navigation-only' in sys.argv:
  # Hold past the NPC footprint; the child must stop before walking through him.
  if mobile:
   b=p.page.get_by_role('button',name='Yukarı',exact=True).bounding_box();p.cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':b['x']+b['width']/2,'y':b['y']+b['height']/2}]})
  else:p.page.keyboard.down('ArrowUp')
  p.page.wait_for_timeout(650)
  if mobile:p.cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
  else:p.page.keyboard.up('ArrowUp')
  assert p.snapshot()['player']['y']>=755,p.snapshot()['player']
 mode='mobile' if mobile else 'desktop'
 # Prove keyboard/dpad cannot walk down to the low bank or river.
 p.axis('x',800);p.axis('y',830)
 if mobile:
  b=p.page.get_by_role('button',name='Sağa',exact=True).bounding_box();p.cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':b['x']+b['width']/2,'y':b['y']+b['height']/2}]})
 else:p.page.keyboard.down('ArrowRight')
 p.page.wait_for_timeout(1900)
 if mobile:p.cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 else:p.page.keyboard.up('ArrowRight')
 assert p.snapshot()['player']['x']<1110,p.snapshot()['player']
 # Three optional hints must advance through three levels and clamp there.
 for _ in range(3):
  p.tap(p.page.get_by_role('button',name='AFİ’den ipucu al'));p.dialogue()
  if not mobile and not fixture:
   p.page.wait_for_function("document.activeElement?.closest('.story-dialogue')");p.page.keyboard.press('Enter')
  else:p.tap(p.page.get_by_role('button',name='Tamam',exact=True))
  p.wait('d.status.dialogue === null')
 assert status()['hintLevel']==3
 p.axis('x',1070 if mobile else 900);p.page.wait_for_timeout(800)
 p.page.screenshot(path=str(out/f'flood-area-{mode}.png'))
 for identifier in RISKS:
  open_near(identifier)
  assert status()['risks'][identifier]=='identified'
  p.tap(p.page.locator('.flood-panel .inspection-choices button').nth(1));p.wait('d.status.flood.retry')
  assert status()['risks'][identifier]=='identified'
  if not mobile and identifier=='floodStorage':
   p.page.keyboard.press('Shift+Tab');p.page.keyboard.press('Enter')
  else:p.tap(p.page.locator('.flood-panel .inspection-choices button').first)
  p.wait('d.status.flood.risks[arg] === "decisionMade"',identifier)
  choice('Gerekçeyi not et');p.wait('d.status.flood.openId === null')
  print(mode+' '+identifier+' safe research PASS',flush=True)
 assert status()['investigated']==3
 # Reopening an already reviewed real object never awards another finding.
 open_near('floodDrain');choice('Araştırmaya dön');assert status()['investigated']==3
 open_near('floodPreparedness')
 choice('Taşkında alçak köprüden hızlıca geçmek');p.wait('d.status.flood.retry')
 assert status()['measures']==[]
 for label in ['Yetkili ekiplerin gider ve dere çevresi bakımı','Riskli kullanım değerlendirmesi ve geçiş güvenliği planı','Erken uyarı ve güvenli uzaklaşma güzergâhı bilgisi']:choice(label)
 if fixture and '--navigation-only' in sys.argv:
  p.check();print(json.dumps({'mode':mode,'componentFixture':True,'navigationOnly':True,'result':'PASS','investigated':status()['investigated'],'npcCollision':True}),flush=True);p.close();return
 # Retain critical words with text off; normal motion/speech toggles are tested on desktop.
 if not mobile and not fixture:
  choice('Dere incelemesini kapat')
  p.tap(p.page.get_by_role('button',name='Ayarlar',exact=True));p.tap(p.page.get_by_text('♿ Azaltılmış hareket',exact=True));p.tap(p.page.get_by_text('✨ Oyun efektleri',exact=True));p.tap(p.page.get_by_role('button',name='← Oyuna dön',exact=True))
  open_near('floodPreparedness')
 choice('Aynı yağışı karşılaştır');p.wait('d.status.flood.phase === "beforeSimulation"')
 rain=status()['scenario'];assert rain['durationSeconds']==45
 p.page.wait_for_function('window.__guvenkent().status.flood.elapsed >= 18',timeout=45000)
 p.page.screenshot(path=str(out/('flood-before-mobile.png' if mobile else 'flood-before.png')))
 # Settings pause is real and does not advance the controlled clock.
 if not fixture:
  p.tap(p.page.get_by_role('button',name='Ayarlar',exact=True));elapsed=status()['elapsed'];p.page.wait_for_timeout(400);assert status()['elapsed']==elapsed;p.tap(p.page.get_by_role('button',name='← Oyuna dön',exact=True))
 if mobile:choice('Geç / özeti göster')
 else:
  p.wait('d.status.flood.elapsed >= 30');p.wait('d.status.flood.elapsed === 45')
 choice('Aynı yağışı hazırlıkla izle');p.wait('d.status.flood.phase === "afterSimulation"')
 assert status()['scenario']==rain
 p.page.wait_for_function('window.__guvenkent().status.flood.elapsed >= 18',timeout=45000)
 p.page.screenshot(path=str(out/('flood-after-mobile.png' if mobile else 'flood-after.png')))
 choice('Geç / özeti göster');choice('Karşılaştırmayı aç');p.wait('d.status.flood.phase === "compare"')
 p.page.get_by_text('Kapalı, yine geçilmez',exact=True).wait_for()
 p.page.screenshot(path=str(out/('flood-comparison-mobile.png' if mobile else 'flood-comparison.png')))
 p.check();choice('Kısa raporu al');p.wait('d.status.flood.completionCount === 1')
 choice('Karşılaştırmayı yeniden dene');assert status()['investigated']==3
 # A second trial with the same real choices must not duplicate completion credit.
 choice('Aynı yağışı karşılaştır');choice('Geç / özeti göster');choice('Aynı yağışı hazırlıkla izle');choice('Geç / özeti göster');choice('Karşılaştırmayı aç');choice('Kısa raporu al');assert status()['completionCount']==1
 fields=('objects','blurListeners','pointerListeners','keyboardListeners','textureCount')
 baseline={k:p.snapshot()[k] for k in fields}
 for _ in range(0 if fixture else 5):
  choice('Meydana dön');p.stable('CitySquare');enter()
  assert {k:p.snapshot()[k] for k in fields}==baseline
  assert status()['completionCount']==1 and status()['investigated']==3
  p.check()
 print(json.dumps({'mode':mode,'result':'PASS','investigated':3,'sameRain':rain,'completionCount':1,'reentryCycles':0 if fixture else 5,'componentFixture':fixture,'stableCounts':baseline},ensure_ascii=False),flush=True)
 p.close()
def main():
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
  modes=[True] if '--mobile' in sys.argv else [False] if '--desktop' in sys.argv else [False,True]
  for mobile in modes:run(b,mobile,fixture='--component' in sys.argv)
  b.close()
if __name__=='__main__':main()
