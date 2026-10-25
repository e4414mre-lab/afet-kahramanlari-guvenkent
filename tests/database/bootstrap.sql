-- Plain PostgreSQL test adapter for Supabase's auth schema/roles; not a migration.
create schema if not exists auth;
create table if not exists auth.users(id uuid primary key);
do $$begin create role anon nologin;exception when duplicate_object then null;end$$;
do $$begin create role authenticated nologin;exception when duplicate_object then null;end$$;
do $$begin create role service_role nologin bypassrls;exception when duplicate_object then null;end$$;
create or replace function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
grant usage on schema auth to authenticated,service_role;
grant execute on function auth.uid() to authenticated,service_role;
