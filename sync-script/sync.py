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


def inserts_from_old_to_new():
    old_conn = pg_conn('memberdb')
    new_conn = pg_conn('drywall')
    last_run = sql(old_conn, "select started from member_sync where is_current and op='ins_old2new'")[0]
    new_rows = sql(old_conn, "select * from members where created_at>%s", [last_run])
    cnt=0
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
        sql(new_conn, "insert into member (member_number, last_name, address, zip, member_since, municipality, county, user_id) values (%s, %s, %s, %s, %s, %s)", params=[row[1], row[2], row[4], zip, row[10], row[8], row[9], user_id])

	## historiske kontingentinnbetalinger
        if row[14]:
            sql(new_conn, "insert into payment (payment_date, purpose, user_id) values (%s, 1, %s)", params=['2013-01-01', user_id])
	if row[15]:
            sql(new_conn, "insert into payment (payment_date, purpose, user_id) values (%s, 1, %s)", params=['2014-01-01', user_id])
        if row[16]:
            sql(new_conn, "insert into payment (payment_date, purpose, user_id) values (%s, 1, %s)", params=['2015-01-01', user_id])
        cnt+=1
    sql(old_conn, "insert into member_sync (op, started, finished, num_rows) values ('ins_old2new', now(), %s, %s)", params=[datetime.datetime.now(), cnt])
    new_conn.commit()
    old_conn.commit()
        

inserts_from_old_to_new()
