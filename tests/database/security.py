"""Real PostgreSQL security/transaction tests, isolated Docker DB; no live Supabase claim."""
import subprocess,json,uuid,hashlib
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
CONTAINER='guvenkent-phase11-db';results=[]
assert subprocess.check_output(['docker','inspect','--format','{{index .Config.Labels "guvenkent.test-db"}}',CONTAINER],text=True).strip()=='phase11','Refusing an unrecognized DB container'
def sql(text,role='postgres',user=None,fail=False):
 prefix='' if role=='postgres' else 'set role '+role+';'
 if user:prefix+="select set_config('request.jwt.claim.sub','"+user+"',false);"
 r=subprocess.run(['docker','exec','-i',CONTAINER,'psql','-U','postgres','-Atq','-v','ON_ERROR_STOP=1'],input=prefix+text,text=True,capture_output=True)
 if fail:assert r.returncode!=0,(text,r.stdout);return
 assert r.returncode==0,(text,r.stderr);lines=r.stdout.strip().splitlines();return lines[-1] if lines else ''
def lit(v):return "'"+str(v).replace("'","''")+"'"
def call(name,args=[],role='service_role',user=None,fail=False):
 r=sql('select to_jsonb(public.'+name+'('+','.join(lit(a) if not isinstance(a,dict) and not isinstance(a,bool) else lit(json.dumps(a))+'::jsonb' for a in args)+'));',role,user,fail)
 return None if fail else json.loads(r)
def check(name,fn):fn();results.append({'test':name,'result':'PASS'});print('PASS '+name,flush=True)
def sha(s):return hashlib.sha256(s.encode()).hexdigest()
sql('delete from guvenkent.rate_limits;') # Isolated fixture DB only, never a live project.
A=str(uuid.uuid4());B=str(uuid.uuid4());X=str(uuid.uuid4())
sql(f"insert into auth.users values('{A}'),('{B}'),('{X}');insert into guvenkent.teacher_profiles(user_id,display_name) values('{A}','Test Eğitmen A'),('{B}','Test Eğitmen B');")
ca=call('gk_create_class',['Örnek 5-A'],'authenticated',A);cb=call('gk_create_class',['Örnek 5-B'],'authenticated',B)
check('non-provisioned auth user cannot become teacher',lambda:call('gk_create_class',['Yetkisiz'],'authenticated',X,True))
check('teacher B cannot mutate A class',lambda:call('gk_manage_class',[ca['id'],'rotate'],'authenticated',B,True))
check('teacher B cannot read A dashboard',lambda:call('gk_class_dashboard',[ca['id']],'authenticated',B,True))
check('teacher B RLS SELECT sees zero A rows',lambda: (sql("select count(*) from guvenkent.classes where id="+lit(ca['id'])+';','authenticated',B)=='0') or (_ for _ in ()).throw(AssertionError()))
check('anonymous cannot read students',lambda:sql('select * from guvenkent.students;','anon',fail=True))
check('authenticated user cannot read sessions or answer bank',lambda:[sql('select * from guvenkent.'+t+';','authenticated',A,True) for t in ['student_sessions','question_banks']])
check('authenticated user cannot directly write a score',lambda:sql('update guvenkent.assessment_attempts set final_score=300;','authenticated',A,True))
check('anonymous cannot invoke capability RPC directly',lambda:call('gk_join_class',[sha(ca['joinToken']),'Sahte'],'anon',fail=True))
one=call('gk_join_class',[sha(ca['joinToken']),'Gezgin']);two=call('gk_join_class',[sha(ca['joinToken']),'Gezgin']);h1=sha(one['sessionToken']);h2=sha(two['sessionToken'])
check('same nickname creates distinct students and capabilities',lambda:(one['studentId']!=two['studentId'] and one['code']!=two['code'] and one['sessionToken']!=two['sessionToken']) or (_ for _ in ()).throw(AssertionError()))
check('only hashes stored',lambda:(sql('select count(*) from guvenkent.student_sessions where token_hash='+lit(one['sessionToken'])+';')=='0') or (_ for _ in ()).throw(AssertionError()))
with ThreadPoolExecutor(max_workers=2) as pool:
 a,again=list(pool.map(lambda _:call('gk_start_attempt',[h1]),range(2)))
assert a['attemptId']==again['attemptId']
check('start idempotently resumes same active attempt',lambda:None)
check('foreign student cannot read another attempt',lambda:call('gk_get_attempt',[h2,a['attemptId']],fail=True))
check('foreign student cannot submit into another attempt',lambda:call('gk_submit_answer',[h2,a['attemptId'],a['questionIds'][0],True,str(uuid.uuid4())],fail=True))
check('foreign student cannot finalize another attempt',lambda:call('gk_finalize_attempt',[h2,a['attemptId']],fail=True))
check('finalization requires 15 answers',lambda:call('gk_finalize_attempt',[h1,a['attemptId']],fail=True))
assert 'correctZone' not in json.dumps(a) and '"correct"' not in json.dumps(a) and all(q['explanation']=='' for q in a['questions']);assert 'seed' not in a
check('public question payload has no answer key, seed or paired IDs',lambda:None)
raw=json.loads(Path('docs/data/final-question-bank-v1.1.json').read_text());bank={q['id']:q for q in raw['questions']}
for n in range(30):
 # Exercise server selector with fresh isolated participants, all difficulties/groups.
 st=call('gk_join_class',[sha(ca['joinToken']),'Örnek-'+str(n)]);exam=call('gk_start_attempt',[sha(st['sessionToken'])]);qs=exam['questions'];assert len(qs)==15
 assert [sum(q['difficulty']==d for q in qs)for d in ['easy','medium','hard']]==[5,6,4]
 assert len({(q['hazard'],q['type'])for q in qs})==15
check('30 real server selections satisfy every group and 5/6/4',lambda:None)
expected=0
for i,q in enumerate(a['questions']):
 original=bank[q['id']]
 if q['type']=='true_false':answer=original['correct']
 elif q['type']=='matching':answer={p['id']:next(t['id'] for t in q['targets'] if t['right']==next(o['right'] for o in original['pairs'] if o['left']==p['left'])) for p in q['pairs']}
 else:answer={p['id']:next(z['id'] for z in q['zones'] if z['label']==next(z['label'] for z in original['zones'] if z['id']==next(o['correctZone'] for o in original['items'] if o['text']==p['text']))) for p in q['items']}
 if i==0:call('gk_submit_answer',[h1,a['attemptId'],q['id'],{'score':300},str(uuid.uuid4())],fail=True)
 key=str(uuid.uuid4());r=call('gk_submit_answer',[h1,a['attemptId'],q['id'],answer,key]);assert r['records'][q['id']]['points']==20;expected+=20
 duplicate=call('gk_submit_answer',[h1,a['attemptId'],q['id'],answer,key]);assert len(duplicate['records'])==i+1
 call('gk_submit_answer',[h1,a['attemptId'],q['id'],answer,str(uuid.uuid4())],fail=True)
 if i==0:call('gk_submit_answer',[h1,a['attemptId'],a['questionIds'][3],True,str(uuid.uuid4())],fail=True)
with ThreadPoolExecutor(max_workers=2) as pool:
 final,concurrent_final=list(pool.map(lambda _:call('gk_finalize_attempt',[h1,a['attemptId']]),range(2)))
assert final==concurrent_final and final['result']['total']==300
assert call('gk_finalize_attempt',[h1,a['attemptId']])==final
check('15 server grades, tampered total rejected, duplicates and out-of-order answers rejected, finalization once',lambda:None)
assert sum(r['points']for r in final['result']['byType'])==300 and sum(r['points']for r in final['result']['byHazard'])==300
check('result subtotals equal verified 300',lambda:None)
# Rank only completed attempts, tie by timestamp then student UUID, repeated attempts don't add.
for i,score in enumerate([280,300,240,300,260,100]):
 sid=one['studentId'] if i==0 else two['studentId'] if i==1 else call('gk_join_class',[sha(ca['joinToken']),'Sıra-'+str(i)])['studentId']
 sql("insert into guvenkent.assessment_attempts(student_id,question_bank_version,seed,question_ids,finished_at,final_score,status) values("+lit(sid)+",'1.1.0','fixture',array(select 'q'||n from generate_series(1,15)n),'2026-01-01T00:00:00Z',"+str(score)+",'completed');")
d=call('gk_class_dashboard',[ca['id']],'authenticated',A);assert len(d['top5'])==5;assert [x['score']for x in d['top5']]==[300,300,300,260,240];assert one['studentId']in[x['student_id']for x in d['top5']]
check('top5 uses best completed score, stable deterministic tie order',lambda:None)
rot=call('gk_manage_class',[ca['id'],'rotate'],'authenticated',A);call('gk_class_preview',[sha(ca['joinToken'])],fail=True);call('gk_class_preview',[sha(rot['joinToken'])]);call('gk_manage_class',[ca['id'],'close'],'authenticated',A);call('gk_class_preview',[sha(rot['joinToken'])],fail=True)
check('rotated/closed links reject previous capability',lambda:None)
call('gk_revoke_session',[h2]);call('gk_resume_session',[h2],fail=True)
check('logout revokes session token',lambda:None)
sql('update guvenkent.student_sessions set expires_at=now()-interval\'1 second\' where token_hash='+lit(h1)+';');call('gk_resume_session',[h1],fail=True)
check('expired capability rejected',lambda:None)
# All ten tables must have RLS, all definer functions fixed search_path; no public executes.
assert sql("select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='guvenkent' and c.relkind='r' and not c.relrowsecurity;")=='0'
assert sql("select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where (n.nspname='guvenkent' or p.proname like 'gk_%') and p.prosecdef and not ('search_path=pg_catalog'=any(p.proconfig));")=='0'
check('all tables RLS enabled; all security-definer paths fixed',lambda:None)
# Direct private grading fixtures verify the exact rounding, not just full marks.
seed='grade-fixture'
for kind,expected_score in [('matching',7),('drag_drop',10),('true_false',0)]:
 q=next(q for q in raw['questions'] if q['type']==kind)
 if kind=='true_false':answer=not q['correct']
 elif kind=='matching':
  answer={'s_'+hashlib.md5((seed+q['id']+p['id']).encode()).hexdigest():'t_'+hashlib.md5(('target'+seed+q['id']+q['pairs'][i if i==0 else 3-i]['id']).encode()).hexdigest() for i,p in enumerate(q['pairs'])}
 else:
  answer={'s_'+hashlib.md5((seed+q['id']+p['id']).encode()).hexdigest():'z_'+hashlib.md5(('zone'+seed+q['id']+(p['correctZone'] if i==0 else next(z['id']for z in q['zones']if z['id']!=p['correctZone']))).encode()).hexdigest() for i,p in enumerate(q['items'])}
 graded=json.loads(sql('select guvenkent.score('+lit(json.dumps(q))+'::jsonb,'+lit(seed)+','+lit(json.dumps(answer))+'::jsonb);'))
 assert graded['points']==expected_score,(kind,graded)
check('real SQL partial grades exactly 7/20,10/20,0/20',lambda:None)
bs=call('gk_join_class',[sha(cb['joinToken']),'Arşiv Örneği']);call('gk_manage_class',[cb['id'],'archive'],'authenticated',B);call('gk_resume_session',[sha(bs['sessionToken'])],fail=True);call('gk_class_preview',[sha(cb['joinToken'])],fail=True)
check('archiving revokes sessions and closes admission',lambda:None)
for _ in range(60):call('gk_api_throttle',['join'])
call('gk_api_throttle',['join'],fail=True)
check('committed edge throttle blocks subsequent requests at configured limit',lambda:None)
call('gk_manage_class',[ca['id'],'delete'],'authenticated',A);assert sql('select count(*) from guvenkent.students where class_id='+lit(ca['id'])+';')=='0'
check('class deletion cascades private student records',lambda:None)
Path('/workspace/teacher-validation/database-results.json').write_text(json.dumps({'result':'PASS','engine':'Real PostgreSQL 17 Docker, isolated synthetic fixture; not Supabase Auth integration','checks':results},ensure_ascii=False,indent=2)+'\n')
print('PASS '+str(len(results))+' database security checks')
