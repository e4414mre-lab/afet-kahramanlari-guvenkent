import os
os.makedirs("/tmp/guvenkent-checks", exist_ok=True)
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1000})
 page.set_default_timeout(8000)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:5173/')
 page.get_by_role('button',name='Öğrenci olarak başla →').click()
 assert page.get_by_role('button',name='Keşfe Başla',exact=True).is_disabled()
 page.get_by_label('Adın veya takma adın').fill('Deniz')
 page.get_by_role('button',name='Keşfe Başla',exact=True).click()
 page.locator('canvas').wait_for();page.wait_for_timeout(1500)
 page.screenshot(path='/tmp/guvenkent-checks/desktop.png')
 page.keyboard.down('ArrowUp');page.wait_for_timeout(1000);page.keyboard.up('ArrowUp')
 page.keyboard.down('ArrowLeft');page.wait_for_timeout(1200);page.keyboard.up('ArrowLeft')
 page.get_by_role('button',name='Etkileşim · Belediye').wait_for(timeout=5000)
 page.keyboard.press('e')
 page.get_by_text('AFİ: Okulumuzun çevresini tanıyalım.',exact=True).wait_for()
 page.keyboard.down('ArrowRight');page.wait_for_timeout(3200);page.keyboard.up('ArrowRight')
 page.get_by_text('Okul çevresi keşfedildi',exact=True).wait_for(timeout=5000)
 page.get_by_role('button',name='Ayarlar',exact=True).click()
 page.get_by_text('♿ Azaltılmış hareket',exact=True).click()
 page.get_by_role('button',name='Sessiz mod',exact=True).click()
 assert page.get_by_role('checkbox').nth(0).is_checked()==False
 assert page.get_by_role('checkbox').nth(1).is_checked()==True
 assert page.get_by_role('checkbox').nth(5).is_checked()==True
 page.get_by_role('button',name='← Oyuna dön').click()
 page.get_by_text('Okul çevresi keşfedildi',exact=True).wait_for(timeout=5000)
 page.screenshot(path='/tmp/guvenkent-checks/completed.png')
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.reload()
 page.get_by_role('button',name='⚙️ Ayarlar',exact=True).click()
 assert page.get_by_role('checkbox').nth(0).is_checked()==False
 assert page.get_by_role('checkbox').nth(5).is_checked()==True
 assert not errors,errors
 print('PASS desktop: student gate, arrow movement, town hall E, school arrival, quest survives settings, no page errors/overflow')
 # A fresh session checks mouse destination movement and WASD as well.
 page.get_by_role('button',name='← Ana menü',exact=True).click()
 page.get_by_role('button',name='Meydan prototipini keşfet').click()
 page.locator('canvas').wait_for();page.wait_for_timeout(1200)
 b=page.locator('canvas').bounding_box()
 zoom=max(.8,b['width']/1536,b['height']/1024)
 page.mouse.click(b['x']+400*zoom,b['y']+b['height']-(1024-580)*zoom)
 page.get_by_role('button',name='Etkileşim · Belediye').wait_for()
 page.get_by_role('button',name='Etkileşim · Belediye').click()
 page.get_by_text('AFİ: Okulumuzun çevresini tanıyalım.',exact=True).wait_for()
 page.keyboard.down('d')
 page.get_by_text('Okul çevresi keşfedildi',exact=True).wait_for()
 page.keyboard.up('d')
 assert not errors,errors
 print('PASS desktop: click-to-go and WASD')
 page.close()
 mobile=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1)
 mobile.set_default_timeout(8000)
 m=mobile.new_page();m.on('pageerror',lambda e:errors.append(str(e)))
 m.goto('http://127.0.0.1:5173/');m.get_by_role('button',name='Meydan prototipini keşfet').tap();m.locator('canvas').wait_for();m.wait_for_timeout(1500)
 # Chromium touch events exercise actual pointer capture and release.
 cdp=mobile.new_cdp_session(m)
 def hold(label,ms):
  box=m.get_by_role('button',name=label,exact=True).bounding_box()
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}]})
  m.wait_for_timeout(ms)
  cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 def hold_until(label,locator):
  box=m.get_by_role('button',name=label,exact=True).bounding_box()
  cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':box['x']+box['width']/2,'y':box['y']+box['height']/2}]})
  try:
   locator.wait_for(timeout=12000)
  finally:
   cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 hold('Yukarı',2500)
 hold_until('Sola',m.get_by_role('button',name='Etkileşim · Belediye'))
 m.get_by_role('button',name='Etkileşim · Belediye').tap()
 m.get_by_text('AFİ: Okulumuzun çevresini tanıyalım.',exact=True).wait_for()
 hold_until('Sağa',m.get_by_text('Okul çevresi keşfedildi',exact=True))
 assert m.evaluate('document.documentElement.scrollWidth <= innerWidth')
 m.screenshot(path='/tmp/guvenkent-checks/mobile.png')
 assert not errors,errors
 print('PASS mobile 390x844: virtual movement, touch interaction, school completion, no overflow/page errors')
 browser.close()
