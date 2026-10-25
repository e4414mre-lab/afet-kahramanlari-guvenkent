"""Unconfigured production UI and explicitly labelled demo. No live-login claims."""
import json,os
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path(__file__).resolve().parents[1]/'docs/screenshots';BASE=os.environ.get('GUVENKENT_TEST_URL','http://127.0.0.1:4174')
def run(browser,mobile=False,tablet=False):
 mode='tablet' if tablet else 'mobile' if mobile else 'desktop';context=browser.new_context(viewport={'width':768 if tablet else 390 if mobile else 1440,'height':1024 if tablet else 844 if mobile else 1000},has_touch=mobile,is_mobile=mobile);page=context.new_page();errors=[];requests=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url));page.goto(BASE)
 def tap(l):l.tap() if mobile else l.click()
 def button(n):tap(page.get_by_role('button',name=n,exact=True))
 def capture(name):
  page.evaluate('window.scrollTo(0,0)');page.screenshot(full_page=name in ['teacher-class-progress','teacher-top5','teacher-student-details'],path=str(OUT/(name+('-tablet' if tablet else '-mobile' if mobile else '')+'.png')))
 def nooverflow():assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
 button('Öğretmen girişi');assert page.get_by_text('Supabase bağlı değil · Canlı giriş ve veri kaydı kapalı.',exact=True).is_visible();assert page.get_by_role('button',name='Güvenli giriş yap',exact=True).is_disabled();capture('teacher-login');nooverflow()
 button('Örnek paneli incele');assert 'Demo – veri kaydedilmiyor' in page.locator('.teacher-banner').inner_text();assert page.get_by_role('button',name='Sınıf oluştur',exact=True).is_disabled();assert page.locator('.teacher-classes>button').count()==2;capture('teacher-classes');nooverflow()
 tap(page.locator('.teacher-classes>button').first);page.locator('.teacher-students article').first.wait_for();assert page.locator('.teacher-students article').count()==8;assert page.get_by_role('button',name='Bağlantıyı yenile ve aç',exact=True).is_disabled();capture('teacher-class-progress');nooverflow()
 if mobile and not tablet:capture('teacher')
 page.get_by_label('Takma ad veya kod ara').fill('Gezgin');assert page.locator('.teacher-students article').count()==2;page.get_by_label('Takma ad veya kod ara').fill('');page.locator('.teacher-filters select').select_option('score')
 button('İlk beş başarı');assert page.locator('.teacher-ranking li').count()==5;assert '300' in page.locator('.teacher-ranking li').first.inner_text();capture('teacher-top5');nooverflow()
 button('Öğrenci ilerlemesi');button('Gelişimi incele · B4C9');assert page.get_by_role('heading',name='Afetlere göre gelişim',exact=True).is_visible();capture('teacher-student-details');nooverflow()
 button('Sınıf listesi');tap(page.locator('.teacher-classes>button').nth(1));button('İlk beş başarı');assert page.get_by_text('Henüz tamamlanan sınav yok',exact=True).is_visible();capture('teacher-empty')
 context.set_offline(True);page.get_by_text('Çevrimdışısın. Yeni işlem kaydedilmedi.',exact=True).wait_for();context.set_offline(False);page.get_by_text('Bağlantı geri geldi. Güncelle düğmesiyle sunucu durumunu doğrula.',exact=True).wait_for()
 button('Örnek görünümü kapat');button('← Ana menü');button('Sınıf bağlantısıyla katıl');assert page.get_by_role('button',name='Sınıfa katıl',exact=True).is_disabled();capture('student-class-join');button('Katılım ekranı örneğini incele');page.get_by_label('Adın veya takma adın',exact=True).fill('Örnek Gezgin');assert 'Demo – veri kaydedilmiyor' in page.locator('.teacher-banner').inner_text();capture('student-class-join-demo');nooverflow()
 assert not errors,errors;assert not any('supabase.co' in u for u in requests),'Unconfigured demo made live requests'
 # Join URL is scrubbed, invalid/unconfigured cannot claim to have joined.
 page.goto(BASE+'/join#class='+'a'*64);assert page.evaluate('location.hash')=='';assert page.get_by_role('button',name='Sınıfa katıl',exact=True).is_disabled()
 # Real scene movement survives adding teacher/join navigation.
 button('← Ana menü');button('Meydan prototipini keşfet');page.wait_for_selector('canvas');assert page.locator('canvas').count()==1
 print(json.dumps({'mode':mode,'result':'PASS','supabaseConnected':False,'demoOnly':True,'overflow':False,'errors':errors,'checks':['login-disabled','no-live-requests','classes','8-progress-cards','duplicate-nickname-filter','5-ranking','detail','empty-ranking','join-disabled','token-fragment-removed','game-canvas']},ensure_ascii=False),flush=True);context.close()
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 run(browser);run(browser,True);run(browser,True,True);browser.close()
