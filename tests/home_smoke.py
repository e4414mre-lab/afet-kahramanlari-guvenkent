"""Real inputs only: full school gate, six home props, drill and evacuation."""
import json
from playwright.sync_api import sync_playwright
from school_risk_hunt_smoke import SchoolPlayer, RISKS, CORRECT
from town_hall_smoke import OUT, ARTIFACTS
HOME=['homeBookshelf','homeDecor','homeHeavy','homeSofa','homeTable','homeBag']
class HomePlayer(SchoolPlayer):
 def object(self,identifier):
  if self.snapshot()['scene']!='Home':return super().object(identifier)
  h=self.hotspot(identifier);b=self.page.locator('canvas').bounding_box();zoom=self.snapshot()['zoom'];target=None
  for dy in (.2,.35,0,-.2):
   x=b['x']+h['screen']['x'];y=b['y']+h['screen']['y']+h['hit']['height']*dy*zoom
   if not (b['x']<x<b['x']+b['width'] and b['y']+65<y<b['y']+b['height']-90):continue
   if self.page.evaluate("p=>document.elementFromPoint(p.x,p.y)?.tagName==='CANVAS'",{'x':x,'y':y}):target=(x,y);break
  assert target,(identifier,h['screen'],b)
  if self.mobile:self.page.touchscreen.tap(*target)
  else:self.page.mouse.click(*target)
 def home_status(self):return self.snapshot()['status']['home']
 def home_walk(self,identifier):
  h=self.hotspot(identifier)
  if self.snapshot()['scene']=='GatheringPoint':self.axis('y',h['y']);return
  # Open front aisle and side corridors avoid the solid table and both sofas.
  start=self.snapshot()['player']
  if start['y']<850:
   corridor=1350 if start['x']>1200 else 850
   self.axis('x',corridor);self.axis('y',870)
  else:self.axis('y',870)
  if h['y']<750:
   corridor=1350 if h['x']>1200 else 850
   self.axis('x',corridor);self.axis('y',660);self.axis('x',h['x']);self.axis('y',h['y'])
  else:self.axis('x',h['x']);self.axis('y',h['y'])
  self.page.wait_for_timeout(700)
 def home_open(self,identifier,keyboard=False):
  self.home_walk(identifier)
  if self.mobile and identifier=='homeHeavy':self.axis('y',600);self.page.wait_for_timeout(700)
  if keyboard:self.interaction('Enter')
  else:self.object(identifier)
  self.page.get_by_role('dialog').wait_for()
 def home_close(self):
  self.tap(self.page.get_by_role('button',name='Ev keşfine dön',exact=True))
  self.wait('d.status.home.openId === null')
 def choose(self,label):self.tap(self.page.get_by_role('button',name=label,exact=True))

def complete_school(p):
 for identifier in RISKS:
  p.inspect(identifier)
  p.tap(p.page.locator('.inspection-choices button').first)
  p.tap(p.page.get_by_role('button',name=CORRECT[identifier],exact=True))
  p.tap(p.page.get_by_role('button',name='Öğretmene bildir',exact=True))
  p.tap(p.page.get_by_role('button',name='Yetişkin çözümünü gör',exact=True))
  p.tap(p.page.get_by_role('button',name='Keşfe dön',exact=True))
  p.wait('d.status.inspection === null');p.close_dialogue()
  print('school prerequisite '+identifier+' PASS',flush=True)
 assert p.snapshot()['status']['homeUnlocked']

def run(browser,mobile,keep_open=False):
 p=HomePlayer(browser,mobile)
 p.start();p.axis('y',820);p.axis('x',760);p.axis('y',850);p.interaction('Enter');p.dialogue()
 assert p.snapshot()['scene']=='CitySquare' and not p.snapshot()['status']['homeUnlocked']
 p.close_dialogue();print('locked home gate PASS',flush=True);p.setup();complete_school(p)
 p.navigate('classroomExit');p.interaction('Enter');p.stable('CitySquare')
 p.axis('y',820);p.axis('x',760);p.axis('y',850);p.interaction('Enter');p.stable('Home')
 p.choose('Evi incelemeye başla');p.wait('d.status.home.phase === "inspectHome"')
 mode='mobile' if mobile else 'desktop'
 p.axis('y',880)
 if not mobile:p.axis('x',850);p.axis('y',660);p.axis('x',1000)
 p.page.wait_for_timeout(800)
 p.page.screenshot(path=str(OUT/f'home-{mode}.png'))
 for identifier in HOME:
  p.home_open(identifier,keyboard=not mobile and identifier in ['homeBookshelf','homeTable'])
  if identifier not in ['homeTable','homeBag']:
   p.tap(p.page.locator('.home-panel .inspection-choices button').nth(1))
   p.wait('d.status.home.retry === true')
   assert p.home_status()['findings'][identifier]=='unseen'
  if not mobile and identifier=='homeBookshelf':
   p.page.keyboard.press('Shift+Tab');p.page.keyboard.press('Enter')
  else:p.tap(p.page.locator('.home-panel .inspection-choices button').first)
  if identifier not in ['homeTable','homeBag']:
   p.wait('d.status.home.findings[arg] === "reported"',identifier)
   if not mobile and identifier=='homeBookshelf':p.page.keyboard.press('Enter')
   else:p.choose('Yetişkin çözümünü gör')
  p.wait('d.status.home.findings[arg] === "fixed"',identifier)
  if not mobile and identifier=='homeBookshelf':
   p.page.keyboard.press('Enter');p.wait('d.status.home.openId === null')
  else:p.home_close()
  print(mode+' '+identifier+' PASS',flush=True)
 assert p.home_status()['risks']==4 and p.home_status()['safe']==2
 for identifier in ['homeDecor','homeHeavy','homeSofa']:
  p.home_open(identifier);p.home_close()
  assert p.home_status()['risks']==4
 p.home_open('homeTable',keyboard=not mobile)
 if not mobile:p.page.keyboard.press('Enter')
 else:p.choose('Planlı tatbikatı başlat')
 p.wait('d.status.home.phase === "shaking"')
 assert not p.home_status()['evacuation']
 p.wait('d.homeAudioPlaying === true')
 p.page.screenshot(path=str(OUT/('earthquake-drill-decision-mobile.png' if mobile else 'earthquake-drill-decision.png')))
 for label in ['Pencereye koşarım.','Merdivene yönelirim.','Asansöre binerim.']:
  p.choose(label);p.wait('d.status.home.retry === true')
  assert p.home_status()['phase']=='shaking' and not p.home_status()['protected']
  if label=='Pencereye koşarım.':p.page.screenshot(path=str(OUT/('earthquake-drill-feedback-mobile.png' if mobile else 'earthquake-drill-feedback.png')))
 if not mobile:
  for _ in range(3):p.page.keyboard.press('Shift+Tab')
  p.page.keyboard.press('Enter')
 else:p.choose('Çök–Kapan–Tutun; baş ve boynu koru, sarsıntı bitene kadar kal.')
 p.wait('d.status.home.protected === true')
 assert p.snapshot()['protectedPoseVisible']
 p.page.screenshot(path=str(OUT/f'earthquake-drill-protection-{mode}.png'))
 p.wait('d.status.home.phase === "afterShaking"')
 p.choose('Eşyalarımı almak için geri döner, tesisatı kendim kontrol ederim.')
 p.wait('d.status.home.retry === true');assert not p.home_status()['evacuation']
 p.choose('Yetişkin yönlendirmesiyle açık çıkıştan buluşma alanına git.')
 p.wait('d.status.home.evacuation === true')
 p.home_walk('homeExit');p.interaction('Enter');p.stable('GatheringPoint')
 p.home_walk('gatherHere');p.interaction('Enter');p.wait('d.status.home.phase === "completed"')
 assert p.home_status()['completionCount']==1
 p.page.screenshot(path=str(OUT/f'home-gathering-{mode}.png'))
 p.check()
 # Replays are fully playable with critical writing, muted audio and no shake.
 p.choose('Tatbikatı yeniden dene');p.stable('Home')
 fields=('objects','blurListeners','pointerListeners','keyboardListeners','textureCount')
 p.page.wait_for_timeout(300);baseline={key:p.snapshot()[key] for key in fields}
 for _ in range(5):
  p.home_walk('homeExit');p.interaction('Enter');p.stable('CitySquare')
  p.interaction('Enter');p.stable('Home')
  assert p.home_status()['phase']=='drillReady' and p.home_status()['openId'] is None
  assert p.home_status()['completionCount']==1
  assert {key:p.snapshot()[key] for key in fields}==baseline
  p.check()
 print(mode+' five home exit/reentry cycles PASS',flush=True)
 p.tap(p.page.get_by_role('button',name='Ayarlar',exact=True))
 p.tap(p.page.get_by_text('♿ Azaltılmış hareket',exact=True));p.tap(p.page.get_by_role('button',name='Sessiz mod',exact=True))
 p.tap(p.page.get_by_text('💬 Konuşma balonları',exact=True));p.tap(p.page.get_by_role('button',name='← Oyuna dön',exact=True))
 p.home_open('homeTable');p.choose('Planlı tatbikatı başlat')
 assert not p.snapshot()['homeShakeActive'] and not p.snapshot()['homeAudioPlaying']
 p.page.get_by_text('Sarsıntı başladı. Ne yapmalısın?',exact=True).wait_for()
 p.choose('Çök–Kapan–Tutun; baş ve boynu koru, sarsıntı bitene kadar kal.');p.wait('d.status.home.phase === "afterShaking"')
 assert not p.snapshot()['homeShakeActive'] and not p.snapshot()['homeAudioPlaying']
 p.choose('Yetişkin yönlendirmesiyle açık çıkıştan buluşma alanına git.')
 p.home_walk('homeExit');p.interaction('Enter');p.stable('GatheringPoint');p.home_walk('gatherHere');p.interaction('Enter')
 p.wait('d.status.home.phase === "completed"');assert p.home_status()['completionCount']==1
 p.check();print(json.dumps({'mode':mode,'result':'PASS','homeRisks':4,'homeSafe':2,'completionCount':1,'replayMutedReducedMotion':True},ensure_ascii=False),flush=True)
 if keep_open:return p
 p.close()

def main():
 OUT.mkdir(parents=True,exist_ok=True);ARTIFACTS.mkdir(parents=True,exist_ok=True)
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
  run(b,False);run(b,True);b.close()
if __name__=='__main__':main()
