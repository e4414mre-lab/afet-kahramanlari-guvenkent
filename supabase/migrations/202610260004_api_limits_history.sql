begin;
create or replace function public.gk_api_throttle(p_scope text) returns boolean language plpgsql security definer set search_path=pg_catalog as $$begin
 perform guvenkent.throttle('edge-global',600);
 if p_scope='join' then perform guvenkent.throttle('edge-join',60);
 elsif p_scope ~ '^session:[a-f0-9]{64}$' then perform guvenkent.throttle('edge:'||p_scope,180);
 else raise exception 'Invalid throttle scope';end if;return true;end$$;
create or replace function public.gk_assessment_history(p_session_hash text) returns jsonb language plpgsql security definer set search_path=pg_catalog as $$declare s uuid:=guvenkent.session_student(p_session_hash);begin
 return jsonb_build_object('attempts',(select count(*) from guvenkent.assessment_attempts where student_id=s and status='completed'),'first',(select guvenkent.result_view(id) from guvenkent.assessment_attempts where student_id=s and status='completed' order by finished_at,id limit 1),'last',(select guvenkent.result_view(id) from guvenkent.assessment_attempts where student_id=s and status='completed' order by finished_at desc,id desc limit 1),'best',(select guvenkent.result_view(id) from guvenkent.assessment_attempts where student_id=s and status='completed' order by final_score desc,finished_at,id limit 1));end$$;
revoke all on function public.gk_api_throttle(text),public.gk_assessment_history(text) from public,anon,authenticated;
grant execute on function public.gk_api_throttle(text),public.gk_assessment_history(text) to service_role;
commit;
