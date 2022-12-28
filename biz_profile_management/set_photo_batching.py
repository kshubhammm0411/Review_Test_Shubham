import psycopg2
import pandas as pd

ENDPOINT="database-2.cvwhw7xmj43j.ap-south-1.rds.amazonaws.com"
PORT="5432"
USR="postgres"
REGION="ap-south-1b"
DBNAME="postgres"
PASS = "January2021"
SECRET = '04bd3a7c4cb7c026bc2816ae907a6ef6d711ba100cbd6bd904532bd5ee37043c'

conn = psycopg2.connect(host=ENDPOINT, port=PORT, database=DBNAME, user=USR, password=PASS)
cur = conn.cursor()

def sql():
    global conn, cur
    conn = psycopg2.connect(host=ENDPOINT, port=PORT, database=DBNAME, user=USR, password=PASS)
    cur = conn.cursor()

def sql_query(query):
    global cur
    try:
        cur.execute(query)
    except:
        sql()
        cur.execute(query) 
    conn.commit()


dead_pf = pd.read_sql("SELECT place_id from gmb_retool_dead_profiles where dead=false", conn)

count = 0
for place_id in dead_pf.place_id:
    df = pd.read_sql(f'''select
            pics_count,
            pics_count_cumsum,
            (current_date-date)/8 as week_num,
            a.place_id,
            c.biz_name
        from
            biz_profile_metrics as a
            left join
            gmb_retool_dead_profiles as b
            on a.place_id=b.place_id
            left join gmb_retool_onboarding_details as c
            on a.place_id=c.place_id
        where
            date > current_date-21
            and a.place_id='{place_id}'
    ''', conn)

    week0 = df[df["week_num"]==0].pics_count.sum()
    week1 = df[df["week_num"]==1].pics_count.sum()
    week2 = df[df["week_num"]==2].pics_count.sum()

    if week0==0 or week1==0 or week2==0:
        pass
        # sql_query(f"INSERT INTO gmb_pic_velocity (place_id, velocity) VALUES ('{place_id}', '2')")
        # conn.commit()
    else:
        print(place_id)
    
print(count)
