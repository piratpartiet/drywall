#!/usr/bin/python3

import psycopg2
import datetime

def sql(conn, sql, params=[]):
    cursor = conn.cursor()
    cursor.execute(sql, params)
    try:
        return cursor.fetchall()
    except psycopg2.ProgrammingError:
        return None

def pg_conn(database):
    return psycopg2.connect(database=database)


## TODO!  this is not tested!
def inserts_new_to_old():
    old_conn = pg_conn('memberdb')
    new_conn = pg_conn('drywall')
    last_run = sql(old_conn, "select started from member_sync where is_current and op='ins_new2old'")[0]
    new_rows = sql(new_conn, "select member_number,first_name||' '||last_name,coalesce(date_birth,date '1900-01-01'+(year_birth-1900)*interval '1 year'),address,zip,email,municipality,county,(select max(payment_date) from payment where user_id=login_user.id and purpose=1 and payment_status>=40) from login_user join member on user_id=login_user.id where exists (select * from payment where user_id=login_user.id and purpose=1 and created_at>%s and payment_date>=%s) and not exists (select * from payment where user_id=login_user.id and payment_date<%s and purpose=1)", [last_run, last_run])
    cnt=0
    for row in new_rows:
        sql(old_conn, "insert into members (mnr,navn,fdato,adresse,postnummer,epost,kommune,fylke,innmeldt) values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", params=list(row))
        sql(old_conn, "update members set postnummer=(select post.poststed from post where post.postnummer=members.postnummer) where created_at=now()") ## will this work? 
    sql(old_conn, "insert into member_sync (op, started, finished, num_rows) values ('ins_new2old', now(), %s, %s)", params=[datetime.datetime.now(), len(new_rows)])
    old_conn.commit()
    new_conn.commit()

def inserts_old_to_new():
    old_conn = pg_conn('memberdb')
    new_conn = pg_conn('drywall')
    last_run = sql(old_conn, "select started from member_sync where is_current and op='ins_old2new'")[0]
    new_rows = sql(old_conn, "select * from members where created_at>%s", [last_run])
    for row in new_rows:
        email = row[7]
        if email == '':
            email = row[2].replace(' ','.') + '@piratpartiet.invalid'
        sql(new_conn, "insert into login_user (username, email) values ('m'||%s, %s)", params=[row[1], email])
        user_id=sql(new_conn, "select id from login_user order by id desc limit 1")[0][0]
        zip = row[5]
        if zip == '':
            zip=0
        else:
            zip=int(zip)
        sql(new_conn, "insert into member (member_number, last_name, address, zip, member_since, municipality, county, user_id, created_at) values (%s, %s, %s, %s, %s, %s, %s, %s, %s)", params=[row[1], row[2], row[4], zip, row[10], row[8], row[9], user_id, row[17]])

	## historiske kontingentinnbetalinger
        if row[14]:
            sql(new_conn, "insert into payment (payment_date, purpose, user_id, payment_status) values (%s, 1, %s, 80)", params=['2013-01-01', user_id])
        if row[15]:
            sql(new_conn, "insert into payment (payment_date, purpose, user_id, payment_status) values (%s, 1, %s, 80)", params=['2014-01-01', user_id])
        if row[16]:
            sql(new_conn, "insert into payment (payment_date, purpose, user_id, payment_status) values (%s, 1, %s, 80)", params=['2015-01-01', user_id])
    sql(old_conn, "insert into member_sync (op, started, finished, num_rows) values ('ins_old2new', now(), %s, %s)", params=[datetime.datetime.now(), len(new_rows)])
    new_conn.commit()
    old_conn.commit()



inserts_from_old_to_new()
