"""Phase 3 real-input checks; requires running Vite, Playwright and Chromium.
All setup and learning progress happens through controls; QA is read-only.
"""
import json
import math
from pathlib import Path
from playwright.sync_api import sync_playwright
from town_hall_smoke import Player, OUT, ARTIFACTS

RISKS=['bookshelf','exit_bags','heavy_boxes','tall_cabinet','window_heavy','wall_board']
SAFE=['safe_shelf','safe_bags','safe_box','safe_board']
CORRECT={
 'bookshelf':'Teknik personelden sabitlemesini iste.',
 'exit_bags':'Öğretmen gözetiminde geçişi düzenlet.',
 'heavy_boxes':'Yetkili yetişkinden aşağı almasını iste.',
 'tall_cabinet':'Teknik personele sabitleme için bildir.',
 'window_heavy':'Öğretmene bildir, güvenli yerleşim planlat.',
 'wall_board':'Yetkili kişiden bağlantıları kontrol etmesini iste.',
}

class SchoolPlayer(Player):
    def capture(self, moment):
        folder=OUT/'risk-hunt';folder.mkdir(parents=True,exist_ok=True)
        mode='mobile' if self.mobile else 'desktop'
        self.page.evaluate('document.fonts.ready')
        self.page.wait_for_timeout(250)
        filename=f'{moment}-{mode}.png'
        self.page.screenshot(path=str(folder/filename))
        state=self.snapshot()
        evidence=getattr(self,'evidence',[])
        evidence.append({'moment':moment,'image':filename,'viewport':self.page.viewport_size,
                         'scene':state['scene'],'player':state['player'],'robot':state['robot'],
                         'hunt':state['status']['hunt'],'inspection':state['status']['inspection'],
                         'dialogue':state['status']['dialogue']})
        self.evidence=evidence
        (folder/f'evidence-{mode}.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+'\n')

    def doorway_walk(self, blocked):
        self.axis('y',1010);self.axis('x',900)
        deadline=self.page.evaluate('performance.now()')+900
        self.hold('Aşağı','s','performance.now() >= arg',deadline)
        y=self.snapshot()['player']['y']
        assert (1040<y<=1055) if blocked else y>1080,('doorway collision',blocked,y)
        self.capture('08-exit-blocked' if blocked else '09-exit-cleared')
        self.axis('y',1010);self.axis('x',880)

    def setup(self):
        self.start(student=not self.mobile)
        self.approach('townHall')
        self.interaction('Enter');self.stable('TownHall')
        self.approach('mayor',remote=True);self.object('mayor');self.dialogue();self.close_dialogue()
        self.approach('certificate');self.interaction();self.dialogue();self.next()
        self.approach('plan',remote=True);self.object('plan');self.dialogue();self.next()
        self.approach('exit');self.interaction('Enter');self.stable('CitySquare')
        self.axis('y',820);self.axis('x',1120)
        self.hold('Yukarı','w','d.status.schoolVisited === true',None)
        self.close_dialogue();self.interaction('Enter');self.stable('SchoolClassroom')
        self.dialogue();self.close_dialogue()
        assert self.snapshot()['status']['hunt']['found']==0
        assert self.snapshot()['status']['hunt']['guidedTarget']=='bookshelf'

    def navigate(self,identifier):
        h=self.hotspot(identifier);start=self.snapshot()['player']
        aisles=[630,730,830,930,1010]
        row=min(aisles,key=lambda y:abs(y-start['y']))
        self.axis('y',row);self.axis('x',1000)
        target_row=min(aisles,key=lambda y:abs(y-h['y']))
        # Cross to side storage before descending beside the front wall.
        # Delayed touch release in the central doorway must not send a
        # horizontal route through the painted front wall.
        if target_row==1010 and (h['x']<800 or h['x']>1120):target_row=930
        self.axis('y',target_row);self.axis('x',h['x']);self.axis('y',h['y'])
        self.page.wait_for_timeout(500)

    def object(self,identifier):
        if self.snapshot()['scene']!='SchoolClassroom':return super().object(identifier)
        h=self.hotspot(identifier);point=h['screen'];b=self.page.locator('canvas').bounding_box()
        # Choose a real part of the sprite that is not covered by HUD/d-pad.
        # Prefer the previous lower point for wall props, then visible centre/top.
        target=None
        for dy in (.20,0,-.20,.35,-.35):
            for dx in (0,-.20,.20):
                x=b['x']+point['x']+h['hit']['width']*dx*self.snapshot()['zoom']
                y=b['y']+point['y']+h['hit']['height']*dy*self.snapshot()['zoom']
                if not (b['x']<x<b['x']+b['width'] and b['y']+65<y<b['y']+b['height']-90):continue
                visible=self.page.evaluate("p => document.elementFromPoint(p.x,p.y)?.tagName === 'CANVAS'",{'x':x,'y':y})
                if visible:target=(x,y);break
            if target:break
        assert target,('No unobstructed sprite point',identifier,point,b)
        if self.mobile:self.page.touchscreen.tap(*target)
        else:self.page.mouse.click(*target)

    def inspect(self,identifier,keyboard=False):
        self.navigate(identifier)
        if identifier in ('heavy_boxes','safe_board') and self.mobile:
            self.axis('y',600);self.page.wait_for_timeout(700)
        if keyboard:
            for _ in range(5):
                self.page.keyboard.press('q');self.page.wait_for_timeout(80)
                if self.snapshot()['status']['nearby']==self.hotspot(identifier)['name']:break
            assert self.snapshot()['status']['nearby']==self.hotspot(identifier)['name']
            self.page.keyboard.press('e')
        else:self.object(identifier)
        self.wait('d.status.inspection?.id === arg',identifier)
        self.page.get_by_role('dialog').wait_for()
        assert self.page.get_by_role('dialog').count()==1

    def close_inspection(self):
        self.tap(self.page.get_by_role('button',name='İncelemeyi kapat',exact=True))
        self.wait('d.status.inspection === null')
        self.close_dialogue()

    def stage(self,identifier,state):
        self.wait('d.status.hunt.findings[arg.id] === arg.state',{'id':identifier,'state':state})



def control_touch_boundary(p):
    """Real d-pad touch must not reach Phaser's window touch listener."""
    p.page.evaluate("""() => {
      window.__controlTouchCount=0;
      window.__observeControlTouch=(event) => {
        if(event.target instanceof Element && event.target.closest('.dpad button'))
          window.__controlTouchCount++;
      };
      window.addEventListener('touchstart',window.__observeControlTouch);
    }""")
    start=p.snapshot()['player']['x']
    p.axis('x',start+25)
    assert p.snapshot()['status']['dialogue'] is None
    assert p.page.evaluate('window.__controlTouchCount')==0,'D-pad touch leaked to Phaser window input'
    p.page.evaluate("window.removeEventListener('touchstart',window.__observeControlTouch)")
    p.axis('x',1000)
    print('PASS: mobile DOM direction touches do not reach underlying game sprites',flush=True)


def far_route(p):
    """Click a distant bookcase across the row of desks; never teleport."""
    p.axis('y',830);p.axis('x',1000);p.page.wait_for_timeout(900)
    start=p.snapshot()['player']
    p.page.screenshot(path=str(OUT/'school-classroom-entrance-desktop.png'))
    p.object('bookshelf');p.wait('d.status.inspection?.id === "bookshelf"')
    p.page.get_by_role('dialog').wait_for()
    p.page.screenshot(path=str(OUT/'school-classroom-inspection-desktop.png'))
    end=p.snapshot()['player']
    assert math.hypot(end['x']-start['x'],end['y']-start['y'])>350
    assert p.snapshot()['status']['hunt']['found']==0
    p.close_inspection()
    print('PASS: real distant-object click walks around desk footprints',flush=True)

def run_classroom(browser,mobile):
    p=SchoolPlayer(browser,mobile);p.setup()
    if mobile:control_touch_boundary(p)
    p.axis('y',830 if mobile else 730);p.page.wait_for_timeout(800)
    p.page.screenshot(path=str(OUT/('school-classroom-mobile.png' if mobile else 'school-classroom-desktop.png')))
    if not mobile:far_route(p)
    p.navigate('bookshelf')
    assert p.snapshot()['status']['inspection'] is None
    p.capture('01-approach')
    p.tap(p.page.locator('.afi-hint'));p.dialogue()
    assert p.snapshot()['status']['hunt']['guidedTarget']=='bookshelf'
    p.capture('03-afi-guidance')
    p.tap(p.page.get_by_role('button',name='Tamam',exact=True))
    p.wait('d.status.dialogue === null')
    for index,identifier in enumerate(RISKS):
        if identifier=='exit_bags':
            p.navigate(identifier);p.doorway_walk(blocked=True)
        p.inspect(identifier,keyboard=not mobile and identifier in ('bookshelf','exit_bags'))
        if identifier=='bookshelf':p.capture('02-inspection')
        before=p.snapshot()['status']['hunt']['found']
        if identifier=='bookshelf' and not mobile:
            # Opening focuses the first choice; native Tab/Enter selects the second.
            p.page.keyboard.press('Tab');p.page.keyboard.press('Enter')
        else:p.tap(p.page.locator('.inspection-choices button').nth(1))
        p.wait('d.status.inspection.retry === true')
        assert p.snapshot()['status']['hunt']['found']==before
        p.page.get_by_text('Tekrar düşünelim.',exact=False).wait_for()
        if identifier=='bookshelf':p.capture('04-wrong-feedback')
        p.tap(p.page.locator('.inspection-choices button').first)
        p.stage(identifier,'identified')
        correct=p.page.get_by_role('button',name=CORRECT[identifier],exact=True)
        choices=p.page.locator('.inspection-choices button')
        for j in range(choices.count()):
            if choices.nth(j).inner_text()!=CORRECT[identifier]:
                p.tap(choices.nth(j));break
        p.wait('d.status.inspection.retry === true');p.stage(identifier,'identified')
        p.tap(correct);p.stage(identifier,'planned')
        if identifier=='bookshelf':
            assert p.snapshot()['status']['inspection']['retry'] is False
            p.capture('05-correct-feedback')
        p.tap(p.page.get_by_role('button',name='Öğretmene bildir',exact=True));p.stage(identifier,'assigned')
        p.tap(p.page.get_by_role('button',name='Yetişkin çözümünü gör',exact=True));p.stage(identifier,'verifiedFixed')
        assert p.snapshot()['status']['hunt']['fixed']==index+1
        close_button=p.page.get_by_role('button',name='Keşfe dön',exact=True)
        if not mobile and identifier=='heavy_boxes':
            close_button.focus();p.page.keyboard.press('Enter')
        else:p.tap(close_button)
        p.wait('d.status.inspection === null')
        p.page.wait_for_timeout(200)
        assert p.snapshot()['status']['inspection'] is None,'Native Enter must close once, without reopening the object'
        p.close_dialogue()
        if identifier=='bookshelf':
            if mobile:
                p.page.screenshot(path=str(OUT/'school-classroom-bookshelf-mobile.png'))
            count=p.snapshot()['status']['hunt']['found']
            p.inspect(identifier);p.close_inspection()
            assert p.snapshot()['status']['hunt']['found']==count
            assert p.snapshot()['status']['hunt']['fixed']==1
        if identifier=='exit_bags':
            assert p.snapshot()['status']['hunt']['guidedTarget'] is None
            p.doorway_walk(blocked=False)
        if index in (2,5):
            assert p.snapshot()['status']['hunt']['found']==index+1
            p.capture('06-progress-3-of-6' if index==2 else '07-progress-6-of-6')
        print(('touch' if mobile else 'desktop')+' risk '+identifier+' PASS',flush=True)
    assert p.snapshot()['status']['hunt']['complete'] is True
    assert p.snapshot()['status']['hunt']['found']==6
    for identifier in SAFE:
        p.inspect(identifier);count=p.snapshot()['status']['hunt']['found']
        p.tap(p.page.get_by_role('button',name='Güvenli özelliklerini incele',exact=True))
        p.wait('d.status.inspection.feedback.length > 0')
        p.tap(p.page.get_by_role('button',name='Keşfe dön',exact=True));p.wait('d.status.inspection === null')
        assert p.snapshot()['status']['hunt']['found']==count
    assert p.snapshot()['status']['hunt']['safeCount']==4
    p.check()
    # Settings do not discard classroom progress; mandatory text survives mute/text off.
    p.tap(p.page.get_by_role('button',name='Ayarlar',exact=True))
    p.tap(p.page.get_by_text('♿ Azaltılmış hareket',exact=True))
    p.tap(p.page.get_by_text('💬 Konuşma balonları',exact=True))
    p.tap(p.page.get_by_role('button',name='Sessiz mod',exact=True))
    p.tap(p.page.get_by_role('button',name='← Oyuna dön',exact=True))
    p.wait('d.robotFloat === -30')
    p.page.get_by_text('Ağır eşya taşıma, sabitleme veya panoyu düzeltme; öğretmene ya da yetkili yetişkine bildir.',exact=False).wait_for()
    p.inspect('bookshelf');p.close_inspection()
    p.cdp.send('HeapProfiler.collectGarbage');heap_before=p.cdp.send('Runtime.getHeapUsage')['usedSize']
    fields=('objects','blurListeners','pointerListeners','keyboardListeners','textureCount')
    baseline={key:p.snapshot()[key] for key in fields}
    for cycle in range(5):
        p.navigate('classroomExit')
        if cycle==0:p.object('classroomExit')
        else:p.interaction('Enter')
        p.stable('CitySquare')
        assert p.snapshot()['status']['hunt']['fixed']==6
        p.interaction('Enter');p.stable('SchoolClassroom')
        assert p.snapshot()['status']['hunt']['safeCount']==4
        assert p.snapshot()['status']['inspection'] is None
        assert p.snapshot()['status']['dialogue'] is None
        assert p.page.locator('.inspection-card').count()==0
        assert {key:p.snapshot()[key] for key in fields}==baseline
        p.check()
    p.cdp.send('HeapProfiler.collectGarbage');heap_after=p.cdp.send('Runtime.getHeapUsage')['usedSize']
    assert heap_after<heap_before+15_000_000,(heap_before,heap_after)
    p.page.screenshot(path=str(ARTIFACTS/('classroom-complete-mobile.png' if mobile else 'classroom-complete-desktop.png')))
    print(json.dumps({'mode':'touch' if mobile else 'desktop','result':'PASS','riskCount':6,'safeCount':4,'exitReentryCycles':5,'stableCounts':baseline,'heapBefore':heap_before,'heapAfter':heap_after},ensure_ascii=False),flush=True)
    p.close()


def missing_classroom_asset(browser):
    p=SchoolPlayer(browser);p.page.route('**/school/bookshelf.png',lambda route:route.abort())
    p.setup();p.page.get_by_role('alert').wait_for()
    assert 'school-bookshelf' in p.snapshot()['status']['assetErrors']
    p.navigate('bookshelf');p.interaction();p.wait('d.status.inspection?.id === "bookshelf"')
    assert not p.errors,p.errors
    print('PASS missing classroom image: explicit warning, playable inspection, no crash',flush=True);p.close()


def main():
    OUT.mkdir(parents=True,exist_ok=True);ARTIFACTS.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
        run_classroom(browser,False);run_classroom(browser,True);missing_classroom_asset(browser);browser.close()

if __name__=='__main__':main()
