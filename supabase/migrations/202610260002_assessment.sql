begin;
create or replace function guvenkent.public_question(q jsonb,p_seed text,p_feedback boolean default false) returns jsonb language sql immutable set search_path=pg_catalog as $$
 select jsonb_build_object('id',q->>'id','type',q->>'type','hazard',q->>'hazard','difficulty',q->>'difficulty','points',20,'explanation',case when p_feedback then q->>'explanation' else '' end) ||
 case q->>'type'
 when 'true_false' then jsonb_build_object('statement',q->>'statement')
 when 'matching' then jsonb_build_object('instruction',q->>'instruction','pairs',(select jsonb_agg(jsonb_build_object('id','s_'||md5(p_seed||(q->>'id')||(p->>'id')),'left',p->>'left')) from jsonb_array_elements(q->'pairs') p),'targets',(select jsonb_agg(x order by key) from(select md5('order'||p_seed||(p->>'id')) key,jsonb_build_object('id','t_'||md5('target'||p_seed||(q->>'id')||(p->>'id')),'right',p->>'right') x from jsonb_array_elements(q->'pairs') p)a))
 else jsonb_build_object('instruction',q->>'instruction','items',(select jsonb_agg(x order by key) from(select md5('order'||p_seed||(i->>'id')) key,jsonb_build_object('id','s_'||md5(p_seed||(q->>'id')||(i->>'id')),'text',i->>'text') x from jsonb_array_elements(q->'items') i)a),'zones',(select jsonb_agg(jsonb_build_object('id','z_'||md5('zone'||p_seed||(q->>'id')||(z->>'id')),'label',z->>'label')) from jsonb_array_elements(q->'zones') z)) end;
$$;
create or replace function guvenkent.score(q jsonb,p_seed text,p_answer jsonb) returns jsonb language plpgsql immutable set search_path=pg_catalog as $$ declare total int;correct int:=0;p jsonb;k text;expected text;targets text[];begin
 if q->>'type'='true_false' then
  if jsonb_typeof(p_answer) is distinct from 'boolean' then raise exception 'Choose true or false';end if;total:=1;correct:=(p_answer=q->'correct')::int;
 else
  total:=case when q->>'type'='matching' then 3 else 2 end;
  if jsonb_typeof(p_answer) is distinct from 'object' then raise exception 'Complete every card';end if;
  if (select count(*) from jsonb_object_keys(p_answer))<>total then raise exception 'Complete every card';end if;
  if q->>'type'='matching' then
   select array_agg('t_'||md5('target'||p_seed||(q->>'id')||(x->>'id'))) into targets from jsonb_array_elements(q->'pairs')x;
   if (select count(distinct value) from jsonb_each_text(p_answer))<>3 then raise exception 'Use each action once';end if;
  else select array_agg('z_'||md5('zone'||p_seed||(q->>'id')||(x->>'id'))) into targets from jsonb_array_elements(q->'zones')x;end if;
  for p in select * from jsonb_array_elements(case when q->>'type'='matching' then q->'pairs' else q->'items' end) loop
   k:='s_'||md5(p_seed||(q->>'id')||(p->>'id'));
   if p_answer->>k is null or not(p_answer->>k=any(targets)) then raise exception 'Invalid card target';end if;
   expected:=case when q->>'type'='matching' then 't_'||md5('target'||p_seed||(q->>'id')||(p->>'id')) else 'z_'||md5('zone'||p_seed||(q->>'id')||(p->>'correctZone')) end;
   if p_answer->>k=expected then correct:=correct+1;end if;
  end loop;
 end if;
 return jsonb_build_object('points',round(20.0*correct/total)::int,'correct',correct,'total',total);
end $$;
create or replace function guvenkent.result_view(p_id uuid) returns jsonb language sql stable set search_path=pg_catalog as $$
 select jsonb_build_object('id',a.id,'seed',a.seed,'bankVersion',a.question_bank_version,'total',a.final_score,'finishedAt',a.finished_at,'questionIds',a.question_ids,'byType',(select jsonb_agg(jsonb_build_object('type',t,'points',coalesce((select sum(r.awarded_score) from guvenkent.assessment_answers r cross join lateral jsonb_array_elements(b.content->'questions')q where r.attempt_id=a.id and q->>'id'=r.question_id and q->>'type'=t),0),'maximum',100)) from unnest(array['true_false','matching','drag_drop'])t),'byHazard',(select jsonb_agg(jsonb_build_object('hazard',h,'points',coalesce((select sum(r.awarded_score) from guvenkent.assessment_answers r cross join lateral jsonb_array_elements(b.content->'questions')q where r.attempt_id=a.id and q->>'id'=r.question_id and q->>'hazard'=h),0),'maximum',60)) from unnest(array['earthquake','flood','wildfire','landslide','avalanche'])h)) from guvenkent.assessment_attempts a join guvenkent.question_banks b on b.version=a.question_bank_version where a.id=p_id and a.status='completed';
$$;
create or replace function guvenkent.attempt_view(p_id uuid) returns jsonb language sql stable set search_path=pg_catalog as $$
 select jsonb_build_object('attemptId',a.id,'bankVersion',a.question_bank_version,'status',a.status,'questionIds',a.question_ids,'questions',(
 select jsonb_agg(guvenkent.public_question(q,a.seed,exists(select 1 from guvenkent.assessment_answers r where r.attempt_id=a.id and r.question_id=q->>'id')) order by ord) from unnest(a.question_ids) with ordinality ids(id,ord) join guvenkent.question_banks b on b.version=a.question_bank_version cross join lateral jsonb_array_elements(b.content->'questions')q where q->>'id'=ids.id),
 'records',coalesce((select jsonb_object_agg(r.question_id,jsonb_build_object('answer',r.answer_json,'points',r.awarded_score,'correct',r.correct_count,'total',r.total_count,'practiceAnswer',null,'practiceCorrect',null)) from guvenkent.assessment_answers r where r.attempt_id=a.id),'{}'::jsonb),'result',case when a.status='completed' then guvenkent.result_view(a.id) else null end) from guvenkent.assessment_attempts a where a.id=p_id;
$$;
create or replace function public.gk_start_attempt(p_session_hash text) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare s uuid:=guvenkent.session_student(p_session_hash);a uuid;seed text:=encode(extensions.gen_random_bytes(32),'hex');ids text[];begin
 perform pg_advisory_xact_lock(hashtextextended(s::text,0));select id into a from guvenkent.assessment_attempts where student_id=s and status='started';
 if a is null then
  perform guvenkent.throttle('start:'||s,6);
  with groups as(select h,t,row_number() over(order by md5(seed||h||t)) n from unnest(array['earthquake','flood','wildfire','landslide','avalanche'])h cross join unnest(array['true_false','matching','drag_drop'])t),chosen as(
   select (select q->>'id' from guvenkent.question_banks b cross join lateral jsonb_array_elements(b.content->'questions')q where b.version='1.1.0' and q->>'hazard'=g.h and q->>'type'=g.t and q->>'difficulty'=case when n<=5 then 'easy' when n<=11 then 'medium' else 'hard' end order by md5(seed||(q->>'id')) limit 1) id from groups g
  )select array_agg(id order by md5('sequence'||seed||id)) into ids from chosen;
  if cardinality(ids)<>15 or array_position(ids,null) is not null then raise exception 'Question bank unavailable';end if;
  insert into guvenkent.assessment_attempts(student_id,question_bank_version,seed,question_ids) values(s,'1.1.0',seed,ids) returning id into a;
 end if;return guvenkent.attempt_view(a);end $$;
create or replace function public.gk_get_attempt(p_session_hash text,p_attempt uuid) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare s uuid:=guvenkent.session_student(p_session_hash);begin
 if not exists(select 1 from guvenkent.assessment_attempts where id=p_attempt and student_id=s) then raise exception 'Attempt access denied' using errcode='42501';end if;return guvenkent.attempt_view(p_attempt);end $$;
create or replace function public.gk_submit_answer(p_session_hash text,p_attempt uuid,p_question text,p_answer jsonb,p_idempotency uuid) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare s uuid:=guvenkent.session_student(p_session_hash);a guvenkent.assessment_attempts;q jsonb;graded jsonb;old guvenkent.assessment_answers;n int;begin
 select * into a from guvenkent.assessment_attempts where id=p_attempt and student_id=s for update;if a.id is null then raise exception 'Attempt access denied' using errcode='42501';end if;
 select * into old from guvenkent.assessment_answers where attempt_id=a.id and question_id=p_question;
 if old.question_id is not null then if old.answer_json<>p_answer or old.idempotency_key<>p_idempotency then raise exception 'First answer already locked';end if;return guvenkent.attempt_view(a.id);end if;
 if a.status<>'started' then raise exception 'Attempt already completed';end if;
 select count(*) into n from guvenkent.assessment_answers where attempt_id=a.id;if a.question_ids[n+1] is distinct from p_question then raise exception 'Question is not active';end if;
 select x into q from guvenkent.question_banks b cross join lateral jsonb_array_elements(b.content->'questions')x where b.version=a.question_bank_version and x->>'id'=p_question;
 graded:=guvenkent.score(q,a.seed,p_answer);
 insert into guvenkent.assessment_answers values(a.id,p_question,p_answer,(graded->>'points')::int,(graded->>'correct')::int,(graded->>'total')::int,now(),p_idempotency);
 return guvenkent.attempt_view(a.id);end $$;
create or replace function public.gk_practice_answer(p_session_hash text,p_attempt uuid,p_question text,p_answer jsonb) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare s uuid:=guvenkent.session_student(p_session_hash);a guvenkent.assessment_attempts;q jsonb;begin
 select * into a from guvenkent.assessment_attempts where id=p_attempt and student_id=s;
 if a.id is null or not exists(select 1 from guvenkent.assessment_answers where attempt_id=a.id and question_id=p_question) then raise exception 'Practice needs a submitted answer';end if;
 select x into q from guvenkent.question_banks b cross join lateral jsonb_array_elements(b.content->'questions')x where b.version=a.question_bank_version and x->>'id'=p_question;return guvenkent.score(q,a.seed,p_answer);end $$;
create or replace function public.gk_finalize_attempt(p_session_hash text,p_attempt uuid) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare s uuid:=guvenkent.session_student(p_session_hash);a guvenkent.assessment_attempts;n int;score int;begin
 select * into a from guvenkent.assessment_attempts where id=p_attempt and student_id=s for update;if a.id is null then raise exception 'Attempt access denied' using errcode='42501';end if;
 if a.status='completed' then return guvenkent.attempt_view(a.id);end if;
 select count(*),sum(awarded_score) into n,score from guvenkent.assessment_answers where attempt_id=a.id;if n<>15 then raise exception 'Answer all 15 activities';end if;
 update guvenkent.assessment_attempts set final_score=score,status='completed',finished_at=clock_timestamp() where id=a.id;return guvenkent.attempt_view(a.id);end $$;
create or replace function public.gk_my_classes() returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare u uuid:=guvenkent.require_teacher();begin
 return coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'label',c.label,'joinEnabled',c.join_enabled and c.join_expires_at>now(),'expiresAt',c.join_expires_at,'archivedAt',c.archived_at,'studentCount',(select count(*) from guvenkent.students s where s.class_id=c.id)) order by c.created_at desc,c.id) from guvenkent.classes c where c.teacher_id=u),'[]'::jsonb);end $$;
create or replace function public.gk_class_dashboard(p_class uuid) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare u uuid:=guvenkent.require_teacher(p_class);begin
 return jsonb_build_object('students',coalesce((select jsonb_agg(jsonb_build_object('id',s.id,'nickname',s.nickname,'code',s.nickname_public_code,'createdAt',s.created_at,'progress',coalesce((select jsonb_agg(jsonb_build_object('chapter',p.chapter_key,'state',p.state,'updatedAt',p.updated_at)) from guvenkent.progress p where p.student_id=s.id),'[]'::jsonb),'attempts',coalesce((select jsonb_agg(guvenkent.result_view(a.id)||jsonb_build_object('answers',(select jsonb_agg(jsonb_build_object('questionId',r.question_id,'points',r.awarded_score,'correct',r.correct_count,'total',r.total_count)) from guvenkent.assessment_answers r where r.attempt_id=a.id)) order by a.finished_at,a.id) from guvenkent.assessment_attempts a where a.student_id=s.id and a.status='completed'),'[]'::jsonb),'activeAttempt',(select jsonb_build_object('answered',(select count(*) from guvenkent.assessment_answers r where r.attempt_id=a.id),'startedAt',a.started_at,'lastAnsweredAt',(select max(r.answered_at) from guvenkent.assessment_answers r where r.attempt_id=a.id)) from guvenkent.assessment_attempts a where a.student_id=s.id and a.status='started')) order by s.created_at,s.id) from guvenkent.students s where s.class_id=p_class),'[]'::jsonb),'top5',coalesce((select jsonb_agg(to_jsonb(r) order by r.score desc,r.finished_at,r.student_id) from(select b.student_id,b.score,b.finished_at,s.nickname,s.nickname_public_code as code from (select distinct on(a.student_id) a.student_id,a.final_score as score,a.finished_at from guvenkent.assessment_attempts a join guvenkent.students s on s.id=a.student_id where s.class_id=p_class and a.status='completed' order by a.student_id,a.final_score desc,a.finished_at,a.id)b join guvenkent.students s on s.id=b.student_id order by b.score desc,b.finished_at,b.student_id limit 5)r),'[]'::jsonb));end $$;
revoke all on all functions in schema guvenkent from public,anon,authenticated;
grant execute on all functions in schema guvenkent to service_role;
revoke all on function public.gk_start_attempt(text),public.gk_get_attempt(text,uuid),public.gk_submit_answer(text,uuid,text,jsonb,uuid),public.gk_practice_answer(text,uuid,text,jsonb),public.gk_finalize_attempt(text,uuid),public.gk_my_classes(),public.gk_class_dashboard(uuid) from public,anon,authenticated;
grant execute on function public.gk_start_attempt(text),public.gk_get_attempt(text,uuid),public.gk_submit_answer(text,uuid,text,jsonb,uuid),public.gk_practice_answer(text,uuid,text,jsonb),public.gk_finalize_attempt(text,uuid) to service_role;
grant execute on function public.gk_my_classes(),public.gk_class_dashboard(uuid) to authenticated;
commit;
