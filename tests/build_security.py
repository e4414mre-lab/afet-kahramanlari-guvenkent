"""Audit emitted assets and fail-closed build configuration with a synthetic marker."""
import subprocess,os,json,hashlib
from pathlib import Path
root=Path(__file__).resolve().parents[1];assets=list((root/'dist/assets').glob('*.js'));assert assets
text='\n'.join(p.read_text() for p in assets);bank=json.loads((root/'docs/data/final-question-bank-v1.1.json').read_text())
for q in bank['questions']:
 assert q['explanation'] not in text,(q['id'],'answer explanation bundled')
 if q['type']=='true_false':assert q['statement'] not in text,(q['id'],'private question bundled')
assert 'correctZone' not in text
before={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in assets}
env={**os.environ,'VITE_SUPABASE_ANON_KEY':'sb_secret_SYNTHETIC_BUILD_GUARD_TEST'}
r=subprocess.run(['npm','run','build'],cwd=root,env=env,text=True,capture_output=True)
assert r.returncode!=0 and 'yalnız anon/publishable' in r.stderr+r.stdout
assert before=={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in assets}
print('PASS: all 60 private explanations absent, true/false bank absent, no correctZone, private browser key rejected before emit')
