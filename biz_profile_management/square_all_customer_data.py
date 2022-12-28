from square.client import Client
import pandas as pd
import psycopg2
import googleapiclient.discovery as gapd
import google.oauth2.credentials
import json
from datetime import datetime, timedelta

disc_info = 'https://mybusinessbusinessinformation.googleapis.com/$discovery/rest?version=v1'
disc_acc = 'https://mybusinessaccountmanagement.googleapis.com/$discovery/rest?version=v1'
disc_mybiz = "https://developers.google.com/static/my-business/samples/mybusiness_google_rest_v4p9.json"
readMask="storeCode,regularHours,name,languageCode,title,phoneNumbers,categories,storefrontAddress,websiteUri,regularHours,specialHours,serviceArea,labels,adWordsLocationExtensions,latlng,openInfo,metadata,profile,relationshipData,moreHours"

ENDPOINT="database-2.cvwhw7xmj43j.ap-south-1.rds.amazonaws.com"
PORT="5432"
USR="postgres"
REGION="ap-south-1b"
DBNAME="postgres"
PASS = "January2021"
SECRET = '04bd3a7c4cb7c026bc2816ae907a6ef6d711ba100cbd6bd904532bd5ee37043c'

def get_gapd_creds(email):
    sql_query("SELECT oauth FROM gmb_oauth WHERE email='"+email+"'")
    res = cur.fetchall()
    creds = json.loads(res[0][0])
    credentials = google.oauth2.credentials.Credentials(**creds)
    return credentials

def get_mybiz_client(credentials):
    try:
        my_biz_client = gapd.build('mybusiness', 'v4', credentials=credentials, discoveryServiceUrl=disc_mybiz)
        return my_biz_client
    except Exception as e:
        return str(e)

def get_biz_info(credentials):
    try:
        biz_acc_client = gapd.build('mybusinessaccountmanagement', 'v1'
        , credentials=credentials, discoveryServiceUrl=disc_acc)
        biz_info = biz_acc_client.accounts().list().execute()
        return biz_info
    except Exception as e:
        return str(e)

def get_location_db(email):
    sql_query(f"select location from gmb_oauth where email='{email}'")
    location = cur.fetchall()[0][0]
    return location

def sql():
    global conn, cur
    try:
        conn = psycopg2.connect(host=ENDPOINT, port=PORT, database=DBNAME, user=USR, password=PASS)
        cur = conn.cursor()
    except Exception as e:
        print("ERROR",e)

def sql_query(query):
    global cur
    try:
        cur.execute(query)
    except:
        sql()
        cur.execute(query)

query = "Select email,access_token from square_oauth where email ilike '%.com' "
sql_query(query)
res = cur.fetchall()

master_customer = {}
master_payments = {}
master_appointments = {}

customer_all = pd.DataFrame()
appointments_all = pd.DataFrame()

for data in res:
    email = data[0]
    credentials = get_gapd_creds(data[0])
    biz_info = get_biz_info(credentials)
    print(biz_info)
    location = get_location_db(data[0])
    my_biz_client = get_mybiz_client(credentials)
    # reviews = my_biz_client.accounts().locations().reviews().list(parent=f"{biz_info['accounts'][0]['name']}/locations/{location}", pageSize=50).execute()
    # reviewers = [review['reviewer']['displayName'] for review in reviews['reviews']]

    client = Client(access_token=data[1],environment='production')


    # payments = client.payments.list_payments(limit = 1000)

    cust_list = client.customers.list_customers()
    customers_list = []
    customer_list = cust_list.body
    customers_list.append(customer_list['customers'])

    i=1
    while 'cursor' in cust_list.body.keys():
        cust_list = client.customers.list_customers( cursor = cust_list.body['cursor'])
        if cust_list.is_success():
            customer_list = cust_list.body
            customers_list.append(customer_list['customers'])
            i+=1
            print("getting customer list", i)
        elif cust_list.is_error():
            print(cust_list.errors)
    
    if cust_list.is_success():
        customer_list = cust_list.body
        customers_list.append(customer_list['customers'])

    temp_list = []
    for cp in customers_list:
        for cc in cp:
            temp_list.append(cc)

    customer_df = pd.DataFrame(temp_list)
    customer_df['review_given']=False

    # for r in reviewers:
    #     gn=r.split()[0]
    #     if len(r.split())>1:
    #         fn=r.split()[1]
    #     row = customer_df.loc[(customer_df.given_name == gn) & (customer_df.family_name == fn)]
    #     if row.empty == False:
    #         customer_df.loc[row.index,'review_given'] = True
    #         print("true")

    # customer_df['appointments']=0
    

    customer_df["email"] = email
    
    if customer_all.shape!=(0,0):
        customer_all = customer_all.append(customer_df)
    else:
        customer_all = customer_df

customer_all.to_excel('customer_all_1.xlsx', index=False)

print(0)