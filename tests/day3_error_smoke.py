"""Development fixture only: inject a read failure, verify retry and safe room return."""
from playwright.sync_api import sync_playwright
from home_smoke import HomePlayer
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 p=HomePlayer(browser,False)
 def inject(route):
  response=route.fetch();body=response.text();needle='const region = REGIONS.find'
  assert needle in body
  body=body.replace(needle,'if (new URLSearchParams(window.location.search).get("renderFault")==="1") throw new Error("Fixture intentional render failure"); '+needle,1)
  route.fulfill(response=response,body=body)
 p.page.route('**/src/components/Day3Panel.tsx*',inject)
 p.page.goto('http://127.0.0.1:5173/tests/day3-fixture.html?renderFault=1')
 p.wait('d.scene === "TownHall" && !!d.player');p.stable('TownHall');p.approach('plan',remote=True);p.object('plan')
 p.page.get_by_role('alert').get_by_text('Planlama görünümü açılamadı').wait_for()
 p.tap(p.page.get_by_role('button',name='Belediye odasına dön',exact=True));p.wait('!d.status.day3.open');assert p.page.get_by_role('alert').count()==0
 p.object('plan');p.page.get_by_role('alert').wait_for()
 p.page.evaluate("history.replaceState({},'',location.pathname)")
 p.tap(p.page.get_by_role('button',name='Tekrar dene',exact=True));p.page.get_by_role('heading',name='Birlikte planlayalım',exact=True).wait_for()
 assert p.snapshot()['status']['day3']['remainingBudget']==1000 and p.snapshot()['status']['day3']['planRevision']==0
 p.tap(p.page.get_by_role('button',name='Planlamayı kapat',exact=True));p.wait('!d.status.day3.open');position=p.snapshot()['player']['x'];p.axis('x',position+60)
 assert p.snapshot()['player']['x']>position+40
 print('PASS: injected render failure, safe room close, retry after recovery, budget/progress preserved, movement restored')
 p.close();browser.close()
