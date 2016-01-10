alter table members add created_at timestamp default now();
alter table members add updated_at timestamp;

CREATE OR REPLACE FUNCTION update_updated_at_column()	
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;	
END;
$$ language 'plpgsql';

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE PROCEDURE  update_updated_at_column();

create table member_sync (
    op varchar,
    started timestamp,
    finished timestamp default now(),
    num_rows int,
    is_current boolean default 't'
);
create unique index member_sync_current on member_sync(op) where is_current;

insert into member_sync (op, started, num_rows) values ('ins_new2old', '1980-01-01', 0)
insert into member_sync (op, started, num_rows) values ('ins_old2new', '1980-01-01', 0)


CREATE or replace FUNCTION member_sync_archive() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    update member_sync set is_current=false where (NEW.op=op) and is_current;
    return NEW;
END;$$;


CREATE TRIGGER member_sync_archive BEFORE INSERT ON member_sync FOR EACH ROW EXECUTE PROCEDURE member_sync_archive();

/* datavask */
update members set y2014='t' where mnr=161; /* duplikat */
delete from members where mnr=535; /* duplikat */
delete from members where mnr=520; /* duplikat */
update members set adresse=adresse||', SA2 8PH Swansea University, United Kingdom', postnummer='', kommune='' where postnummer='SA2 8PH';

/* package python3-psycopg2 has to be installed for python script to work */
