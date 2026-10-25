import test from 'node:test';import assert from 'node:assert/strict';
import {validateRequest} from '../supabase/functions/_shared/request.ts';
import {normalizeNickname,publicConfiguration,rankTop5,bestCompleted} from '../src/lib/classroom.ts';
import {DEMO_STUDENTS} from '../src/lib/teacherDemo.ts';
test('server contract rejects client score, foreign student IDs, extra fields, malformed capabilities and responses',()=>{
 for(const b of [{action:'start_attempt',score:300},{action:'start_attempt',studentId:'someone-else'},{action:'save_progress',chapter:'home',state:'completed',role:'teacher'},{action:'join_class',joinToken:'x',nickname:'Deniz'},{action:'submit_answer',attemptId:'bad',questionId:'x',answer:true,idempotencyKey:'bad'}])assert.throws(()=>validateRequest(b));
 assert.deepEqual(validateRequest({action:'start_attempt'}),{action:'start_attempt'});assert.throws(()=>validateRequest({action:'submit_answer',attemptId:crypto.randomUUID(),questionId:'x',answer:{score:300},idempotencyKey:crypto.randomUUID()}));
});
test('nickname is minimal, Unicode normalized and control characters rejected; not used for authentication',()=>{
 assert.equal(normalizeNickname('  Gezgin  '),'Gezgin');assert.equal(normalizeNickname('Ｇｅｚｇｉｎ'),'Gezgin');for(const n of ['','A','a'.repeat(31),'De\niz','De\u200bniz'])assert.throws(()=>normalizeNickname(n));
 const a=validateRequest({action:'join_class',joinToken:'a'.repeat(64),nickname:'Gezgin'});assert.equal(a.nickname,'Gezgin');
});
test('no private key, insecure URL or teacher-service JWT can configure a browser',()=>{
 const jwt=(role:string)=>'x.'+btoa(JSON.stringify({role}))+'.x';assert.ok(publicConfiguration('https://example.supabase.co',jwt('anon')));assert.ok(publicConfiguration('https://example.supabase.co','sb_publishable_example'));assert.equal(publicConfiguration('https://example.supabase.co',jwt('service_role')),null);assert.equal(publicConfiguration('https://example.supabase.co','sb_secret_example'),null);assert.equal(publicConfiguration('http://example.com',jwt('anon')),null);assert.equal(publicConfiguration('https://user:pass@example.com',jwt('anon')),null);assert.equal(publicConfiguration('', ''),null);
});
test('top5 is best completed per student, not sums or active attempts; timestamp then ID breaks ties',()=>{
 const students=structuredClone(DEMO_STUDENTS);const before=JSON.stringify(students);const ranks=rankTop5(students);assert.equal(ranks.length,5);assert.equal(ranks[0].score,300);assert.equal(ranks.filter(r=>r.nickname==='Gezgin').length,2);assert.ok(!ranks.some(r=>r.student_id==='example-student-6'));assert.equal(JSON.stringify(students),before);
 const same=students.slice(0,2).map((s,i)=>({...s,id:i?'a':'b',attempts:[{...s.attempts[0],id:'x',total:300,finishedAt:'2026-01-01T00:00:00Z'}]}));assert.equal(rankTop5(same)[0].student_id,'a');assert.equal(rankTop5([]).length,0);assert.equal(bestCompleted([]),null);
});
