"""Real-input acceptance checks. Requires Python Playwright, Chromium and Vite.

QA inspector is read-only: no teleports, quest changes or fake interactions.
Run: python tests/town_hall_smoke.py (or tests/browser_smoke.py).
"""
import json
import math
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('GUVENKENT_TEST_URL', 'http://127.0.0.1:5173')
OUT = Path(__file__).resolve().parents[1] / 'docs' / 'screenshots'
ARTIFACTS = Path('/tmp/guvenkent-hall-checks')


class Player:
    def __init__(self, browser, mobile=False):
        self.mobile = mobile
        self.context = browser.new_context(
            viewport={'width': 390 if mobile else 1440, 'height': 844 if mobile else 1000},
            is_mobile=mobile, has_touch=mobile, device_scale_factor=1,
        )
        self.page = self.context.new_page()
        self.page.set_default_timeout(18000)
        self.errors = []
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.cdp = self.context.new_cdp_session(self.page)

    def start(self, student=False):
        self.page.goto(BASE + '/?qa=1')
        if student:
            self.page.get_by_role('button', name='Öğrenci olarak başla →').click()
            assert self.page.get_by_role('button', name='Keşfe Başla', exact=True).is_disabled()
            self.page.get_by_label('Adın veya takma adın').fill('Deniz')
            self.page.get_by_role('button', name='Keşfe Başla', exact=True).click()
        else:
            self.tap(self.page.get_by_role('button', name='Meydan prototipini keşfet'))
        self.page.wait_for_function('window.__guvenkent && window.__guvenkent().player')
        self.stable('CitySquare')

    def tap(self, locator):
        locator.tap() if self.mobile else locator.click()

    def snapshot(self):
        return self.page.evaluate('window.__guvenkent()')

    def wait(self, expression, arg=None):
        try:
            self.page.wait_for_function(
                '(arg) => { const d = window.__guvenkent(); return ' + expression + '; }', arg=arg,
                timeout=20000,
            )
        except Exception:
            print('FAILED WAIT',expression,arg,'STATE',self.snapshot(),'FOCUS',self.page.evaluate('document.activeElement.outerHTML'),flush=True)
            self.page.screenshot(path=str(ARTIFACTS / 'failure.png'))
            raise

    def stable(self, scene):
        self.wait('d.scene === arg && !d.status.transitioning && !!d.player', scene)
        self.page.wait_for_timeout(250)
        assert self.snapshot()['sceneCount'] == 1
        assert self.snapshot()['canvasCount'] == 1

    def hold(self, label, key, until, arg):
        if self.mobile:
            b = self.page.get_by_role('button', name=label, exact=True).bounding_box()
            self.cdp.send('Input.dispatchTouchEvent', {
                'type': 'touchStart', 'touchPoints': [{'x': b['x'] + b['width']/2, 'y': b['y'] + b['height']/2}],
            })
        else:
            self.page.keyboard.down(key)
        try:
            self.wait(until, arg)
        finally:
            if self.mobile:
                self.cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            else:
                self.page.keyboard.up(key)

    def axis(self, axis, value):
        current = self.snapshot()['player'][axis]
        if abs(current-value) < 7:
            return
        positive = current < value
        label, key = ({('x', True): ('Sağa', 'ArrowRight'), ('x', False): ('Sola', 'ArrowLeft'),
                       ('y', True): ('Aşağı', 'ArrowDown'), ('y', False): ('Yukarı', 'ArrowUp')})[(axis, positive)]
        self.hold(label, key, 'arg.positive ? d.player[arg.axis] >= arg.value - 3 : d.player[arg.axis] <= arg.value + 3',
                  {'axis': axis, 'positive': positive, 'value': value})

    def hotspot(self, identifier):
        return next(h for h in self.snapshot()['hotspots'] if h['id'] == identifier)

    def approach(self, identifier, remote=False):
        h = self.hotspot(identifier)
        # An open front aisle avoids all furniture. Real input moves along it.
        self.axis('y', 755 if self.snapshot()['scene'] == 'TownHall' else 820)
        horizontal_remote = remote and h['y'] + 125 > 850
        self.axis('x', h['x'] - (125 if horizontal_remote else 0))
        self.axis('y', h['y'] if horizontal_remote else h['y'] + (125 if remote else 0))
        self.page.wait_for_timeout(350)

    def object(self, identifier):
        h = self.hotspot(identifier)
        p = h['screen']
        b = self.page.locator('canvas').bounding_box()
        assert 0 < p['x'] < b['width'] and 70 < p['y'] < b['height'] - 110, (identifier, p, b)
        if self.mobile:
            self.page.touchscreen.tap(b['x'] + p['x'], b['y'] + p['y'])
        else:
            self.page.mouse.click(b['x'] + p['x'], b['y'] + p['y'])

    def interaction(self, key='e'):
        if self.mobile:
            self.tap(self.page.get_by_role('button', name='Etkileşim', exact=False))
        else:
            self.page.keyboard.press(key)

    def dialogue(self):
        self.wait('d.status.dialogue !== null')

    def next(self):
        before = self.snapshot()['status']['dialogue']
        assert before
        if self.mobile:
            self.tap(self.page.locator('.dialogue-actions .primary'))
        else:
            self.page.keyboard.press('Enter')
        self.wait('d.status.dialogue === null || d.status.dialogue.index !== arg', before['index'])

    def close_dialogue(self):
        while self.snapshot()['status']['dialogue']:
            self.next()

    def check(self):
        assert not self.errors, self.errors
        assert self.page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        d = self.snapshot()
        assert d['canvasCount'] == d['sceneCount'] == 1
        assert not d['status']['assetErrors'], d['status']['assetErrors']
        distance = math.hypot(d['player']['x']-d['robot']['x'], d['player']['y']-d['robot']['y'])
        assert 35 < distance < 100, distance

    def close(self):
        self.context.close()


def scenario(browser, mobile):
    p = Player(browser, mobile)
    p.start(student=not mobile)
    if not mobile:
        before = p.snapshot()['player']['x']
        p.page.keyboard.down('d'); p.page.wait_for_timeout(180); p.page.keyboard.up('d')
        assert p.snapshot()['player']['x'] > before + 5
        p.axis('x', 670)
    else:
        p.approach('townHall', remote=True)
    # Remote artwork selection must walk to the door, then change scenes once.
    p.object('townHall')
    p.stable('TownHall')
    assert p.snapshot()['status']['quest'] == 'speakToMayor'

    # Wrong-order plan and journal remain distinct objects with informative feedback.
    for identifier in ('plan', 'journal'):
        p.approach(identifier, remote=True)
        before = p.snapshot()['player']
        p.object(identifier)
        p.dialogue()
        after = p.snapshot()['player']
        assert math.hypot(after['x']-before['x'], after['y']-before['y']) > 30
        assert p.snapshot()['status']['quest'] == 'speakToMayor'
        p.close_dialogue()

    p.approach('mayor', remote=True)
    if mobile:
        p.cdp.send('Emulation.setCPUThrottlingRate', {'rate': 4})
    p.object('mayor'); p.dialogue()
    if mobile:
        p.cdp.send('Emulation.setCPUThrottlingRate', {'rate': 1})
        p.next()
    else:
        p.tap(p.page.get_by_role('button', name='Geç', exact=True))
        p.wait('d.status.dialogue.index === 1')
    p.page.get_by_text('Başkan: Çocuk Belediye Başkanı unvanın temsili. Gerçek belediye veya acil durum yetkisi vermez.', exact=True).wait_for()
    p.check()
    screenshot = OUT / ('town-hall-mobile.png' if mobile else 'town-hall-desktop.png')
    p.page.screenshot(path=str(screenshot))
    p.next()
    assert p.snapshot()['status']['quest'] == 'inspectCertificate'

    if not mobile:
        previous = p.snapshot()['player']
        p.page.get_by_role('button', name='Ayarlar', exact=True).click()
        p.page.get_by_text('♿ Azaltılmış hareket', exact=True).click()
        p.page.get_by_text('💬 Konuşma balonları', exact=True).click()
        p.page.get_by_role('button', name='Sessiz mod', exact=True).click()
        assert p.page.get_by_role('checkbox').nth(1).is_checked() is False
        p.page.get_by_role('button', name='← Oyuna dön').click()
        assert p.snapshot()['player'] == previous
        assert p.snapshot()['status']['quest'] == 'inspectCertificate'
        p.page.get_by_text('Unvanın temsili; gerçek belediye veya acil durum yetkisi vermez. Tehlikeli işleri yetişkinlere bırak.', exact=True).wait_for()
        p.wait('d.robotFloat === -30')

    # Keyboard or touch interaction at the certificate; skip must not accept it.
    p.approach('certificate')
    p.interaction('e'); p.dialogue()
    p.tap(p.page.get_by_role('button', name='Geç', exact=True))
    p.wait('d.status.dialogue === null')
    assert p.snapshot()['status']['quest'] == 'inspectCertificate'
    p.interaction('Enter'); p.dialogue(); p.next()
    assert p.snapshot()['status']['quest'] == 'reviewCityPlan'

    p.approach('plan', remote=True); p.object('plan'); p.dialogue()
    assert p.snapshot()['status']['quest'] == 'reviewCityPlan'
    p.next()
    assert p.snapshot()['status']['quest'] == 'goToSchool'
    p.approach('journal'); p.interaction(); p.dialogue()
    assert 'Güvenkent İlkokuluna git' in p.snapshot()['status']['dialogue']['pages'][0]
    p.close_dialogue()

    # Five complete exits AND reentries with stable listeners/object/texture counts.
    p.cdp.send('HeapProfiler.collectGarbage')
    heap_before = p.cdp.send('Runtime.getHeapUsage')['usedSize']
    baseline = {k: p.snapshot()[k] for k in ('objects','blurListeners','pointerListeners','keyboardListeners','textureCount')}
    for _ in range(5):
        p.approach('exit'); p.interaction('Enter'); p.stable('CitySquare')
        d = p.snapshot()
        assert math.hypot(d['player']['x']-400, d['player']['y']-580) < 95
        assert d['status']['quest'] == 'goToSchool'
        p.interaction('Enter'); p.stable('TownHall')
        assert p.snapshot()['status']['quest'] == 'goToSchool'
        assert {k: p.snapshot()[k] for k in baseline} == baseline
        p.check()
    p.cdp.send('HeapProfiler.collectGarbage')
    heap_after = p.cdp.send('Runtime.getHeapUsage')['usedSize']
    assert heap_after < heap_before + 15_000_000, (heap_before, heap_after)

    p.approach('exit'); p.interaction('Enter'); p.stable('CitySquare')
    p.axis('y',820); p.axis('x',1120)
    p.hold('Yukarı','w','d.status.schoolVisited === true',None)
    assert p.snapshot()['status']['quest'] == 'goToSchool'
    p.dialogue(); p.check()
    p.close_dialogue()
    p.page.get_by_text('Sınıf risk avı giriş noktası · Sonraki fazda açılacak',exact=True).wait_for()
    p.page.screenshot(path=str(ARTIFACTS / ('returned-mobile.png' if mobile else 'returned-desktop.png')))
    if not mobile:
        p.page.reload()
        p.page.get_by_role('button',name='⚙️ Ayarlar',exact=True).click()
        assert p.page.get_by_role('checkbox').nth(1).is_checked() is False
        assert p.page.get_by_role('checkbox').nth(5).is_checked() is True
        for index in (0,2,3,4):
            assert p.page.get_by_role('checkbox').nth(index).is_checked() is False
    print(json.dumps({'mode':'touch' if mobile else 'desktop','result':'PASS','exitReentryCycles':5,'heapBefore':heap_before,'heapAfter':heap_after,'stableCounts':baseline,'screenshot':str(screenshot)},ensure_ascii=False),flush=True)
    p.close()


def missing_art(browser):
    p = Player(browser)
    p.page.route('**/mayor-concept.png',lambda route:route.abort())
    p.start()
    p.object('townHall');p.stable('TownHall')
    p.page.get_by_role('alert').wait_for()
    assert 'hall-mayor' in p.snapshot()['status']['assetErrors']
    p.approach('mayor');p.interaction();p.dialogue();p.close_dialogue()
    assert p.snapshot()['status']['quest']=='inspectCertificate'
    assert not p.errors,p.errors
    print('PASS: missing mayor image produces an explicit warning; movement/story remain usable',flush=True)
    p.close()


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    ARTIFACTS.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as playwright:
        browser=playwright.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding'])
        scenario(browser,False)
        scenario(browser,True)
        missing_art(browser)
        browser.close()


if __name__=='__main__':
    main()
