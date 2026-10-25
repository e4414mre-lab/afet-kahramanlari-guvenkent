from pathlib import Path
import subprocess,json
root=Path(__file__).resolve().parents[1];base='be10636';
def git(*args):return subprocess.check_output(['git',*args],cwd=root)
paths=git('ls-tree','-r','--name-only',base,'public/assets','src/data','src/game').decode().splitlines();paths=[p for p in paths if p!='src/game/story.ts'];paths+=['src/lib/settings.ts','docs/data/final-question-bank-v1.1.json','docs/data/final-question-bank-v1.json']
checks=[]
for p in paths:
 blob=git('rev-parse',base+':'+p).decode().strip();assert blob==git('hash-object',p).decode().strip(),p;checks.append({'path':p,'baseBlob':blob,'unchanged':True})
css=git('show',base+':src/styles/app.css');assert (root/'src/styles/app.css').read_bytes().startswith(css)
s=git('show',base+':src/game/story.ts').decode();now=(root/'src/game/story.ts').read_text();now=now.replace('import { RemoteFinalFlow } from "./remoteFinalFlow.ts";','import { FinalAssessmentFlow } from "./finalAssessmentFlow.ts";').replace('ReturnType<RemoteFinalFlow["snapshot"]>','ReturnType<FinalAssessmentFlow["snapshot"]>').replace('new RemoteFinalFlow(() => this.notify())','new FinalAssessmentFlow()');assert now==s
result={'result':'PASS','baseCommit':git('rev-parse',base).decode().strip(),'unchangedFiles':len(checks),'allExistingSceneFilesUnchanged':True,'existingCssPrefixUnchanged':True,'storyOnlyFinalTransportChanged':True,'files':checks};(root/'docs/screenshots/teacher-source-regression.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print('PASS',len(checks),'original files; scenes/art/data/CSS/quest logic preserved')
