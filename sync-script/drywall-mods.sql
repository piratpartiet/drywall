alter table member alter created_at set default now();
alter table login_user alter created_at set default now();
alter table payment alter created_at set default now();

alter table member alter updated_at set default now();
alter table login_user alter updated_at set default now();
alter table payment alter created_at set default now();
