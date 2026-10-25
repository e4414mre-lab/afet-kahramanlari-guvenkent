-- Additive, namespaced schema. Fails closed on an unexpected schema revision.
-- Apply to a reviewed STAGING project first, never automatically to production.
begin;
do $$ begin if to_regnamespace('guvenkent') is null and exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'gk\_%' escape '\') then raise exception 'Existing gk API requires conflict review';end if;end $$;
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
do $$ begin if to_regnamespace('guvenkent') is not null and to_regclass('guvenkent.schema_version') is null then raise exception 'Existing guvenkent schema requires manual conflict review';end if;end $$;
create schema if not exists guvenkent;
revoke all on schema guvenkent from public, anon;
grant usage on schema guvenkent to authenticated, service_role;
create table if not exists guvenkent.schema_version (version integer primary key);
insert into guvenkent.schema_version values (1) on conflict do nothing;
do $$ begin if exists(select 1 from guvenkent.schema_version where version<>1) then raise exception 'Unexpected Guvenkent schema revision'; end if; end $$;
create table if not exists guvenkent.teacher_profiles(user_id uuid primary key references auth.users(id) on delete cascade, display_name text not null check(char_length(display_name) between 2 and 80), created_at timestamptz not null default now());
create table if not exists guvenkent.classes(id uuid primary key default gen_random_uuid(),teacher_id uuid not null references guvenkent.teacher_profiles(user_id) on delete cascade,label text not null check(char_length(label) between 2 and 60),join_token_hash text unique check(join_token_hash ~ '^[a-f0-9]{64}$'),join_enabled boolean not null default true,join_expires_at timestamptz not null default now()+interval '24 hours',created_at timestamptz not null default now(),archived_at timestamptz);
create index if not exists classes_teacher_idx on guvenkent.classes(teacher_id);
create table if not exists guvenkent.students(id uuid primary key default gen_random_uuid(),class_id uuid not null references guvenkent.classes(id) on delete cascade,nickname text not null check(char_length(nickname) between 2 and 30 and nickname !~ '[[:cntrl:]]'),nickname_public_code text not null default upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),created_at timestamptz not null default now(),is_active boolean not null default true,unique(class_id,nickname_public_code));
create index if not exists students_class_idx on guvenkent.students(class_id);
create table if not exists guvenkent.student_sessions(id uuid primary key default gen_random_uuid(),student_id uuid not null references guvenkent.students(id) on delete cascade,token_hash text not null unique check(token_hash ~ '^[a-f0-9]{64}$'),expires_at timestamptz not null default now()+interval '8 hours',revoked_at timestamptz);
create table if not exists guvenkent.progress(student_id uuid references guvenkent.students(id) on delete cascade,chapter_key text not null,task_key text not null,state text not null check(state in ('started','completed')),updated_at timestamptz not null default now(),primary key(student_id,chapter_key,task_key),check(chapter_key in ('story','school','home','flood','wildfire','landslide','avalanche','day3')));
create table if not exists guvenkent.question_banks(version text primary key,content jsonb not null,created_at timestamptz not null default now());
create table if not exists guvenkent.assessment_attempts(id uuid primary key default gen_random_uuid(),student_id uuid not null references guvenkent.students(id) on delete cascade,question_bank_version text not null references guvenkent.question_banks(version),seed text not null,question_ids text[] not null check(cardinality(question_ids)=15),started_at timestamptz not null default now(),finished_at timestamptz,final_score integer check(final_score between 0 and 300),status text not null default 'started' check(status in ('started','completed')),check((status='started' and finished_at is null and final_score is null) or (status='completed' and finished_at is not null and final_score is not null)));
create unique index if not exists one_active_attempt on guvenkent.assessment_attempts(student_id) where status='started';
create table if not exists guvenkent.assessment_answers(attempt_id uuid references guvenkent.assessment_attempts(id) on delete cascade,question_id text not null,answer_json jsonb not null,awarded_score integer not null check(awarded_score between 0 and 20),correct_count integer not null,total_count integer not null,answered_at timestamptz not null default now(),idempotency_key uuid not null,primary key(attempt_id,question_id),unique(attempt_id,idempotency_key));
create table if not exists guvenkent.rate_limits(bucket text primary key,minute timestamptz not null,hits integer not null);
do $$ declare t text; begin foreach t in array array['schema_version','teacher_profiles','classes','students','student_sessions','progress','question_banks','assessment_attempts','assessment_answers','rate_limits'] loop execute format('alter table guvenkent.%I enable row level security',t);execute format('revoke all on guvenkent.%I from public,anon,authenticated',t);end loop;end $$;
grant all on all tables in schema guvenkent to service_role;
grant select on guvenkent.teacher_profiles,guvenkent.classes,guvenkent.students,guvenkent.progress,guvenkent.assessment_attempts to authenticated;
grant select(attempt_id,question_id,awarded_score,correct_count,total_count,answered_at) on guvenkent.assessment_answers to authenticated;
drop policy if exists teacher_self on guvenkent.teacher_profiles;
create policy teacher_self on guvenkent.teacher_profiles for select to authenticated using(user_id=auth.uid());
drop policy if exists teacher_classes on guvenkent.classes;
create policy teacher_classes on guvenkent.classes for select to authenticated using(teacher_id=auth.uid() and exists(select 1 from guvenkent.teacher_profiles where user_id=auth.uid()));
drop policy if exists teacher_students on guvenkent.students;
create policy teacher_students on guvenkent.students for select to authenticated using(exists(select 1 from guvenkent.classes c where c.id=class_id and c.teacher_id=auth.uid()));
drop policy if exists teacher_progress on guvenkent.progress;
create policy teacher_progress on guvenkent.progress for select to authenticated using(exists(select 1 from guvenkent.students s join guvenkent.classes c on c.id=s.class_id where s.id=student_id and c.teacher_id=auth.uid()));
drop policy if exists teacher_attempts on guvenkent.assessment_attempts;
create policy teacher_attempts on guvenkent.assessment_attempts for select to authenticated using(exists(select 1 from guvenkent.students s join guvenkent.classes c on c.id=s.class_id where s.id=student_id and c.teacher_id=auth.uid()));
drop policy if exists teacher_answers on guvenkent.assessment_answers;
create policy teacher_answers on guvenkent.assessment_answers for select to authenticated using(exists(select 1 from guvenkent.assessment_attempts a join guvenkent.students s on s.id=a.student_id join guvenkent.classes c on c.id=s.class_id where a.id=attempt_id and c.teacher_id=auth.uid()));
-- No client policies or SELECT grants for session capabilities, banks, throttles.
create or replace function guvenkent.require_teacher(p_class uuid default null) returns uuid language plpgsql security definer set search_path=pg_catalog as $$ declare u uuid:=auth.uid();begin
 if u is null or not exists(select 1 from guvenkent.teacher_profiles where user_id=u) then raise exception 'Teacher access required' using errcode='42501';end if;
 if p_class is not null and not exists(select 1 from guvenkent.classes where id=p_class and teacher_id=u) then raise exception 'Class access denied' using errcode='42501';end if;return u;end $$;
create or replace function guvenkent.throttle(p_bucket text,p_limit integer) returns void language plpgsql security definer set search_path=pg_catalog as $$ declare n int;begin
 insert into guvenkent.rate_limits values(p_bucket,date_trunc('minute',clock_timestamp()),1) on conflict(bucket) do update set minute=excluded.minute,hits=case when guvenkent.rate_limits.minute=excluded.minute then guvenkent.rate_limits.hits+1 else 1 end returning hits into n;
 if n>p_limit then raise exception 'Too many requests' using errcode='54000';end if;
 -- Bounded cleanup; operational gateway limits are also required.
 delete from guvenkent.rate_limits where minute<now()-interval '1 day';end $$;
create or replace function guvenkent.session_student(p_hash text) returns uuid language plpgsql security definer set search_path=pg_catalog as $$ declare s uuid;begin
 if p_hash is null or p_hash !~ '^[a-f0-9]{64}$' then raise exception 'Session expired' using errcode='28000';end if;
 select st.id into s from guvenkent.student_sessions ss join guvenkent.students st on st.id=ss.student_id join guvenkent.classes c on c.id=st.class_id where ss.token_hash=p_hash and ss.revoked_at is null and ss.expires_at>now() and st.is_active and c.archived_at is null;
 if s is null then raise exception 'Session expired' using errcode='28000';end if;perform guvenkent.throttle('session:'||p_hash,180);return s;end $$;
create or replace function public.gk_create_class(p_label text) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare u uuid:=guvenkent.require_teacher();c guvenkent.classes;token text:=encode(extensions.gen_random_bytes(32),'hex');begin
 perform guvenkent.throttle('teacher:'||u,30);if char_length(trim(p_label)) not between 2 and 60 or p_label ~ '[[:cntrl:]]' then raise exception 'Invalid class label';end if;
 insert into guvenkent.classes(teacher_id,label,join_token_hash) values(u,trim(p_label),encode(extensions.digest(token,'sha256'),'hex')) returning * into c;
 return jsonb_build_object('id',c.id,'label',c.label,'joinToken',token,'expiresAt',c.join_expires_at);end $$;
create or replace function public.gk_manage_class(p_class uuid,p_action text) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare u uuid:=guvenkent.require_teacher(p_class);token text;begin
 perform guvenkent.throttle('teacher:'||u,30);
 if p_action='rotate' then token:=encode(extensions.gen_random_bytes(32),'hex');update guvenkent.classes set join_token_hash=encode(extensions.digest(token,'sha256'),'hex'),join_enabled=true,join_expires_at=now()+interval '24 hours' where id=p_class and archived_at is null;if not found then raise exception 'Archived class';end if;
 elsif p_action='close' then update guvenkent.classes set join_enabled=false where id=p_class;
 elsif p_action='archive' then update guvenkent.classes set join_enabled=false,archived_at=now() where id=p_class;update guvenkent.student_sessions set revoked_at=now() where student_id in(select id from guvenkent.students where class_id=p_class);
 elsif p_action='delete' then delete from guvenkent.classes where id=p_class;
 else raise exception 'Invalid action';end if;
 return jsonb_build_object('ok',true,'joinToken',token,'expiresAt',case when token is not null then now()+interval '24 hours' end);end $$;
create or replace function public.gk_class_preview(p_join_hash text) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare c guvenkent.classes;begin
 perform guvenkent.throttle('public-join',600);if p_join_hash !~ '^[a-f0-9]{64}$' then raise exception 'Invalid link';end if;
 select * into c from guvenkent.classes where join_token_hash=p_join_hash and join_enabled and join_expires_at>now() and archived_at is null;if c.id is null then raise exception 'Invalid or expired link' using errcode='28000';end if;
 perform guvenkent.throttle('invite:'||p_join_hash,60);return jsonb_build_object('label',c.label);end $$;
create or replace function public.gk_join_class(p_join_hash text,p_nickname text) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare c guvenkent.classes;s guvenkent.students;token text:=encode(extensions.gen_random_bytes(32),'hex');expires timestamptz:=now()+interval '8 hours';begin
 perform public.gk_class_preview(p_join_hash);
 if char_length(trim(p_nickname)) not between 2 and 30 or p_nickname ~ '[[:cntrl:]]' then raise exception 'Invalid nickname';end if;
 select * into c from guvenkent.classes where join_token_hash=p_join_hash and join_enabled and join_expires_at>now() and archived_at is null for share;
 if c.id is null then raise exception 'Invalid or expired link' using errcode='28000';end if;
 insert into guvenkent.students(class_id,nickname) values(c.id,trim(p_nickname)) returning * into s;
 insert into guvenkent.student_sessions(student_id,token_hash,expires_at) values(s.id,encode(extensions.digest(token,'sha256'),'hex'),expires);
 return jsonb_build_object('studentId',s.id,'nickname',s.nickname,'code',s.nickname_public_code,'classLabel',c.label,'sessionToken',token,'expiresAt',expires);end $$;
create or replace function public.gk_resume_session(p_session_hash text) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare id uuid:=guvenkent.session_student(p_session_hash);begin
 return(select jsonb_build_object('studentId',s.id,'nickname',s.nickname,'code',s.nickname_public_code,'classLabel',c.label,'expiresAt',ss.expires_at) from guvenkent.students s join guvenkent.classes c on c.id=s.class_id join guvenkent.student_sessions ss on ss.student_id=s.id where s.id=id and ss.token_hash=p_session_hash);end $$;
create or replace function public.gk_revoke_session(p_session_hash text) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare id uuid:=guvenkent.session_student(p_session_hash);begin update guvenkent.student_sessions set revoked_at=now() where token_hash=p_session_hash;return '{"ok":true}'::jsonb;end $$;
create or replace function public.gk_save_progress(p_session_hash text,p_chapter text,p_state text) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$ declare id uuid:=guvenkent.session_student(p_session_hash);begin
 if p_chapter not in ('story','school','home','flood','wildfire','landslide','avalanche','day3') or p_state not in ('started','completed') then raise exception 'Invalid progress';end if;
 insert into guvenkent.progress values(id,p_chapter,'chapter',p_state,now()) on conflict(student_id,chapter_key,task_key) do update set state=case when guvenkent.progress.state='completed' then 'completed' else excluded.state end,updated_at=now();return '{"ok":true}'::jsonb;end $$;
-- All helper executions are private; PUBLIC execute defaults must never survive.
revoke all on all functions in schema guvenkent from public,anon,authenticated;
grant execute on all functions in schema guvenkent to service_role;
revoke all on function public.gk_create_class(text),public.gk_manage_class(uuid,text),public.gk_class_preview(text),public.gk_join_class(text,text),public.gk_resume_session(text),public.gk_revoke_session(text),public.gk_save_progress(text,text,text) from public,anon,authenticated;
grant execute on function public.gk_create_class(text),public.gk_manage_class(uuid,text) to authenticated;
grant execute on function public.gk_class_preview(text),public.gk_join_class(text,text),public.gk_resume_session(text),public.gk_revoke_session(text),public.gk_save_progress(text,text,text) to service_role;
commit;
