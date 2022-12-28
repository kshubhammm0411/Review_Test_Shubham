# from crypt import methods
from ast import keyword
# from crypt import methods
# from crypt import methods
# from crypt import methods
from distutils.log import error
from email.message import EmailMessage
from multiprocessing import connection
import queue
import re
import smtplib
from urllib import response
from xml.sax.handler import property_lexical_handler
from flask import Flask, render_template, url_for, request, redirect, session, jsonify, Response, send_from_directory
from flask_cors import CORS
import psycopg2
import psycopg2.extras
import app_config
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import messaging
from firebase_admin import db as rtdb
import os
import json
import threading
import plivo
from plivo import plivoxml
import time
from boto3.session import Session
import boto3
import google.oauth2.credentials
import google_auth_oauthlib
import googleapiclient.discovery as gapd
import requests
from datetime import date, datetime, timedelta, timezone
import copy
#from google_ads_keywords import get_top_keywords
import uuid
from twilio.rest import Client
import math
import mail_bodies
import base64
import urllib
import pandas as pd
from dateutil import parser

try:
    credential_path = "timelyai-314916-firebase-adminsdk-tvyb0-0833e39c28.json"
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path
    
    
    cred2 = credentials.Certificate(credential_path)
    firebase_admin.initialize_app(cred2, {'databaseURL': 'https://timelyai-314916-default-rtdb.firebaseio.com/'})

    db = firestore.client()

except Exception as e:
    pass

conn = psycopg2.connect(host=app_config.ENDPOINT, port=app_config.PORT, database=app_config.DBNAME, user=app_config.USR, password=app_config.PASS)
cur = conn.cursor()

def sql():
    global conn, cur
    conn = psycopg2.connect(host=app_config.ENDPOINT, port=app_config.PORT, database=app_config.DBNAME, user=app_config.USR, password=app_config.PASS)
    cur = conn.cursor()

def sql_query(query):
    global cur
    try:
        cur.execute(query)
    except:
        sql()
        cur.execute(query) 
    conn.commit()

def sql_dict():
    columns = list(cur.description)
    try:
        result = cur.fetchall()
    except:
        result = []
    row_dict = {}

    for row in result:
        for i, col in enumerate(columns):
            row_dict[col.name] = row[i]
    return row_dict

def sql_multi_list():
    columns = list(cur.description)
    try:
        result = cur.fetchall()
    except:
        result = []
    row_list = []

    itr = -1
    for row in result:
        row_dict = {}
        itr += 1
        for i, col in enumerate(columns):
            row_dict[col.name] = row[i]
        row_list.append(row_dict)
    return row_list

def sql_multi_dict():
    columns = list(cur.description)
    try:
        result = cur.fetchall()
    except:
        result = []
    row_dict = {}

    itr = -1
    for row in result:
        itr += 1
        for i, col in enumerate(columns):
            if itr == 0:
                row_dict[col.name] = []
            row_dict[col.name].append(row[i])
    return row_dict

def insert_sql(table, data):
    query = 'insert into ' + table + '('
    keys = list(data.keys())
    query += ', '.join(keys) + ') values ('
    itr = 0
    for key in keys:
        itr += 1
        val = data[key]
        print(key, val, type(val))
        if type(val) == str:
            query += "'" + val + "'"
        elif type(val) == dict:
            query += "'" + json.dumps(val) + "'"
        elif type(val) == int:
            query += str(val)
        elif type(val) == float:
            query += str(val)
        elif val is None:
            query += "''"
        if itr == len(keys):
            query += ')'
        else:
            query += ', '
    try:
        print(query)
        sql_query(query)
        conn.commit()
        return 'Success'
    except Exception as e:
        print(e)
        return str(e)

def update_sql(table, data, place_id):
    query = 'update ' + table + ' set '
    itr = 0
    for key in data.keys():
        itr += 1
        val = data[key]
        print(key, val, type(val))
        if type(val) == str:
            query += key + "=" + "'" + val + "'"
        elif type(val) == dict:
            query += key + "=" +  "'" + json.dumps(val) + "'"
        elif type(val) == int:
            query += key + "=" +  str(val)
        elif type(val) == float:
            query += key + "=" +  str(val)
        elif val is None:
            query += key + "=" +  "''"
        if itr == len(data.keys()):
            pass
        else:
            query += ', '

    query += f" where place_id='{place_id}'"

    try:
        print(query)
        sql_query(query)
        conn.commit()
        return 'Success'
    except Exception as e:
        print(e)
        return str(e)

def fire_init():
    try:
        credential_path = "timelyai-314916-firebase-adminsdk-tvyb0-0833e39c28.json"
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credential_path
        
        
        cred2 = credentials.Certificate(credential_path)
        firebase_admin.initialize_app(cred2, {'databaseURL': 'https://timelyai-314916-default-rtdb.firebaseio.com/'})

        db = firestore.client()

    except Exception as e:
        pass

def firebase_document_data_merge(path, data):
    try:
        db.document(path).set(data, merge=True)
    except:
        fire_init()
        db.document(path).set(data, merge=True)

def get_ip_details(request):
    ip_addresses = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr).split(', ')
    user_agent = request.user_agent
    real_ip = ip_addresses[0]
    response = {
        'ip': real_ip,
        "user_agent_raw":user_agent.string.replace("'", "''") if user_agent.string is not None else user_agent.string,
        "platform":user_agent.platform.replace("'", "''") if user_agent.platform is not None else user_agent.platform,
        "browser":user_agent.browser.replace("'", "''") if user_agent.browser is not None else user_agent.browser
    }

    url_endpoint = f"https://api.ipregistry.co/{real_ip}?key=88kqmidnv0wrcojn"

    try:
        user_data = requests.get(url_endpoint).json()
    except Exception as e:

        print(e)
    
    if (user_data is not None) and ("location" in user_data.keys()):
        lati = user_data['location']['latitude']
        longi = user_data['location']['longitude']
        country = user_data['location']['country']['name']
        city = user_data['location']['city']
        region = user_data['location']['region']['name']
    
        final_user_data = {
            "ip":real_ip,
            "platform":user_agent.platform.replace("'", "''") if user_agent.platform is not None else None,
            "user_agent_raw":user_agent.string.replace("'", "''") if user_agent.string is not None else None,
            "browser":user_agent.browser.replace("'", "''") if user_agent.browser is not None else None,
            "latitude":str(lati),
            "longitude":str(longi),
            "country":country.replace("'", "''"),
            "region":region.replace("'", "''"),
            "city":city.replace("'", "''"),
            "url_root":request.url_root
        }

        return final_user_data
    else:
        return response

def send_slack_notification(message, channel_name, blocks={}):
    try:
        url = "https://slack.com/api/conversations.list"
        headers = {
            'Authorization': 'Bearer xoxb-2595227204914-4056131933888-KMTLO9lYyUW0xgczbs1ZXozZ',
            'Content-Type': 'application/json',
        }
        channels_resp = requests.request("GET", url, headers=headers).json()

        channel_id = ''

        for channel in channels_resp["channels"]:
            if channel["name"]==channel_name:
                channel_id = channel["id"]

        if channel_id!='':
            url = "https://slack.com/api/chat.postMessage"
            if "blocks" in blocks.keys():
                payload = json.dumps({
                    "channel": channel_id,
                    "text": message,
                    "blocks":blocks['blocks']
                })
            else:
                payload = json.dumps({
                    "channel": channel_id,
                    "text": message
                })
            headers = {
                'Authorization': 'Bearer xoxb-2595227204914-4056131933888-KMTLO9lYyUW0xgczbs1ZXozZ',
                'Content-Type': 'application/json; charset=utf-8',
            }
            
            response = requests.request("POST", url, headers=headers, data=payload)
            print("slack message sent")
            print(response)
            print(response.json())
    except Exception as e:
        print("slack message failed", e)

def text_mail(subject, content, email):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = 'Ashish from Chrone <chrone@timelyai.com>' 
    msg['To'] = email
    msg.set_content(content)
    mail = smtplib.SMTP('smtp.gmail.com', 587)
    mail.ehlo()
    mail.starttls()
    mail.login('chrone@timelyai.com', 'January@2021')
    mail.send_message(msg) #(from, to, message)
    mail.close()

def html_mail(subject, content, email, cc=False):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = 'Ashish from Chrone <chrone@timelyai.com>' 
    msg['To'] = email
    if cc:
        msg['Bcc'] = 'ashish@timelyai.com'
    msg.set_content(content, subtype='html')
    mail = smtplib.SMTP('smtp.gmail.com', 587)
    mail.ehlo()
    mail.starttls()
    mail.login('chrone@timelyai.com', 'January@2021')
    mail.send_message(msg) #(from, to, message)
    mail.close()

def send_twilio_sms(message, recipient):
    account_sid = app_config.TWILIO_SID
    auth_token = app_config.TWILIO_TOKEN
    client = Client(account_sid, auth_token)

    recipient = str(recipient).replace(" ","").replace("(","").replace(")","").replace("+","").replace("-","")

    twilio_message = client.messages.create(
        body=message,
        from_=app_config.TWILIO_NUMBER,
        to=recipient
    )

    data_json = {
        "message_id":twilio_message.sid,
        "phone":recipient,
        "message":message
    }

    return data_json

app = Flask(__name__)
CORS(app)

app.config["SERVER_NAME"] = os.environ["SERVER_NAME"]
# app.config["SERVER_NAME"] = "localhost:5000"
app.config['SESSION_TYPE'] = 'redis'
app.config.from_object(app_config)
app.config['SECRET_KEY'] = 'bf0dd2fff51811eb9f2738fc98210d85'
app.permanent_session_lifetime = timedelta(days = 365)

@app.before_request
def before_request():
    host = request.headers['Host']
    if host == "www.chrone.work":
        url = request.url.replace("www.","",1)
        return redirect(url)
    if "localhost" in request.url or ":5000" in request.url:
        pass
    elif not request.is_secure:
        url = request.url.replace("http://", "https://", 1)
        return redirect(url)
    else:
        pass

@app.route("/", subdomain="<website_url>")
def static_index(website_url):
    temp_uri = request.headers['Host']
    uri = temp_uri.split(".")[0]
    host = app.config["SERVER_NAME"]
    db_url_query = "Select url from gmb_website_details"
    sql_query(db_url_query)
    res = cur.fetchall()
    urls = [url[0] for url in res]

    if uri in urls:
        data = sp_website(uri)
        index='sp_web_1'
        return render_template(f'{index}.html',host=host, data=data)
    else:
        if uri == 'www':
            red_url = (request.url).replace("www.","")
            return redirect(red_url)
            # return redirect('https://chrone.work/login')
        else:
            return redirect('https://www.chrone.app/')
    
    # return {'res':temp_uri, 'host':host, 'website_url':website_url}

@app.route("/<name>", subdomain="www")
def redirect_to_login():
    return "yeah"
    return redirect('https://chrone.work/login')

# @app.route("/login", subdomain="www")
# def redirect_to_login():
#     # return "Yeah catched the url"
#     return redirect('https://chrone.work/login')

@app.route('/')
def home():
    print(request.url)
    if "http://chrone.work" in request.url:
        return redirect(url_for('gmb_login', _external=True))
    return redirect(url_for('gmb_login', _external=True))

@app.route('/community/<source>/')
def chrone_community(source):
    response = get_ip_details(request)
    response['link'] = request.url
    response['source'] = source

    insert_sql('community_channel',response)
    conn.commit()

    return redirect("https://www.facebook.com/groups/chronecommunity")

@app.route("/get/", methods=["GET"])
def chrone_get():
    response = get_ip_details(request)

    link = request.url
    hidden_field = ""
    for iter, key in enumerate(response.keys()):
        if(iter==0):
            hidden_field += f"{key}={response[key]}"
        else:
            hidden_field += f",{key}={response[key]}"

    response['link'] = link
    # response['headers'] = str(request.headers)

    insert_sql('insta_link_click',response)
    conn.commit()

    if response['platform'].lower()=='iphone':
        return redirect("https://apps.apple.com/app/chrone/id1610101236")
    elif response['platform'].lower()=='android':
        return redirect("market://details?id=com.timelyai.timelyai")
    else:
        return redirect("https://chrone.app")

@app.route("/application/", methods=["GET"])
def chrone_application():
    response = get_ip_details(request)

    link = request.url
    hidden_field = ""
    for iter, key in enumerate(response.keys()):
        if(iter==0):
            hidden_field += f"{key}={response[key]}"
        else:
            hidden_field += f",{key}={response[key]}"

    response['link'] = link
    # response['headers'] = str(request.headers)

    response['created_at'] = str(datetime.utcnow())

    insert_sql('insta_link_click',response)
    conn.commit()

    if response['platform'].lower()=='iphone':
        return redirect("https://apps.apple.com/app/chrone/id1610101236")
    elif response['platform'].lower()=='android':
        return redirect("market://details?id=com.timelyai.timelyai")
    else:
        return redirect("https://chrone.app")

@app.route("/install/", methods=["GET"])
def chrone_install():
    response = get_ip_details(request)

    link = request.url
    hidden_field = ""
    for iter, key in enumerate(response.keys()):
        if(iter==0):
            hidden_field += f"{key}={response[key]}"
        else:
            hidden_field += f",{key}={response[key]}"

    response['link'] = link
    # response['headers'] = str(request.headers)

    response['created_at'] = str(datetime.utcnow())

    insert_sql('insta_link_click',response)
    conn.commit()

    if response['platform'].lower()=='iphone':
        return redirect("https://apps.apple.com/app/chrone/id1610101236")
    elif response['platform'].lower()=='android':
        return redirect("market://details?id=com.timelyai.timelyai")
    else:
        return redirect("https://chrone.app")

# @app.route("/app/", methods=["GET"])
# def chrone_app():

#     data = request.args['uid']

#     response = get_ip_details(request)

#     link = request.url
#     hidden_field = ""
#     for iter, key in enumerate(response.keys()):
#         if(iter==0):
#             hidden_field += f"{key}={response[key]}"
#         else:
#             hidden_field += f",{key}={response[key]}"

#     response['link'] = link
#     # response['headers'] = str(request.headers)

#     response['created_at'] = str(datetime.utcnow())

#     insert_sql('insta_link_click',response)
#     conn.commit()

#     if response['platform'] != None:
#         if response['platform'].lower()=='iphone':
#             red_url = "https://apps.apple.com/app/chrone/id1610101236"
#             return render_template('redirect_appstore.html', data=data, red_url=red_url)
#             # return redirect("https://apps.apple.com/app/chrone/id1610101236")
#         elif response['platform'].lower()=='android':
#             red_url = "market://details?id=com.timelyai.timelyai"
#             return render_template('redirect_appstore.html', data=data, red_url=red_url)
#             # return redirect("market://details?id=com.timelyai.timelyai")
#     else:
#         red_url = "https://chrone.app"
#         return render_template('redirect_appstore.html', data=data, red_url=red_url)
#         # return redirect("https://chrone.app")


@app.route('/v3/HealthCheck', methods=['GET'])
def health_check():
    return "Ok", 200

@app.route('/v3/BatchAvailabilityLookup', methods=['POST'])
def batch_availability_lookup():
    req = request.json
    slot_times = req["slot_time"]

    res = {
        "slot_time_availability": []
    }

    for slot_time in slot_times:
        res['slot_time_availability'].append({
            "available" : True,
            "slot_time": slot_time
        })

    return res, 200


@app.route('/v3/CreateBooking', methods=['POST'])
def create_booking():
    req = request.json

    slot = copy.deepcopy(req["slot"])
    del slot["confirmation_mode"]

    res = {
        "booking": {
            "booking_id": str(uuid.uuid4()).replace('-',''),
            "payment_information": req["payment_information"],
            "slot": slot,
            "status": "CONFIRMED",
            "user_information": {
                "user_id": req["user_information"]["user_id"]
            }
        }
    }
    

    return res, 200


@app.route('/v3/UpdateBooking', methods=['POST'])
def update_booking():
    print("update booking")
    print(request.json)
    res = request.json
        
    return res, 200


def dictionary_to_string(dict):
    res = 'A new lead has come from chrone.app\n\n'
    for key in dict.keys():
        res += f"{key} : {dict[key]}\n"
    
    return res


@app.route('/app/<id>', methods=['GET'])
def redirect_appstore(id):
    response = get_ip_details(request)
    
    response['page'] = "magic_link"
    response['link'] = request.url
    response['sp_name'] = id

    insert_sql('referral_link_views',response)

    data = "place_id|"+id

    print("device : ",response['platform'])

    red_url = ""
    if response['platform'] == 'android':
        red_url = "https://play.google.com/store/apps/details?id=com.timelyai.timelyai"
    elif response['platform'] == 'iphone':
        red_url = "https://apps.apple.com/app/chrone/id1610101236"
    else:
        red_url = "https://chrone.work/login"
    
    return render_template('redirect_appstore.html', data=data, red_url=red_url)


@app.route("/chrone-app-lead", methods=["POST"])
def chrone_app_lead():
    data = request.json
    print(data)
    response = get_ip_details(request)

    res = {**data, **response, "lead_time": str(datetime.now())}
    # send_slack_notification(dictionary_to_string(res), "slack-notifs-test")
    res["name"] = res["Customer Name"]
    res["phone"] = res["Customer Number"]
    res["email"] = res["Customer Email"]
    res["business_name"] = res["Business Name"]

    del res["Customer Name"]
    del res["Customer Number"]
    del res["Customer Email"]
    del res["Business Name"]

    # send_slack_notification(dictionary_to_string(res), "slack-notifs-test")

    insert_sql("chrone_website_leads", res)

    # send_slack_notification(dictionary_to_string(data)+"\n\n\n\nOther source details:\n\n"+dictionary_to_string(response), "slack-notifs-test")
    
    send_slack_notification(dictionary_to_string(data)+"\n\n\n\nOther source details:\n\n"+dictionary_to_string(response), "chrone-app-leads")

    return {"res": "done"}, 200


@app.route('/v3/GetBookingStatus', methods=['POST'])
def get_booking_status():
    print("get booking status")
    print(request.json)

    res = copy.deepcopy(request.json)
    res["booking_status"] = "CONFIRMED"
    res["prepayment_status"] = "PREPAYMENT_NOT_PROVIDED"
    
    print("get booking status response")
    print(res)
    
    return res, 200


@app.route('/v3/ListBookings', methods=['POST'])
def list_bookings():
    print("list bookings")
    print(request.json)
    user_id = request.json["user_id"]

    print("userid", user_id)

    booking = {
        "booking_id": "1234"
    }

    bookings = []
        
    return bookings, 200


@app.route('/hello_world')
def hello_world():
    print(time.time())
    sql_query("SELECT place_id FROM gmb_biz_data where email = 'vishal@timelyai.com' limit 1")
    val = cur.fetchall()[0][0]
    print(time.time())
    return {"res": val}


@app.route('/sms_test')
def sms_test():
    return render_template('sms_test.html')


@app.route("/get_app/", methods=["GET"])
def chrone_get_app():
    response = get_ip_details(request)

    link = request.url
    hidden_field = ""
    for iter, key in enumerate(response.keys()):
        if(iter==0):
            hidden_field += f"{key}={response[key]}"
        else:
            hidden_field += f",{key}={response[key]}"

    response['link'] = link
    # response['headers'] = str(request.headers)

    response['created_at'] = str(datetime.utcnow())

    insert_sql('insta_link_click',response)
    conn.commit()

    if response['platform'].lower()=='iphone':
        return redirect("https://apps.apple.com/app/chrone/id1610101236")
    elif response['platform'].lower()=='android':
        return redirect("market://details?id=com.timelyai.timelyai")
    else:
        return redirect("https://chrone.app")

# @app.route('/random-test', methods=['POST'])
# def random_test():
#     data = request.json
#     print(request.user_agent.platform == None)
#     return {"OK":"OK"}

# @app.route("/<sp_name>/<ec_name>/", methods=["GET"])
# def referral(sp_name, ec_name):
#     link = request.url
#     response = get_ip_details(request)
#     print(link)
#     response['sp_name'] = sp_name
#     response['ec_name'] = ec_name

#     query = f"""
#     select sp_num, ec_num, identifier, title
#     from referral_link_mapping
#     where sp_name ilike '{sp_name}' and ec_name ilike '{ec_name}'
#     """

#     sql_query(query)
#     result = cur.fetchall()
#     if len(result)>0:
#         response['sp_num'] = result[0][0]
#         response['ec_num'] = result[0][1]
#         identifier = result[0][2]
#         title = result[0][3]

#     else:
#         query = f"""
#         select sp_num, identifier, title
#         from referral_link_mapping
#         where sp_name ilike '{sp_name}'
#         limit 1
#         """
#         sql_query(query)
#         result = cur.fetchall()

#         response['sp_num'] = result[0][0]
#         response['ec_num'] = '15168644715'
#         identifier = result[0][1]
#         title = result[0][2]

#     hidden_field = ""
#     for iter, key in enumerate(response.keys()):
#         if(iter==0):
#             hidden_field += f"{key}={response[key]}"
#         else:
#             hidden_field += f",{key}={response[key]}"

#     response['link'] = link
#     # response['headers'] = str(request.headers)

#     insert_sql('referral_link_views',response)
#     conn.commit()

#     return render_template('referral.html', hidden_field = hidden_field, identifier=identifier, title=title)


#################################### GMB Login ####################################

CLIENT_SECRETS_FILE = "client_secret.json"

# This OAuth 2.0 access scope allows for full read/write access to the
# authenticated user's account and requires requests to use an SSL connection.
GMB_GOOGLE_SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    "https://www.googleapis.com/auth/business.manage",
    'https://www.googleapis.com/auth/businesscommunications'
]

disc_acc = 'https://mybusinessaccountmanagement.googleapis.com/$discovery/rest?version=v1'
disc_info = 'https://mybusinessbusinessinformation.googleapis.com/$discovery/rest?version=v1'
disc_perf = 'https://businessprofileperformance.googleapis.com/$discovery/rest?version=v1'
disc_comm = 'https://businesscommunications.googleapis.com/$discovery/rest?version=v1&key=AIzaSyCJ7ZgL79XvCtAUCz8v1o8ZHeohoORA-tE'
disc_mybiz = "https://developers.google.com/static/my-business/samples/mybusiness_google_rest_v4p9.json"
disc_verify = 'https://mybusinessverifications.googleapis.com/$discovery/rest?version=v1'
disc_place = 'https://mybusinessplaceactions.googleapis.com/$discovery/rest?version=v1'
readMask="storeCode,regularHours,name,languageCode,title,phoneNumbers,categories,storefrontAddress,websiteUri,regularHours,specialHours,serviceArea,labels,adWordsLocationExtensions,latlng,openInfo,metadata,profile,relationshipData,moreHours"


def gmb_authorize():
    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=GMB_GOOGLE_SCOPES)

    # The URI created here must exactly match one of the authorized redirect URIs
    # for the OAuth 2.0 client, which you configured in the API Console. If this
    # value doesn't match an authorized URI, you will get a 'redirect_uri_mismatch'
    # error.
    flow.redirect_uri = url_for('gmb_oauth2callback', _external=True)
    # flow.redirect_uri = 'https://www.timelyai.com/oauth2callback'
    if 'prompt' not in session:
        authorization_url, state = flow.authorization_url(
            # Enable offline access so that you can refresh an access token without
            # re-prompting the user for permission. Recommended for web server apps.
            access_type='offline',
            prompt='consent',
            # Enable incremental authorization. Recommended as a best practice.
            include_granted_scopes='false')
    else:
        session.pop('prompt', None)
        authorization_url, state = flow.authorization_url(
        # Enable offline access so that you can refresh an access token without
        # re-prompting the user for permission. Recommended for web server apps.
        access_type='offline',
        prompt='consent',
        # Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes='true')


    # Store the state so the callback can verify the auth server response.
    session['state'] = state
    print("initial state: ",state)

    return authorization_url


def get_gmb_locs(credentials):
    # credentials=client.OAuth2Credentials.from_json(creds)
    biz_acc = gapd.build('mybusinessaccountmanagement', 'v1', credentials=credentials, discoveryServiceUrl=disc_acc)
    accs = biz_acc.accounts().list().execute()
    results = []
    readMask = 'name,title,latlng,metadata,storefrontAddress'
    cnt = 0
    biz_info = gapd.build('mybusinessbusinessinformation', 'v1', credentials=credentials, discoveryServiceUrl=disc_info)
    
    for i in range(len(accs)):
        locs = biz_info.accounts().locations().list(parent=accs['accounts'][i]['name'], readMask=readMask).execute()
        results.append(locs)
        cnt += len(locs)
    print(cnt)
    
    # for lc in results[0]['locations']:
    #     try:
    #         admins = biz_acc.locations().admins().create(parent=lc['name'], body = {'admin': 'ashish.verma@timelyai.com', 'role': 'MANAGER'}).execute()
    #     except Exception as e:
    #         print(e)
    #         pass

    if cnt == 1:
        print(locs)
        try:
            gbm_init(credentials, locs['locations'][0])
        except:
            pass
    return json.dumps({'locations': results})


def gbm_init(credentials, loc):
    client = gapd.build('businesscommunications', 'v1', credentials=credentials, discoveryServiceUrl=disc_comm)
    brand = client.brands().create(body = {'displayName': loc['title']}).execute()
    print(brand)
    hours = {
        "startTime": {
        "hours": 10,
        "minutes": 0,
        },
        "endTime": {
        "hours": 20,
        "minutes": 0,
        },
        "timeZone": 'America/Regina',
        "startDay": 'MONDAY',
        "endDay": 'SUNDAY'
        }
    agent_details = {
        "partnerName": 'timelyAI',
        "partnerEmailAddress": 'contact@timelyai.com',
        "brandContactName": 'Ashish Verma',
        "brandContactEmailAddress": 'contact@timelyai.com',
        "brandWebsiteUrl": "https://www.timelyai.com"
    }

    entry = [{"allowedEntryPoint": 'LOCATION'}]

    agent = client.brands().agents().create(parent = brand['name'], body = {'displayName': loc['title'], "businessMessagesAgent": {'defaultLocale': 'en', 'entryPointConfigs': entry, 'primaryAgentInteraction': {"interactionType": 'HUMAN', 'humanRepresentative': {'humanMessagingAvailability': {'hours': [hours]}}}, 'additionalAgentInteractions': [{"interactionType": 'BOT', 'botRepresentative': {'botMessagingAvailability': {'hours': [hours]}}}],'conversationalSettings': {'en' : {"welcomeMessage": {'text': 'Welcome! How may we help you?'}, "privacyPolicy": {'url': 'https://timelyai.com/privacy'}}}}}).execute()

    verify_agent = client.brands().agents().requestVerification(name = agent['name'], body = {'agentVerificationContact': agent_details}).execute()

    print(verify_agent)

    # agent_verif = client.brands().agents().getVerification(name = agent['name'] + '/verification').execute()

    launch_agent = client.brands().agents().requestLaunch(name = agent['name'], body = {'agentLaunch': {'businessMessages': {'launchDetails': {'LOCATION': {'entryPoint': 'LOCATION'}}}}}).execute()

    print(launch_agent)

    # agent_launch = client.brands().agents().getLaunch(name = agent_name + '/launch').execute()

    location = client.brands().locations().create(parent = brand['name'], body = {'agent': agent['name'], 'placeId': loc['metadata']['placeId'], 'defaultLocale': 'en'}).execute()

    verify_loc = client.brands().locations().requestVerification(name = location['name']).execute()

    print(verify_loc)

    try:
        launch_loc = client.brands().locations().requestLaunch(name = location['name']).execute()
    except:
        pass

    loc_verif = client.brands().locations().getLaunch(name = location['name'] + '/launch').execute()

    return json.dumps(loc_verif)


def save_data_to_session(credentials):
    session['credentials'] = credentials_to_dict(credentials)

    try:
        oauth2_client = gapd.build('oauth2', 'v2', credentials=credentials)
        profile_data = oauth2_client.userinfo().get().execute()

        email = profile_data['email']
        
        session['email'] = email
        if "given_name" in profile_data:
            session['first_name'] = profile_data['given_name']
        else:
            session["first_name"] = ''
        if "family_name" in profile_data:
            session['last_name'] = profile_data['family_name']
        else:
            session["last_name"] = ''
        if "picture" in profile_data:
            session['picture'] = profile_data["picture"]
        else:
            session['picture'] = ''
    except Exception as e:
        print("error while save_data_to_session: ", e)


@app.route('/gmb_oauth2callback')
def gmb_oauth2callback():
    try:
    # Specify the state when creating the flow in the callback so that it can
    # verified in the authorization server response.
        state = session['state']
        print("state: ",state)

        try:
            flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, scopes=GMB_GOOGLE_SCOPES, state=state)
            flow.redirect_uri = url_for('gmb_oauth2callback', _external=True)

            # Use the authorization server's response to fetch the OAuth 2.0 tokens.
            authorization_response = request.url
            flow.fetch_token(authorization_response=authorization_response)

            # Store credentials in the session.
            # ACTION ITEM: In a production app, you likely want to save these
            #              credentials in a persistent database instead.

            credentials = flow.credentials
        except Exception as e:
            print("gmb_oauth2callback error",e)
            return redirect(url_for('gmb_login', error="Please check all checkboxes at Google login", _external=True))
        
        credentials_dict = credentials_to_dict(credentials)
        print("/gmb_oauth2callback ", credentials_dict)
        session['credentials'] = credentials_dict

        save_data_to_session(credentials)

        try:
            email = session['email']

            print("/gmb_oauth2callback ", email)

            sql_query("SELECT location, profession FROM gmb_oauth WHERE email='"+email+"'")
            result = cur.fetchall()
            
            if len(result)==0:
                print("/gmb_oauth2callback new user flow")
                insert_sql("gmb_oauth", {
                    "email": email,
                    "oauth": credentials_dict,
                    "location": "",
                    "profession": "",
                    "share_report_link": str(uuid.uuid4())
                })
                conn.commit()
                try:
                    get_gmb_locs(credentials)
                except Exception as e:
                    print(e)
                    pass

                return redirect(url_for('gmb_onboard', _external=True))
            elif (result[0][0]=='' and result[0][1]=='') or (result[0][0]==None and result[0][1]==None):
                return redirect(url_for('gmb_onboard', _external=True))
            else:
                sql_query("UPDATE gmb_oauth SET oauth='"+json.dumps(credentials_dict)+"' WHERE email='"+email+"'")
                conn.commit()

                return redirect(url_for('gmb_sync', _external=True))
        except Exception as e:
            print("oauth2callback error: ", e)
            return redirect(url_for('gmb_login', _external=True))
    except Exception as e:
        print("oauth2callback error", e)
        return redirect(url_for('gmb_login', _external=True))


@app.route('/gmb_oauth2callback_app')
def gmb_oauth2callback_app():
    try:
    # Specify the state when creating the flow in the callback so that it can
    # verified in the authorization server response.
        state = session['state']
        print("state: ",state)

        try:
            flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, scopes=GMB_GOOGLE_SCOPES, state=state)
            flow.redirect_uri = url_for('gmb_oauth2callback_app', _external=True)

            # Use the authorization server's response to fetch the OAuth 2.0 tokens.
            authorization_response = request.url
            flow.fetch_token(authorization_response=authorization_response)

            credentials = flow.credentials
        except Exception as e:
            print("gmb_oauth2callback error",e)
            return "login exception", 200
        
        credentials_dict = credentials_to_dict(credentials)
        print("/gmb_oauth2callback_app ", credentials_dict)
        session['credentials'] = credentials_dict

        save_data_to_session(credentials)

        try:
            email = session['email']

            print("/gmb_oauth2callback_app", email)

            sql_query("SELECT location, profession FROM gmb_oauth WHERE email='"+email+"'")
            result = cur.fetchall()
            
            if len(result)==0:
                print("/gmb_oauth2callback_app new user flow")
                insert_sql("gmb_oauth", {
                    "email": email,
                    "oauth": credentials_dict,
                    "location": "",
                    "profession": "",
                    "share_report_link": str(uuid.uuid4())
                })
                conn.commit()
                try:
                    get_gmb_locs(credentials)
                except Exception as e:
                    print(e)
                    pass

                return redirect(f"chrone://close-browser?email={email}")
            elif (result[0][0]=='' and result[0][1]=='') or (result[0][0]==None and result[0][1]==None):
                return redirect(f"chrone://close-browser?email={email}")
            else:
                sql_query("UPDATE gmb_oauth SET oauth='"+json.dumps(credentials_dict)+"' WHERE email='"+email+"'")
                conn.commit()

                sql_query("SELECT a.biz_name, a.place_id, b.location FROM gmb_biz_data as a left join gmb_oauth as b on a.email=b.email WHERE a.email='"+email+"'")
                res = cur.fetchall()

                print("res", res)

                if len(res):
                    return redirect(f"chrone://close-browser?email={email}&biz_name={res[0][0]}&place_id={res[0][1]}")
                else:
                    return redirect(f"chrone://close-browser?email={email}")
        except Exception as e:
            print("oauth2callback_app error: ", e)
            return redirect(f"chrone://close-browser?error=login exception&msg={str(e)}")
    except Exception as e:
        print("oauth2callback_app error", e)
        return redirect(f"chrone://close-browser?error=login exception&msg={str(e)}")


def credentials_to_dict(credentials):
    return {'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }

@app.route('/emp/<name>')
def show_emp_profile(name):
    print("abc")
    response = get_ip_details(request)
    response['sp_name']=name
    response['page']=request.args['uid']
    response['link']=request.url
    insert_sql('referral_link_views',response)

    return redirect('https://www.chrone.app/')
    # return render_template('emp.html',name=name)

@app.route('/services', methods=['GET'])
def get_services():
    return render_template('service_form.html')

@app.route('/update_services', methods=['POST'])
def update_services():
    try:
        place_id = request.args['place_id']
        email = request.args['email']
        data = request.get_json()
        for srvc in data:
            insert_sql('biz_services',srvc)
        return {"msg": "success"}

    except Exception as e:
        print(e)
        return {"status": "error", "msg": "Invalid data"}

@app.route('/get_ss_category')
def get_ss_category():
    try:
        query = "SELECT distinct category FROM ss_service_cat"
        sql_query(query)
        result = cur.fetchall()
        cats = []
        for cat in result:
            cats.append(cat[0]) 
        print(cat)
        return cats
    except Exception as e:
        print(e)
        return []

@app.route('/get_ss_services/<cat>')
def get_ss_services(cat):
    try:
        query = f"SELECT service FROM ss_service_cat where category='{cat}'"
        sql_query(query)
        result = cur.fetchall()
        services = []
        for srvc in result:
            services.append(srvc[0]) 
        print(cat)
        return services
    except Exception as e:
        print(e)
        return []

@app.route('/login')
def gmb_login(error=''):
    if request.referrer is not None:
        referrer = request.referrer
    else:
        referrer = None
    return render_template('login.html', title="Login", error=error, referrer=referrer, gmb_authorize=gmb_authorize)


@app.route("/gmb_authorize_app")
def gmb_authorize_app():
    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=GMB_GOOGLE_SCOPES)

    # The URI created here must exactly match one of the authorized redirect URIs
    # for the OAuth 2.0 client, which you configured in the API Console. If this
    # value doesn't match an authorized URI, you will get a 'redirect_uri_mismatch'
    # error.
    flow.redirect_uri = url_for('gmb_oauth2callback_app', _external=True)
    # flow.redirect_uri = 'https://www.timelyai.com/oauth2callback'
    if 'prompt' not in session:
        authorization_url, state = flow.authorization_url(
            # Enable offline access so that you can refresh an access token without
            # re-prompting the user for permission. Recommended for web server apps.
            access_type='offline',
            prompt='consent',
            # Enable incremental authorization. Recommended as a best practice.
            include_granted_scopes='false')
    else:
        session.pop('prompt', None)
        authorization_url, state = flow.authorization_url(
        # Enable offline access so that you can refresh an access token without
        # re-prompting the user for permission. Recommended for web server apps.
        access_type='offline',
        prompt='consent',
        # Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes='true')


    # Store the state so the callback can verify the auth server response.
    session['state'] = state
    print("initial state: ",state)

    return redirect(authorization_url)


@app.route("/get_gbp_categories")
def get_gbp_categories():
    return {"categories": [
        "categories/gcid:body_piercing_shop",
        "categories/gcid:electrolysis_hair_removal_service",
        "categories/gcid:waxing_hair_removal_service",
        "categories/gcid:mobile_hairdresser",
        "categories/gcid:day_spa",
        "categories/gcid:spa",
        "categories/gcid:tattoo_artist",
        "categories/gcid:medical_spa",
        "categories/gcid:hair_salon",
        "categories/gcid:beauty_product_supplier",
        "categories/gcid:massage_therapist",
        "categories/gcid:beauty_salon",
        "categories/gcid:health_spa",
        "categories/gcid:makeup_artist",
        "categories/gcid:stylist",
        "categories/gcid:hair_replacement_service",
        "categories/gcid:wig_shop",
        "categories/gcid:tanning_studio",
        "categories/gcid:sauna",
        "categories/gcid:spa_and_health_club",
        "categories/gcid:nail_salon",
        "categories/gcid:hair_extension_technician",
        "categories/gcid:laser_hair_removal_service",
        "categories/gcid:beautician",
        "categories/gcid:thai_massage_therapist",
        "categories/gcid:facial_spa",
        "categories/gcid:permanent_make_up_clinic",
        "categories/gcid:tattoo_and_piercing_shop",
        "categories/gcid:unisex_hairdresser",
        "categories/gcid:massage_spa",
        "categories/gcid:sauna_club",
        "categories/gcid:eyebrow_bar",
        "categories/gcid:tattoo_shop",
        "categories/gcid:home_hairdresser",
        "categories/gcid:skin_care_clinic",
        "categories/gcid:eyelash_salon"
    ]}, 200


@app.route('/get_biz_locations')
def get_biz_locations():
    try:
        credentails = get_gapd_creds(request.args["email"])
        locations = get_bizinfo_location(credentails)

        verification_details = get_verification_details(credentails,locations)

        verified_locations = {'locations':[]}
        print(len(locations["locations"]))
        print(verification_details)

        for idx, v_dicts in enumerate(verification_details):
            if len(v_dicts) > 0:
                for v in v_dicts['verifications']:
                    if locations['locations'][idx]['name'] in v['name'] and v['state']=='COMPLETED':
                        verified_locations['locations'].append(locations['locations'][idx])
                        break
                    else:
                        pass
        # for v_dicts in verification_details:
        #     if len(v_dicts) > 0:
        #         for v in v_dicts['verifications']:
        #             for loc in locations['locations']:
        #                 if loc['name'] in v['name'] and v['state']=='COMPLETED':
        #                     verified_locations['locations'].append(loc)
        #                     break
        #                 else:
        #                     pass
            
        
        return verified_locations, 200
    except Exception as e:
        print(e)
        return "No locations found", 500


@app.route('/onboard')
def gmb_onboard():
    return render_template(
        'onboard.html',
        title="Welcome",
        email=session['email'],
        picture=session['picture'],
        first_name=session['first_name'],
        last_name=session['last_name']
    )


@app.route('/sync')
def gmb_sync():
    return render_template('gmb_sync.html')


@app.route('/get_sync_val')
def gmb_sync_val():
    print(session["email"])
    sql_query(f"SELECT biz_name, place_id FROM gmb_biz_data WHERE email='{session['email']}'")
    result = cur.fetchall()
    print("result: ", result)

    if len(result)==0:
        return redirect(url_for('gmb_login', _external=True))
    else:
        return {
                'email':session['email'],
                'picture':session['picture'],
                'first_name':session['first_name'],
                'last_name':session['last_name'],
                'place_id':result[0][1],
                'biz_name':result[0][0]
            }


@app.route('/set_profession')
def set_profession():
    email = request.args["email"]
    profession = request.args["profession"]
    location = request.args["location"]

    credentials = get_gapd_creds(email)
    biz_acc = gapd.build('mybusinessaccountmanagement', 'v1', credentials=credentials, discoveryServiceUrl=disc_acc)

    try:
        sql_query("UPDATE gmb_oauth SET profession='"+profession+"', location='"+location+"' WHERE email='"+email+"'")
        conn.commit()
        try:
            admins = biz_acc.locations().admins().create(parent=f"locations/{location}", body = {'admin': 'ashish.verma@timelyai.com', 'role': 'MANAGER'}).execute()
        except Exception as e:
            print(e)
            pass
    except Exception as e:
        print(e)
        print("profession: ", profession)
        print("location: ", location)
        print("email: ", email)

        locations = get_bizinfo_location(credentials)['locations']

        for loc in locations:
            if location in loc["name"]:
                try:
                    admins = biz_acc.locations().admins().create(parent=loc["name"], body = {'admin': 'ashish.verma@timelyai.com', 'role': 'MANAGER'}).execute()
                except Exception as e:
                    print(e)
                    pass

        sql_query("UPDATE gmb_oauth SET profession='"+profession+"', location='"+locations[0]['name'].split('/')[1]+"' WHERE email='"+email+"'")
        conn.commit()
        pass

    return {"result": 'Done'}, 200


def get_performance_metric(client, location, metric, days):
    end_date = datetime.today()
    start_date = end_date - timedelta(days=days)

    perf_metric = client.locations().getDailyMetricsTimeSeries(
        name = f"locations/{location}",
        dailyMetric = metric,
        dailyRange_endDate_day = end_date.day,
        dailyRange_endDate_month = end_date.month,
        dailyRange_endDate_year = end_date.year,
        dailyRange_startDate_day = start_date.day,
        dailyRange_startDate_month = start_date.month,
        dailyRange_startDate_year = start_date.year
    ).execute()

    return perf_metric


def get_gapd_creds(email):
    sql_query("SELECT oauth FROM gmb_oauth WHERE email='"+email+"'")
    res = cur.fetchall()
    print("res fetch",res)
    creds = json.loads(res[0][0])
    print("creds : ",type(creds))
    print("creds : ",creds)
    # creds = {"token": "ya29.A0AVA9y1saIoKj15EOXBwHKoyY7-ZHfck1soLlbE7yOTcMyTE6CIkvzg-KzEgmnySx0-FFyyPaFib7v7zMAd06dq48NlAheEoQ9OJh0o25e184oHz4IUlc8m9LFbR_g9k7w2hOQsGu_i_ZXXgj-PtcLftmK0GBaCgYKATASATASFQE65dr8BddbjWFZ_9wGfR5c21o7sw0163", "refresh_token": "1//0dQXCM_cRYSiWCgYIARAAGA0SNwF-L9Ir4t9hfdjD89ji6GDnDX7tRIh768rJmDvq1zdvm_DHZtayzlRH2FTTUbSxE5R-_05PYO8", "token_uri": "https://oauth2.googleapis.com/token", "client_id": "396419005169-0rlvknnf4suo2d8a95k91d35rn59cana.apps.googleusercontent.com", "client_secret": "RYgNazeJBJ5wh963v8QIfHL2", "scopes": ["openid", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/business.manage", "https://www.googleapis.com/auth/businesscommunications"]}
    credentials = google.oauth2.credentials.Credentials(**creds)
    return credentials

def get_profile_data(credentials):
    try:
        oauth2_client = gapd.build('oauth2', 'v2', credentials=credentials)
        profile_data = oauth2_client.userinfo().get().execute()
        return profile_data
    except Exception as e:
        return str(e), 200

def get_biz_info(credentials):
    try:
        biz_acc_client = gapd.build('mybusinessaccountmanagement', 'v1', credentials=credentials, discoveryServiceUrl=disc_acc)
        biz_info = biz_acc_client.accounts().list().execute()
        return biz_info
    except Exception as e:
        return str(e), 200

def get_bizinfo_location(credentials):
    biz_info_client = gapd.build('mybusinessbusinessinformation', 'v1', credentials=credentials, discoveryServiceUrl=disc_info)
    biz_info = get_biz_info(credentials)
    biz_info_location = biz_info_client.accounts().locations().list(parent=biz_info['accounts'][0]['name'], readMask=readMask, pageSize=100).execute()

    # print(biz_info_location)
    
    return biz_info_location


def gmb_update_profileData(credentials,name,updateData,updateMask):
    biz_info_client = gapd.build('mybusinessbusinessinformation', 'v1', credentials=credentials, discoveryServiceUrl=disc_info)
    updated_profileData = biz_info_client.locations().patch(name=name, body=updateData, updateMask=updateMask).execute()
    return updated_profileData

def get_location(credentials):
    biz_info_location = get_bizinfo_location(credentials)
    location_name = biz_info_location['locations'][0]['name']
    return location_name

def get_verification_details(credentials,locations):
    biz_verify_client = biz_verify_client = gapd.build('mybusinessverifications', 'v1', credentials=credentials, discoveryServiceUrl=disc_verify)
    verification_details = []
    for loc in locations['locations']:
        loc_verification_details = biz_verify_client.locations().verifications().list(parent=loc["name"]).execute()
        verification_details.append(loc_verification_details)
    
    return verification_details



def get_location_db(email):
    print(f"select location from gmb_oauth where email='{email}'")
    sql_query(f"select location from gmb_oauth where email='{email}'")
    location = cur.fetchall()[0][0]
    print("location",location)
    return location

def get_place_id_db(email):
    sql_query(f"select place_id from gmb_biz_data where email='{email}'")
    location = cur.fetchall()[0][0]
    return location

def get_business_perf_client(credentials):
    try:
        biz_perf_client = gapd.build('businessprofileperformance', 'v1', credentials=credentials, discoveryServiceUrl=disc_perf)
        return biz_perf_client
    except Exception as e:
        return str(e), 200

def get_mybiz_client(credentials):
    try:
        my_biz_client = gapd.build('mybusiness', 'v4', credentials=credentials, discoveryServiceUrl=disc_mybiz)
        return my_biz_client
    except Exception as e:
        return str(e), 200


months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

@app.route('/get-impressions')
def get_impression():
    print("impressions: ")
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    biz_perf_client = get_business_perf_client(credentials)

    print("location: "+str(location_name))

    biz_perf_dmap = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
        30
    )
    dates = [months[x["date"]["month"]-1]+' '+str(x["date"]["day"]) for x in biz_perf_dmap["timeSeries"]["datedValues"]]
    imp_1 = [x["value"] if "value" in x.keys() else 0 for x in biz_perf_dmap["timeSeries"]["datedValues"]]

    biz_perf_dsea = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
        30
    )
    imp_2 = [x["value"] if "value" in x.keys() else 0 for x in biz_perf_dsea["timeSeries"]["datedValues"]]

    biz_perf_mmap = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
        30
    )
    imp_3 = [x["value"] if "value" in x.keys() else 0 for x in biz_perf_mmap["timeSeries"]["datedValues"]]

    biz_perf_msea = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
        30
    )
    imp_4 = [x["value"] if "value" in x.keys() else 0 for x in biz_perf_msea["timeSeries"]["datedValues"]]

    impressions = [int(imp_1[i])+int(imp_2[i])+int(imp_3[i])+int(imp_4[i]) for i in range(len(dates))]
    
    response = {
        "impressions":impressions,
        "dates":dates
    }
    return response


def getFormattedTime(timeStr):
    dt = datetime.strptime(timeStr.split('.')[0], '%Y-%m-%dT%H:%M:%S')
    now = datetime.now()
    today = now.replace(microsecond=0)
    if dt == today:
        return "Today"
    elif dt == today-timedelta(days=1):
        return "Tommorow"
    else:
        return dt.strftime('%H:%M, %d %b %Y')


def reviews_data():
    credentials = get_gapd_creds(request.args["email"])
    my_biz_client = get_mybiz_client(credentials)
    biz_info = get_biz_info(credentials)
    location = get_location_db(request.args["email"])
    reviews = my_biz_client.accounts().locations().reviews().list(parent=f"{biz_info['accounts'][0]['name']}/locations/{location}", pageSize=50).execute()

    if "reviews" in reviews.keys():
        for review in reviews["reviews"]:
            review["updateTime"] = getFormattedTime(review['updateTime'])
            if "reviewReply" in review.keys():
                review["reviewReply"]["updateTime"] = getFormattedTime(review["reviewReply"]['updateTime'])
        
        response = {
            "reviews": reviews['reviews'],
            "rating": reviews['averageRating'],
            "review_count": reviews['totalReviewCount'],
        }
    else:
        response = {
            "reviews": [],
            "rating": 0,
            "review_count": 0,
        }
    
    return response


@app.route('/get-reviews')
def get_reviews_data():
    credentials = get_gapd_creds(request.args["email"])
    my_biz_client = get_mybiz_client(credentials)
    biz_info = get_biz_info(credentials)
    location = get_location_db(request.args["email"])
    reviews = my_biz_client.accounts().locations().reviews().list(parent=f"{biz_info['accounts'][0]['name']}/locations/{location}", pageSize=50).execute()

    if "reviews" in reviews.keys():
        for review in reviews["reviews"]:
            review["updateTime"] = getFormattedTime(review['updateTime'])
        final_reviews = reviews['reviews']

        if 'noReplyFilter' in request.args.keys():
            final_reviews = [x for x in reviews['reviews'] if 'reviewReply' not in x.keys()]

        response = {
            "reviews": final_reviews,
            "rating": reviews['averageRating'],
            "review_count": reviews['totalReviewCount'],
        }
    else:
        response = {
            "reviews": [],
            "rating": 0,
            "review_count": 0,
        }
    
    return response, 200


@app.route('/log-route-open', methods=['POST'])
def log_route_open():
    email = request.json["email"]
    route = request.json["route"]
    place_id = request.json["place_id"]
    biz_name = request.json["biz_name"]

    record = get_ip_details(request)
    record['biz_name'] = biz_name.replace("'", "''")
    record['place_id'] = place_id
    record['email'] = email
    record['path'] = route

    insert_sql("gmb_dashboard_tracking", record)
    conn.commit()

    return {
        "res": "logged"
    }


@app.route('/log-btn-click', methods=['POST'])
def log_btn_click():
    email = request.json["email"]
    route = request.json["route"]
    btn = request.json["btn"]
    place_id = request.json["place_id"]

    record = get_ip_details(request)
    record['place_id'] = place_id
    record['email'] = email
    record['route'] = route
    record['btn'] = btn
    record["timestamp"] = str(datetime.utcnow())

    insert_sql("gmb_dashboard_clicks_tracking", record)
    conn.commit()

    return {
        "res": "logged"
    }


@app.route('/search-rank', methods=['GET'])
def search_rank():
    data = request.args
    place_id = data["place_id"]
    keyword = data["keyword"]
    ismax = data["ismax"]
    return render_template('local_search_grid.html', place_id=place_id, keyword=keyword, ismax=ismax)


@app.route('/google/document-upload')
def document_upload():
    return render_template('document_upload.html')

@app.route('/google/account')
def show_profile():
    return render_template('profile.html')

@app.route('/show-profile', methods=['GET'])
def show_profile_info():
    email = request.args["email"]
    credentials = get_gapd_creds(email)
    biz_info = get_biz_info(credentials)
    biz_info_location = get_bizinfo_location(credentials)
    location_name = get_location_db(email)

    locations = biz_info_location['locations']

    location = None
    for loc in locations:
        if loc['name']==f'locations/{location_name}':
            location = loc
            break
    
    data = {}
    data['name']=biz_info['accounts'][0]['accountName']
    data['biz_name']=location['title']
    data['phone']=location['phoneNumbers']['primaryPhone'] if "primaryPhone" in location['phoneNumbers'].keys() else ""
    data['address']= location['storefrontAddress'] if "storefrontAddress" in location.keys() else ""
    data['description']=location['profile']['description'] if "description" in location['profile'].keys() else ""
    data['website']=location['websiteUri'] if "websiteUri" in location.keys() else ""
    # data['website']='https://github.com/'
    return {"data":data}


@app.route('/upload_biz_docs', methods=['POST'])
def upload_biz_docs():
    data = request.json

    print(data)
    data["timestamp"] = str(datetime.utcnow())

    insert_sql("gmb_biz_id_files", data)

    return {"res": "done"}



@app.route('/get-local-rank')
def get_local_rank():
    place_id = request.args["place_id"]
    keyword = request.args["keyword"].replace(" near me", "")
    ismax = request.args["ismax"]
    if(ismax=="1"):
        sql_query(f"select lat,lng,rank from gmb_sp_rank where place_id='{place_id}' and dateval=(select max(dateval) from gmb_sp_rank where place_id='{place_id}' and keyword='{keyword}') and keyword='{keyword}'")
    else:
        sql_query(f"select lat,lng,rank from gmb_sp_rank where place_id='{place_id}' and dateval=(select min(dateval) from gmb_sp_rank where place_id='{place_id}' and keyword='{keyword}') and keyword='{keyword}'")
    rank_data = cur.fetchall()

    sql_query(f"select latitude,longitude from gmb_biz_data where place_id='{place_id}'")
    lat, lng = cur.fetchall()[0]
    # # try:
    # sql_query(f"select min(searched_lat), latitude, max(searched_lat), min(searched_long), longitude, max(searched_long) from gmb_competitors where place_id='{request.args['place_id']}' and date='2022-08-25' and title='{request.args['biz_name']}' and keyword='{keyword}' and serp_place_id='{search_place_id}' group by 2, 5;")
    # coords = cur.fetchall()[0]

    # sql_query(f"select position, searched_lat, searched_long from gmb_competitors where place_id='{request.args['place_id']}' and date='2022-08-25' and title='{request.args['biz_name']}' and keyword='{keyword}' and serp_place_id='{search_place_id}' and searched_lat IN ('{coords[0]}','{coords[1]}','{coords[2]}') and searched_long IN ('{coords[3]}','{coords[4]}','{coords[5]}') ORDER BY searched_lat DESC, searched_long ASC;")
    # ranks_data = cur.fetchall()
    # print(ranks_data)

    # rank = ','.join([str(x[0]) for x in ranks_data])

    # return {"rank": rank, "lat": coords[1], "lng": coords[4]}, 200
    # except:
    #     rank = "23,45,43,21,2,3,54,78,55"
    # lat = "39.6998514"
    # lng = "-104.9373796"

    return {"rank_data": rank_data, "lat": lat, "lng": lng}, 200



@app.route('/link_preview', methods=['GET'])
def link_preview():
    record = get_ip_details(request)
    record['biz_name'] = ''
    record['place_id'] = ''
    record['email'] = ''
    record['path'] = request.url

    insert_sql("gmb_dashboard_tracking", record)
    return redirect("https://s3.ap-south-1.amazonaws.com/chrone.ai/images/chrone_logo.png")


@app.route('/google/photos')
def google_photos():
    return render_template("photos.html")


@app.route('/t/<path:path>/')
def website_templates_routing(path):
    if path[-1]!='/':
        path += '/'
    print(path)
    directory = f'{os.path.join(app.root_path, "static")}/{path.split("/")[0]}'
    path = '/'.join(path.split("/")[1:])+"index.html"
    print(directory)
    print(path)
    return send_from_directory(directory, path)

@app.route('/t0/<path:path>/')
def website_templates_routing_0(path):
    if path[-1]!='/':
        path += '/'
    print(path)
    directory = f'{os.path.join(app.root_path, "static")}/{path.split("/")[0]}'
    path = '/'.join(path.split("/")[1:])+"index.html"
    print(directory)
    print(path)
    return {"directory":directory, "path":path}



@app.route("/ses_notification")
def ses_notification():
    try:
        print(request.json)
        print("json")
    except:
        pass
    try:
        print(request.args)
        print("args")
    except:
        pass
    send_slack_notification("notification aaya hai", "slack-notifs-test", {})

    return {"Res": "done"}, 200


def mediaFormat(fileName):
    images = ["jpg", "gif", "png", "jpeg", "PNG", "heic", "HEIC", "Heic", "JPG", "JPEG"]
    videos = ["mp4", "3gp", "ogg", "mpeg", "mov", "MOV", "MP4", "MPEG"]

    fileNameList = fileName.split(".")

    if fileNameList[-1] in images:
        return 'PHOTO'
    elif fileNameList[-1] in videos:
        return 'VIDEO'
    else:
        return 'PHOTO'


def takeTime(picData):
    return picData["createTime"]


@app.route('/google/gmb-profile-images')
def gmb_profile_images():
    # try:
    print(request.args["email"])
    pageToken = request.args["pageToken"] if "pageToken" in request.args.keys() else None
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    mybiz_client = get_mybiz_client(credentials)
    biz_info = get_biz_info(credentials)

    if pageToken==None:
        resp = mybiz_client.accounts().locations().media().list(parent=biz_info['accounts'][0]['name']+"/locations/"+location_name, pageSize=2500).execute()
    else:
        resp = mybiz_client.accounts().locations().media().list(parent=biz_info['accounts'][0]['name']+"/locations/"+location_name, pageSize=2500, pageToken=pageToken).execute()

    s3_upload_files = {}

    aws_session = boto3.Session(
        aws_access_key_id=app_config.AWS_ACCESS_KEY,
        aws_secret_access_key=app_config.AWS_ACCESS_SECRET,
    )
    s3 = aws_session.resource("s3")

    s3_bucket = s3.Bucket('gmb-sp-image-bank')

    s3_objects = list(s3_bucket.objects.filter(Prefix=request.args["place_id"]))

    media_tracking = pd.read_sql_query(f'''
        SELECT
            *
        FROM
            gmb_media_tracking
        WHERE
            place_id='{request.args["place_id"]}'
            and used=false
    ''', conn)

    all_medias = []

    ## Checking S3 url in sourceUrl of all media files uploaded to GBP
    print(resp["mediaItems"])
    for gbp_pic in resp["mediaItems"]:
        if "sourceUrl" in gbp_pic.keys() and "https://gmb-sp-image-bank.s3.amazonaws.com/" in gbp_pic["sourceUrl"]:
            viewCount = 0
            try:
                viewCount = gbp_pic["insights"]["viewCount"]
            except:
                pass

            s3_upload_files[gbp_pic["sourceUrl"].replace("https://gmb-sp-image-bank.s3.amazonaws.com/", '')] = {"view" : viewCount, "name":gbp_pic["name"]}
            all_medias.append({
                **gbp_pic,
                "live": True,
                "source": "s3"
            })
        else:
            all_medias.append({
                **gbp_pic,
                "sourceUrl": gbp_pic["googleUrl"],
                "live": True,
                "source": "gbp"
            })

    for i in range(media_tracking.shape[0]):
        all_medias.append({
            "sourceUrl": f"https://gmb-sp-image-bank.s3.amazonaws.com/{media_tracking.iloc[0,0]}/{media_tracking.iloc[i,1]}",
            "createTime": media_tracking.iloc[i,2],
            "name": media_tracking.iloc[i,1],
            "failed": bool(media_tracking.iloc[i,7]),
            "used": bool(media_tracking.iloc[i,4]),
            "schueduled": media_tracking.iloc[i,6],
            "reason": media_tracking.iloc[i,5],
            "live": False,
            "source": "s3",
            "mediaFormat": mediaFormat(media_tracking.iloc[i,1])
        })
    
    print(all_medias)

    all_medias.sort(key=takeTime, reverse=True)

    return {"res": all_medias}, 200

def get_date_label(date_val):
    date_val = date_val-timedelta(hours=7)
    timenow = datetime.utcnow()-timedelta(hours=7)

    datediff = (timenow-date_val.replace(tzinfo=None)).days

    if(datediff>1):
        date_name = date_val.strftime("%b %d")
    else:
        if(datediff==0):
            date_name="Today"
        else:
            date_name="Yesterday"

    return date_name

@app.route('/google/gmb-profile-images-app', methods=['GET'])
def gmb_profile_images1():
    print(request.args["email"])
    place_id = request.args["place_id"]
    pageToken = request.args["pageToken"] if "pageToken" in request.args.keys() else None
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    mybiz_client = get_mybiz_client(credentials)
    biz_info = get_biz_info(credentials)

    if pageToken==None:
        resp = mybiz_client.accounts().locations().media().list(parent=biz_info['accounts'][0]['name']+"/locations/"+location_name, pageSize=2500).execute()
    else:
        resp = mybiz_client.accounts().locations().media().list(parent=biz_info['accounts'][0]['name']+"/locations/"+location_name, pageSize=2500, pageToken=pageToken).execute()

    s3_upload_files = {}

    aws_session = boto3.Session(
        aws_access_key_id=app_config.AWS_ACCESS_KEY,
        aws_secret_access_key=app_config.AWS_ACCESS_SECRET,
    )
    s3 = aws_session.resource("s3")

    s3_bucket = s3.Bucket('gmb-sp-image-bank')

    media_tracking = pd.read_sql_query(f'''
        SELECT
            *
        FROM
            gmb_media_tracking
        WHERE
            place_id='{request.args["place_id"]}'
            and used=false
    ''', conn)

    all_medias = []

    ## Checking S3 url in sourceUrl of all media files uploaded to GBP
    # print(resp["mediaItems"])
    for gbp_pic in resp["mediaItems"]:
        date_val = parser.parse(gbp_pic['createTime'])
        date_name = get_date_label(date_val)
        if "sourceUrl" in gbp_pic.keys() and "https://gmb-sp-image-bank.s3.amazonaws.com/" in gbp_pic["sourceUrl"]:
            viewCount = 0
            try:
                viewCount = gbp_pic["insights"]["viewCount"]
            except:
                pass

            s3_upload_files[gbp_pic["sourceUrl"].replace("https://gmb-sp-image-bank.s3.amazonaws.com/", '')] = {"view" : viewCount, "name":gbp_pic["name"]}
            all_medias.append({
                **gbp_pic,
                "live": True,
                "source": "s3",
                "date_name":date_name
            })
        else:
            all_medias.append({
                **gbp_pic,
                "sourceUrl": gbp_pic["googleUrl"],
                "live": True,
                "source": "gbp",
                "date_name":date_name
            })

    for i in range(media_tracking.shape[0]):
        
        date_val = parser.parse(media_tracking.iloc[i,2])
        date_name = get_date_label(date_val)

        all_medias.append({
            "sourceUrl": f"https://gmb-sp-image-bank.s3.amazonaws.com/{media_tracking.iloc[0,0]}/{media_tracking.iloc[i,1]}",
            "createTime": media_tracking.iloc[i,2],
            "date_name":date_name,
            "name": media_tracking.iloc[i,1],
            "failed": bool(media_tracking.iloc[i,7]),
            "used": bool(media_tracking.iloc[i,4]),
            "schueduled": media_tracking.iloc[i,6],
            "reason": media_tracking.iloc[i,5],
            "live": False,
            "source": "s3",
            "mediaFormat": mediaFormat(media_tracking.iloc[i,1])
        })

    s3_media_list = []
    try:
        bucket = s3.Bucket('gmb-sp-image-thumbnail-bank')
        objects_list = bucket.objects.filter(Prefix=place_id)
        for obj in objects_list:
            s3_media_list.append(obj.key)
    except Exception as e:
        s3_media_list = []

    for media in all_medias:
        if "googleUrl" in media.keys():
            media["s3SourceUrl"] = media["sourceUrl"]
            media["sourceUrl"] = media["googleUrl"].replace("=s0", "=s100")
        elif(media["source"]=="s3"):
            try:
                key = media["sourceUrl"].split("gmb-sp-image-bank.s3.amazonaws.com/")[1]
                if key in s3_media_list:
                    media["sourceUrl"] = media["sourceUrl"].replace("gmb-sp-image-bank", "gmb-sp-image-thumbnail-bank")
            except:
                pass

    all_medias.sort(key=takeTime, reverse=True)

    return {"res": all_medias}, 200


@app.route('/google/delete-gmb-profile-images', methods=["POST"])
def delete_gmb_profile_images():
    aws_session = boto3.Session(
        aws_access_key_id=app_config.AWS_ACCESS_KEY,
        aws_secret_access_key=app_config.AWS_ACCESS_SECRET,
    )
    s3 = aws_session.resource("s3")

    data = request.json
    media = data["media"]

    try:
        dele = s3.Object("gmb-sp-image-bank", media["obj_key"]).delete()
    except Exception as e:
        print("delete photo s3 exception: ", e)
    
    try:
        print(request.args["email"])
        credentials = get_gapd_creds(request.args["email"])
        mybiz_client = get_mybiz_client(credentials)

        print(media["name"])
        if media["name"]!="":
            resp = mybiz_client.accounts().locations().media().delete(name=media["name"]).execute() if media['name'] != '' else ''
            print(resp)
    except Exception as e:
        print("delete photo gbp exception: ", e)
    return {"res":"done"}


@app.route('/google/posts')
def google_posts():
    return render_template("posts.html")

@app.route('/google/newpost')
def new_google_post():
    return render_template("new_post.html")


@app.route('/google/gmb-posts')
def gmb_posts():
    print(request.args["email"])
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    mybiz_client = get_mybiz_client(credentials)
    biz_info = get_biz_info(credentials)

    resp = mybiz_client.accounts().locations().localPosts().list(parent=biz_info['accounts'][0]['name']+"/locations/"+location_name, pageSize=100).execute()

    print(resp)

    return resp


@app.route('/google/edit-gmb-post', methods=["POST"])
def edit_gmb_post():
    data = request.json
    print(data)
    new_post = data["new_post"]
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    mybiz_client = get_mybiz_client(credentials)

    print(new_post)

    resp = mybiz_client.accounts().locations().localPosts().patch(name=new_post["name"], updateMask="summary", body={
        "summary": new_post["summary"]
    }).execute()
    print(resp)

    return {"res":"done"}

@app.route('/google/new-gmb-post', methods=["POST"])
def new_gmb_post():
    data = request.json
    print(data)
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    mybiz_client = get_mybiz_client(credentials)
    biz_info = get_biz_info(credentials)

    media=data['media']
    file_type=""
    images = ["jpg", "gif", "png", "jpeg", "PNG", "heif", "HEIF", "JPG","JPEG"]
    videos = ["mp4", "3gp", "ogg", "mpeg", "mov", "MOV"]

    mediaforpost=[]
    for link in media:
        ext = link.split(".")[-1]
        if ext in images:
            file_type="PHOTO"
        elif ext in videos:
            file_type="VIDEO"
        else:
            pass
        med={
            "mediaFormat": file_type,
            "sourceUrl": link
        }
        mediaforpost.append(med)

    try:
        resp = mybiz_client.accounts().locations().localPosts().create(parent=biz_info['accounts'][0]['name']+"/locations/"+location_name, body={
           "languageCode":"",
           "summary":data['summary'],
           "callToAction":{
                "actionType":"CALL"
                },
           "media":mediaforpost,
           "topicType":"STANDARD", 
        }).execute()
        print(resp)

        return {"res":"done"}

    except Exception as e:
        print("ERROR : ",e)
        return{"res":"error"}

@app.route('/google/delete-gmb-post', methods=["POST"])
def delete_gmb_post():
    data = request.json
    print(data)
    new_post = data["name"]
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    mybiz_client = get_mybiz_client(credentials)

    resp = mybiz_client.accounts().locations().localPosts().delete(name=new_post).execute()
    print(resp)

    return {"res":"done"}



@app.route('/review_reply', methods=['GET'])
def review_reply():
    try:
        print(request.args["name"])
        print(request.args["reply"])
        credentials = get_gapd_creds(request.args["email"])
        my_biz_client = get_mybiz_client(credentials)
        reply_resp = my_biz_client.accounts().locations().reviews().updateReply(name=request.args["name"], body={
            "comment": request.args["reply"],
            "updateTime": datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
        }).execute()
        
        return reply_resp, 200
    except Exception as e:
        return str(e), 400


@app.route('/review_reply_delete', methods=['GET'])
def review_reply_delete():
    try:
        print(request.args["name"])
        credentials = get_gapd_creds(request.args["email"])
        my_biz_client = get_mybiz_client(credentials)
        reply_resp = my_biz_client.accounts().locations().reviews().deleteReply(name=request.args["name"]).execute()
        
        return "deleted", 200
    except Exception as e:
        return str(e), 400


@app.route('/review_reply_update', methods=['GET'])
def review_reply_update():
    try:
        print(request.args["name"])
        print(request.args["reply"])
        credentials = get_gapd_creds(request.args["email"])
        my_biz_client = get_mybiz_client(credentials)
        reply_resp = my_biz_client.accounts().locations().reviews().updateReply(name=request.args["name"], body={
            "comment": request.args["reply"],
            "updateTime": datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ")
        }).execute()
        
        return reply_resp, 200
    except Exception as e:
        return str(e), 400


@app.route('/get-call-direction-metrics')
def get_call_direction_metrics():
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    biz_perf_client = get_business_perf_client(credentials)

    biz_perf_call = get_performance_metric(
        biz_perf_client,
        location_name,
        "CALL_CLICKS",
        30
    )
    calls = 0
    for x in biz_perf_call["timeSeries"]["datedValues"]:
        if "value" in x.keys():
            calls += int(x['value'])
    
    biz_perf_direc = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_DIRECTION_REQUESTS",
        30
    )
    direction = 0
    for x in biz_perf_direc["timeSeries"]["datedValues"]:
        if "value" in x.keys():
            direction += int(x['value'])
    
    response = {
        "call_clicks": calls,
        "direction": direction
    }

    return response

@app.route('/get-website-conversation-metrics')
def get_website_conversation_metrics():
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    biz_perf_client = get_business_perf_client(credentials)

    biz_perf_website = get_performance_metric(
        biz_perf_client,
        location_name,
        "WEBSITE_CLICKS",
        30
    )
    web_clicks = 0
    for x in biz_perf_website["timeSeries"]["datedValues"]:
        if "value" in x.keys():
            web_clicks += int(x['value'])
    
    biz_perf_convo = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_CONVERSATIONS",
        30
    )
    conversations = 0
    for x in biz_perf_convo["timeSeries"]["datedValues"]:
        if "value" in x.keys():
            conversations += int(x['value'])
    
    response = {
        "website_clicks": web_clicks,
        "conversations": conversations
    }

    return response

def square_token(body):

    dev_url = "https://connect.squareupsandbox.com/oauth2/token"
    prod_url = "https://connect.squareup.com/oauth2/token"

    headers = {
    'Square-Version': '2021-05-13',
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", prod_url, headers=headers, data=json.dumps(body))
    return response


@app.route('/square_oauth')
def square_callback():

    print(request.args)
    authorization_code = request.args.get('code')
    
    if authorization_code is not None:
    # Provide the code in a request to the Obtain Token endpoint
        body = {}
        #dev
        # body['client_id'] = 'sandbox-sq0idb-hKNAZKImQsRGxFHgSf7ViA'
        # body['client_secret'] = 'sandbox-sq0csb-prWZ7T9IVe7TJT0y9Medfu9YTZJN7SXvz30B1UIy_9U' 

        #prod
        body['client_id'] = 'sq0idp-mmQBXYbCiMi1r02u9nBMmQ'
        body['client_secret'] = 'sq0csp-_5PgMu0vCgSwyRG7GRbEMrk_UFpCdRhcdZWNULKM7Rc'

        body['code'] = authorization_code
        body['grant_type'] = 'authorization_code'

        response = square_token(body)
        creds = response.json()

        if 'access_token' in creds.keys():

            square_oauth_data = {
                'email':'trying in sandbox',
                'access_token':creds['access_token'],
                'merchant_id':creds['merchant_id'],
                'refresh_token':creds['refresh_token'],
                'expires_at':creds['expires_at']
            }

            insert_sql('square_oauth',square_oauth_data)

            return redirect(url_for('gmb_google_dashboard', _external=True))
        
        else:
            print("Error in square authentication")
            return redirect(url_for('gmb_google_dashboard', _external=True))


    else: 
        print("Error in square_signup")
        return redirect(url_for('gmb_google_dashboard', _external=True))

# @app.route('/square_screen')
# def square_screen():
#     url = 'https://squareupsandbox.com/oauth2/authorize?client_id=sandbox-sq0idb-Sw3zLsPhWA_9wUppUcUgVw&scope=ITEMS_READ+MERCHANT_PROFILE_READ+PAYMENTS_WRITE_ADDITIONAL_RECIPIENTS+PAYMENTS_WRITE+PAYMENTS_READ&state=0499178ad6fdf1946bcb184aeae355cdbf90fed7faf60dde36e35de6d2d91b09'
#     return render_template('square_oauth.html', oauth_url=url)

@app.route('/get_square_oauth_url', methods=["GET"])
def square_oauth_url():
    # dev_url = f'https://squareupsandbox.com/oauth2/authorize?client_id=sandbox-sq0idb-hKNAZKImQsRGxFHgSf7ViA&scope=ITEMS_READ+ITEMS_WRITE+MERCHANT_PROFILE_READ+PAYMENTS_READ+APPOINTMENTS_ALL_READ+CUSTOMERS_READ+CUSTOMERS_WRITE+&state=0499178ad6fdf1946bcb184aeae355cdbf90fed7faf60dde36e35de6d2d91b09'
    prod_url = f'https://squareup.com/oauth2/authorize?client_id=sq0idp-mmQBXYbCiMi1r02u9nBMmQ&scope=ITEMS_READ+MERCHANT_PROFILE_READ+PAYMENTS_READ+PAYMENTS_WRITE+APPOINTMENTS_READ+APPOINTMENTS_ALL_READ+CUSTOMERS_READ+MERCHANT_PROFILE_READ+PAYMENTS_READ+PAYMENTS_WRITE+CUSTOMERS_READ+CUSTOMERS_WRITE+ITEMS_READ+ITEMS_WRITE+ORDERS_READ+ORDERS_WRITE+EMPLOYEES_READ+INVOICES_READ+INVOICES_WRITE+APPOINTMENTS_READ+APPOINTMENTS_WRITE+APPOINTMENTS_ALL_READ+APPOINTMENTS_BUSINESS_SETTINGS_READ+DEVELOPER_APPLICATION_WEBHOOKS_WRITE+DEVELOPER_APPLICATION_WEBHOOKS_READ&state=0499178ad6fdf1946bcb184aeae355cdbf90fed7faf60dde36e35de6d2d91b09'
    return {'url':prod_url}

@app.route('/dashboard')
def gmb_dashboard():
    return redirect(url_for('gmb_google_dashboard', _external=True))


@app.route('/google/dashboard')
def gmb_google_dashboard():
    return render_template('dashboard.html')


@app.route('/google/upload-pics')
def gmb_google_upload_pics():
    print("call for google/upload-pics")
    return render_template('upload_pics.html')


@app.route('/google/get-user-details', methods=["GET"])
def getUserDetails():
    place_id = request.args['place_id']

    sql_query(f'''
        SELECT
            a.email,
            a.biz_name,
            b.location
        FROM
            gmb_biz_data as a
            LEFT JOIN
            gmb_oauth as b
            ON a.email=b.email
        WHERE
            a.place_id = '{place_id}'
    ''')
    res = cur.fetchall()

    if(len(res)):
        return {
            "res": {
                "email": res[0][0],
                "biz_name": res[0][1],
                "location": res[0][2],
                "place_id": place_id
            }
        }
    else:
        return {
            "res": "Not a valid user"
        }


@app.route('/check_user')
def gmb_check_user():
    try:
        email = request.args['email']

        sql_query(f"SELECT biz_name, place_id FROM gmb_biz_data WHERE email='{email}'")
        result = cur.fetchall()
        print("result from gmb_biz_data: ", result)

        if len(result)==0:
            return {"res": "nouser"}

        return {"res": "user", "biz_name": result[0][0], "place_id": result[0][1]}
    except Exception as e:
        print("check user API error"+str(e))
        return redirect(url_for('gmb_login', _external=True))


@app.route('/reviews')
def gmb_reviews():
    return redirect(url_for('gmb_google_reviews', _external=True))


@app.route('/google/reviews')
def gmb_google_reviews():
    return render_template('reviews.html')


@app.route('/share_report_link')
def share_report_link():
    sql_query(f"select share_report_link from gmb_oauth where email='{request.args['email']}'")
    share_report_link = cur.fetchall()[0][0]
    print("share_report_link", share_report_link)

    return share_report_link, 200


@app.route('/report/<id>')
def shared_report(id):
    sql_query(f"SELECT email FROM gmb_oauth WHERE share_report_link='{id}'")
    email = cur.fetchall()[0][0]
    
    return render_template('shared_report.html', email=email)

@app.route('/get-review-url')
def get_review_url():
    location_name = get_location_db(request.args["email"])
    place_id = get_place_id_db(request.args["email"])

    credentials = get_gapd_creds(request.args["email"])
    biz_info_location = get_bizinfo_location(credentials)

    review_link = ""

    try:
        for biz_location in biz_info_location['locations']:
            if biz_location["name"].split("/")[1]==location_name:
                review_link = biz_location["metadata"]["newReviewUri"]
    except:
        review_link = f'https://search.google.com/local/reviews?placeid={place_id}'

    sql_query(f"SELECT review_link FROM review_link_mapping WHERE location_name='{location_name}'")
    result = cur.fetchall()

    if(len(result)==0 or str(result[0][0])=='nan'):
        print(f"INSERT INTO review_link_mapping (location_name, review_link) values ('{location_name}', '{review_link}')")
        sql_query(f"INSERT INTO review_link_mapping (location_name, review_link) values ('{location_name}', '{review_link}')")
        conn.commit()

    return f"https://chrone.work/review/{location_name}", 200


@app.route('/get-review-url-app')
def get_review_url_app():
    location_name = get_location_db(request.args["email"])
    place_id = get_place_id_db(request.args["email"])

    credentials = get_gapd_creds(request.args["email"])
    biz_info_location = get_bizinfo_location(credentials)

    review_link = ""

    try:
        for biz_location in biz_info_location['locations']:
            if biz_location["name"].split("/")[1]==location_name:
                review_link = biz_location["metadata"]["newReviewUri"]
    except:
        review_link = f'https://search.google.com/local/reviews?placeid={place_id}'

    sql_query(f"SELECT review_link FROM review_link_mapping WHERE location_name='{location_name}'")
    result = cur.fetchall()

    if(len(result)==0 or str(result[0][0])=='nan'):
        print(f"INSERT INTO review_link_mapping (location_name, review_link) values ('{location_name}', '{review_link}')")
        sql_query(f"INSERT INTO review_link_mapping (location_name, review_link) values ('{location_name}', '{review_link}')")
        conn.commit()

    return {"review_link": f"https://chrone.work/review/{location_name}"}, 200


@app.route('/get_invites/<email>')
def get_invites(email):
    sql_query(f"select phone, followed_link, message, review from gmb_sms_invites where email = '{email}'")
    return sql_multi_dict()


@app.route('/get_invites_count/<email>')
def get_invites_count(email):
    sql_query(f"select count(*) from gmb_sms_invites where email = '{email}'")
    res = cur.fetchall()
    count = res[0][0]
    return str(count), 200


@app.route('/set_insights_value')
def set_insights_value():
    try:
        data = request.json
        email = data["email"]
        del data['email']

        sql_query(f"DELETE FROM gmb_data WHERE email='{email}'")
        conn.commit()

        insert_sql("gmb_data", {"data": json.dumps(data), "email": email})

        return json.dumps(data), 200
    except Exception as e:
        return str(e), 200


@app.route('/set_review_link')
def set_review_link():
    try:
        data = request.json

        sql_query(f"DELETE FROM review_link_mapping WHERE sp='{data['sp']}'")
        conn.commit()

        insert_sql("review_link_mapping", data)

        return json.dumps(data), 200
    except Exception as e:
        return str(e), 200


def upload_image_worker(email, url, file_type, sleep_time):
    try:
        requests.post("https://fvz1cedwdf.execute-api.us-east-1.amazonaws.com/default/user-pics-upload-worker", json={
            "email": email,
            "url": url,
            "file_type": file_type,
            "sleep_time": sleep_time
        })
    except Exception as e:
        print("file upload error")
        print(e)

@app.route('/send_slack_notification_pics', methods=['POST'])
def send_slack_notification_upload_pics():
    print(request.json)

    try:
        # message = {
        #     "place_id": request.args["place_id"],
        #     "email": request.args["email"],
        #     "info": request.json["message"]
        # }

        mssg={
            "blocks":[
                {
                    "type":"header",
                    "text":{
                    "type": "plain_text",
				    "text": "Email : " +request.args["email"]+"\nPlace Id : "+request.args["place_id"]+"\nBiz Name : "+request.args["biz_name"]+"\nSource : "+request.json['source'] ,
                    },
                },
            ]
        }

        files=request.json["message"].split("||")

        mssg["blocks"].append({
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text":f"*Total {len(files)-1} files uploaded by user.* source"
                    }
                })

        for f in files:
            if f != "":
                msg={
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text":f
                    }
                }
                mssg["blocks"].append(msg)

        if "chrone.work" in request.url:
            send_slack_notification("", "gbp_notifications", blocks=mssg)
        else:
            send_slack_notification("", "slack-notifs-test", blocks=mssg)
        return {"res":"slack message sent yo"}

    except Exception as e:
        print("Error : ",e)
        return {"res": str(e)}


@app.route('/square_payment_webhook')
def square_payment_webhook():
    print(request.json)
    print(request.args)

    send_slack_notification("Square payment webhook recieved", "slack-notifs-test", {})

    return {"res": "ok"}, 200



@app.route('/calibrate_photo_batching', methods=['POST'])
def calibrate_photo_batching():
    print(request.json)

    place_id = request.args["place_id"]
    email = request.args["email"]
    biz_name = request.args["biz_name"]
    pics_uploaded = int(request.json["pics"])

    # df = pd.read_sql(f'''select
    #         pics_count,
    #         pics_count_cumsum,
    #         (current_date-date)/8 as week_num,
    #         a.place_id,
    #         c.biz_name
    #     from
    #         biz_profile_metrics as a
    #         left join
    #         gmb_retool_dead_profiles as b
    #         on a.place_id=b.place_id
    #         left join gmb_retool_onboarding_details as c
    #         on a.place_id=c.place_id
    #     where
    #         date > current_date-21
    #         and place_id='{place_id}'
    # ''', conn)

    # week0 = df[df["week_num"]==0].pics_count.sum()
    # week1 = df[df["week_num"]==1].pics_count.sum()
    # week2 = df[df["week_num"]==2].pics_count.sum()

    # if week0==0 or week1==0 or week2==0:
    #     print("bacthing yoyo")
    #     row_df = pd.read_sql(f"SELECT * FROM gmb_pic_velocity WHERE place_id='{place_id}'")
        
    #     if row_df.shape[0]:
    #         sql_query(f"UPDATE gmb_pic_velocity SET velocity='2' WHERE place_id='{place_id}'")
    #     else:
    #         sql_query(f"INSERT INTO gmb_pic_velocity (place_id, velocity) VALUES ('{place_id}', '2')")
    # else:
    #     sql_query(f"DELETE FROM gmb_pic_velocity WHERE place_id='{place_id}'")

    return {"res":"calibrated"}


@app.route('/upload_image', methods=['POST'])
def upload_image():
    try:
        email = request.json['email']
        urls = request.json['urls']
        aws_session = boto3.Session(
            aws_access_key_id=app_config.AWS_ACCESS_KEY,
            aws_secret_access_key=app_config.AWS_ACCESS_SECRET,
        )
        s3 = aws_session.client("s3")

        s3_bucket = s3.Bucket('gmb-sp-image-bank')

        objects = s3_bucket.objects.filter(Prefix=request.args["place_id"])
        
        sleep_time = 0
        for idx, url in enumerate(urls):
            if(idx%4==9):
                sleep_time+=10
            file_type = ""
            images = ["jpg", "gif", "png", "jpeg", "PNG", "heif", "HEIF"]
            videos = ["mp4", "3gp", "ogg", "mpeg", "mov"]

            type_ = url.split("?")
            type = type_[0].split(".")[-1]
            print(type)
            if type in images:
                file_type = 'PHOTO'
            if type in videos:
                file_type = 'VIDEO'
            print(file_type)
            print(url)

        #     threads = []

        #     t = threading.Thread(target=upload_image_worker, args=(email, url, file_type, sleep_time))
        #     t.start()
        #     threads.append(t)
        
        # for t in threads:
        #     t.join()
    except Exception as e:
        print("upload_image error", e)
        
    return {"result": "Done"}, 200


@app.route('/revoke-access', methods=['GET'])
def revoke_access():
    return render_template("revoke_access.html")

@app.route('/revoke-access-api', methods=['GET'])
def revoke_access_api():
    sql_query("DELETE FROM gmb_oauth WHERE email='fatime.elr@timelyai.com'")
    conn.commit()
    sql_query("DELETE FROM gmb_biz_data WHERE email='fatime.elr@timelyai.com'")
    conn.commit()

    return "Done"




@app.route('/review/<sp_name>')
def review_redirection(sp_name):
    if sp_name[-1] in ['.', ',', '/', '_', '-', '&']:
        sp_name = sp_name[:-1]
    try:
        try:
            sql_query(f"UPDATE gmb_sms_invites SET followed_link=followed_link+1 WHERE url ilike '%{request.full_path}'")
            conn.commit()
        except:
            pass
            
        biz_name = ''

        try:
            print("review link query", f"SELECT biz_name FROM gmb_oauth as a left join gmb_biz_data as b on a.email=b.email where a.location='{sp_name}'")
            sql_query(f"SELECT b.biz_name, b.email, b.place_id, b.latitude, b.longitude FROM gmb_oauth as a left join gmb_biz_data as b on a.email=b.email where a.location='{sp_name}'")
            biz_data = cur.fetchall()[0]
            biz_name = biz_data[0]
            biz_email = biz_data[1]
            biz_place_id = biz_data[2]
            biz_lat = biz_data[3]
            biz_long = biz_data[4]
        except:
            pass
            
        print("biz name")
        print(biz_name)

        print("Request URL: "+request.base_url)
        print("SP name: "+sp_name)
        response = get_ip_details(request)
        response['sp_name'] = sp_name

        response['sp_num'] = ""
        response['ec_num'] = ""

        link = request.url
        hidden_field = ""
        for iter, key in enumerate(response.keys()):
            if(iter==0):
                hidden_field += f"{key}={response[key]}"
            else:
                hidden_field += f",{key}={response[key]}"

        response['link'] = link
        response['headers'] = str(request.headers)
        response["page"] = "review"

        insert_sql('referral_link_views',response)
        conn.commit()

        sql_query(f"select distinct review_link from review_link_mapping where location_name='{sp_name}'")
        res = cur.fetchall()[0][0]

        if sp_name in [
            "17478507452948772940",
            "8265481142062235495",
            "12491788760633589424",
            "16951643808501020975",
            "12752102155818848457",
            "15413056915786930898",
            "7912065610373115691"
        ]:
            return render_template(
                "link_review_maps.html",
                url=request.url,
                biz_name=biz_name if biz_name!='' else "Google Review",
                link=f"https://www.google.com/maps/search/?api=1&query={biz_lat}%2C{biz_long}&query_place_id={biz_place_id}",
                biz_lat=biz_lat,
                biz_long=biz_long,
                fallback_link=res,
                biz_email=biz_email,
                biz_place_id=biz_place_id,
                title=f"Leave a review for {biz_name}" if biz_name!='' else "Leave a review"
            )
        return render_template(
            "link_review.html",
            url=request.url,
            res=res,
            biz_name=biz_name if biz_name!='' else "Google Review",
            title=f"Leave a review for {biz_name}" if biz_name!='' else "Leave a review"
        )
        #return redirect(res)
    except Exception as e:
        return str(e), 200

@app.route("/chart_test")
def chart_test():
    return render_template("chart_test.html", title="Chart Test")

@app.route('/get-top-keywords', methods=["POST"])
def get_keywords():
    data = request.json
    profession = data['profession']
    city = data['city']

    sql_query(f"select keyword from profession_keywords where profession ilike '{profession}'")
    search_keywords = cur.fetchall()
    search_query = []
    for sq in search_keywords:
        search_query.append(sq[0])
    
    if len(search_query)==0:
        search_query= ['salon near me']
    
    sql_query(f"select criteria_id from geotarget_criteria where name ilike '{city}'")
    criteria_id = cur.fetchall()[0][0]
    location_ids = [str(criteria_id)]
    
    keywords = ''#get_top_keywords(location_ids, search_query)

    return keywords



def get_biz_latlng(place_id):
    url = f"https://maps.googleapis.com/maps/api/geocode/json?place_id={place_id}&key={app_config.GEOCODE_API}"
    response = requests.get(url)
    data = response.json()
    try:
        location = data['results'][0]['geometry']['location']
        latitide = location['lat']
        longitude = location['lng']
    except:
        latitide = '0'
        longitude = '0'

    return latitide, longitude


def get_biz_city(place_id):
    url = f"https://maps.googleapis.com/maps/api/geocode/json?place_id={place_id}&key={app_config.GEOCODE_API}"
    response = requests.get(url)
    data = response.json()
    city = ''
    try:
        locality = [x for x in data["results"][0]["address_components"] if "locality" in x["types"]]
        if len(locality):
            city = locality[0]["long_name"]
    except:
        pass

    return city


@app.route('/save-biz-details')
def save_biz_details():
    data = request.args
    email = data['email']
    profession = data['profession']
    location_name = data['location']

    try:
        sql_query("UPDATE gmb_oauth SET profession='"+profession+"', location='"+location+"' WHERE email='"+email+"'")
        conn.commit()
    except:
        pass
    # sql_query(f"select email from gmb_biz_data where email='{email}'")
    # res = cur.fetchall()
    
    # if len(res)==0:
    credentials = get_gapd_creds(email)
    biz_info_location = get_bizinfo_location(credentials)
    
    locations = biz_info_location['locations']

    location = None
    for loc in locations:
        if loc['name']==f'locations/{location_name}':
            location = loc
            break
    
    if "metadata" in location.keys():
        if "placeId" in location["metadata"].keys():
            place_id = location['metadata']['placeId']
        else:
            place_id = "NA"
    else:
        place_id = "NA"


    try:
        city = get_biz_city(place_id)
        
        if city=='':
            if "storefrontAddress" in location.keys():
                city = location['storefrontAddress']['locality']
            else:
                city = "Phoenix"
    except:
        city = ''
    
    if "title" in location.keys():
        title = location['title']
    else:
        title = "NA"
    

    if 'latlng' in location.keys():
        latitude = location['latlng']['latitude']
        longitude = location['latlng']['longitude']
    else:
        latitude, longitude = get_biz_latlng(place_id)
    
    sql_query(f"select distinct email, place_id from gmb_biz_data where email='{email}' and place_id='{place_id}'")
    res = cur.fetchall()
    
    if len(res)==0:
        sql_payload = {
            "email": email,
            "biz_name": title.replace("'", "''"),
            "profession": profession,
            "city": city,
            "latitude": latitude,
            "longitude": longitude,
            "place_id": place_id
        }

        insert_sql('gmb_biz_data', sql_payload)
        conn.commit()

        message = f"""New Profile Onboarded

Email: {email}
Business Name: {title}
Profession: {profession}
        """

        if "chrone.ai" not in request.url and ":5000" not in request.url:
            send_slack_notification(message, 'onboarding-alert', blocks={})

        return sql_payload
    
    return {"OK":"OK"}

@app.route('/get-rank', methods=['GET','POST'])
def get_rank():
    data = request.args
    print(data)
    place_id = data['place_id']

    sql_query(f"""
    select 
        keyword
        , rank
        , search_volume 
    from 
        biz_google_rank 
    where 
        place_id='{place_id}' 
        and date=(select max(date) from biz_google_rank where place_id='{place_id}')
    """)
    res = cur.fetchall()
    # print(res)
    final_data = []
    for data in res:
        data_json = {
            "keyword":data[0],
            "rank":data[1],
            "search_volume":data[2]
        }

        final_data.append(data_json)
    return json.dumps(final_data)


@app.route('/invites')
def webchat():
    return render_template('invites.html')


@app.route('/schedule')
def schedule_calendly():
    response = get_ip_details(request)
    response['sp_name'] = ''

    response['sp_num'] = ""
    response['ec_num'] = ""

    response['link'] = request.url
    response['headers'] = str(request.headers)
    response["page"] = "schedule"

    insert_sql('referral_link_views',response)
    conn.commit()
    
    return redirect("https://calendly.com/chrone/google-business-listing-experiment")


def getProfileData(location_name, email):
    credentials = get_gapd_creds(email)
    biz_info_client = gapd.build('mybusinessbusinessinformation', 'v1', credentials=credentials, discoveryServiceUrl=disc_info)

    profileReadMask = "title,profile.description,categories.primaryCategory,phoneNumbers,storefrontAddress,regularHours"

    data = biz_info_client.locations().get(name=f"locations/{location_name}", readMask=profileReadMask).execute()
    return data


@app.route('/gmb_profile_data', methods=['GET'])
def get_gmb_profile_data():

    email = request.args['email']
    place_id = request.args['place_id']
    
    query = f"""
        select
            * 
        from
            gmb_profile_details
        where
            place_id='{place_id}'
    """

    sql_query(query)
    result = cur.fetchall()

    if len(result):
        print(result[0])

        profileData = {
            "name":result[0][1],
            "phone":result[0][2],
            "website":result[0][3],
            "appointment_link":result[0][4],
            "open_date":result[0][5],
            "description":result[0][6],
            "zipcode":result[0][7],
            "state":result[0][8],
            "city":result[0][9],
            "regular_hours":result[0][10],
            "address":result[0][11],
            "special_hours":result[0][12],
            "first_name":result[0][13],
            "last_name":result[0][14],
            "personal_number":result[0][15],
            "instagram_link":result[0][16],
            "facebook_link":result[0][17],
            "tiktok_link":result[0][18],
        }


        return profileData
    
    return {"res": "No data"}


@app.route('/gmb_update_profile_data', methods=['POST'])
def put_gmb_profile_data():
    print(request.json)

    send_slack_notification(f"Account data edited\nplace id: {request.args['place_id']}\nemail: {request.args['email']}", "customer-edit-account-data", blocks={})

    email = request.args['email']
    place_id = request.args['place_id']

    update_data = request.json

    update_sql('gmb_profile_details', update_data, place_id)
    # insert_sql('gmb_profile_details', update_data)

    return {"res": "done"}

@app.route('/google/services', methods=['GET'])
def gmb_services():
    return render_template('services.html')

def sp_website(url):
    website_details_query = f"Select * from gmb_website_details where url = '{url}'"
    sql_query(website_details_query)
    res = cur.fetchall()


    href_phone = res[0][8]

    href_phone = href_phone.replace("(","").replace(")","").replace(" ","").replace("-","")

    open_day = json.loads(res[0][6])
    close_day = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']

    if type(open_day) != str:
        for day in open_day:
            close_day.remove(day['day'])

    images = json.loads(res[0][12])
    if len(images) > 20:
        images = images[0:20]

    image_final = []
    for media in images:
        if media['url'].endswith("=s0"):
            media['url'] = media['url'].replace("=s0","=s400")
        image_final.append(media)

    reviews = json.loads(res[0][11])
    review_dict = {}
    for review in reviews:
        review_dict[review['name']] = review['review']

    new_dic = {}
    k = list(review_dict.items())
    k.sort(key=lambda x:len(x[1]),reverse=True)
    for i in k :
        new_dic.update({i[0]:i[1]})

    booking_link = res[0][14]

    data = {
        "place_id":res[0][1],
        "biz_name":res[0][3],
        "street":res[0][4],
        "working_hours":open_day,
        "phone_number":res[0][8],
        "biz_description":res[0][9],
        "services":json.loads(res[0][10]),
        "testimonials":new_dic,
        "images":image_final,
        "banner_img":res[0][17],
        "cat_img":res[0][16],
        "close_day":close_day,
        "href_phone":href_phone,
        "hero_title":res[0][18],
        "hero_desc":res[0][19],
        "booking_text":res[0][20],
        "booking_link":booking_link
        }
    
    return data

# @app.route('/sp_website', methods=['GET'])
# def render_sp_website():
#     data = sp_website("bs_beauty_bar.com")
#     return render_template('sp_web.html', data=data)


def getServicesData(location_name, email):
    # sql_query(f"SELECT services FROM gmb_profile_services WHERE email='{email}' ORDER BY datetime DESC LIMIT 1")
    # result = cur.fetchall()

    credentials = get_gapd_creds(email)
    biz_info_client = gapd.build('mybusinessbusinessinformation', 'v1', credentials=credentials, discoveryServiceUrl=disc_info)

    profileReadMask = "serviceItems"
    print(f"locations/{location_name}")
    data = biz_info_client.locations().get(name=f"locations/{location_name}", readMask=profileReadMask).execute()
    if len(data) == 0:
        return {}

    return data['serviceItems']


@app.route('/gmb_services_data', methods=['GET'])
def get_gmb_services_data():
    email = request.args['email']
    place_id = request.args['place_id']

    location_name = get_location_db(request.args["email"])
    
    servicesData = getServicesData(location_name, email)

    return {
        "servicesData": servicesData
    }


@app.route('/gmb_services_data', methods=['POST'])
def put_gmb_services_data():
    print(request.json)

    email = request.args['email']
    place_id = request.args['place_id']
    
    # profileData = getProfileData(location_name, email)

    insert_sql('gmb_profile_services', {
        "place_id": place_id,
        "email": email,
        "datetime": datetime.utcnow().isoformat().split('.')[0],
        "services": json.dumps(request.json)
    })

    return {"res": "done"}


@app.route('/google/create', methods=['GET'])
def gmb_create():
    return render_template('create_listing.html')


@app.route('/google/create/listing', methods=['POST'])
def gmb_create_listing():
    return {"res": "created"}


@app.route('/google/verify/listing', methods=['POST'])
def gmb_verify_listing():
    return {"res": "verified"}


@app.route('/google/create-gbp', methods=['GET'])
def gmb_create_gbp():
    return render_template('create_listing_gbp.html')


@app.route('/google/create-gbp/listing', methods=['POST'])
def gmb_create_gbp_listing():
    print(request.json)

    sql_query(f"SELECt * FROM styleseat_gbp_mapping WHERE url='{request.json['styleseat-link']}'")
    res = cur.fetchall()[0]
    print(res)

    res = list(res)

    oauth_dict = {"token": "ya29.a0AVA9y1sSk1JKHDRW9hlPvn4uaPEoGSAi_Zt7zKVte38SgnBphKO0VHuTk8CKcaoC7LYRlb9k6SNK9DWfJ9DCNntCyCRvmiWP3u98XYzG7dlJ5X7K-K7YRs3Nekw88-twPlL75fZU9Psgwah955momPJn8kBCaCgYKATASAQASFQE65dr8ka-M_ARmzix5jwJV8615Ng0163", "refresh_token": "1//0dyhMKl3v1QduCgYIARAAGA0SNwF-L9IrD-gLSeL-x6Ik9rwl2ndTo3XqMKU-VrkAhryukzTC6RNefW_76H7LdH1Icwohuv4WC7g", "token_uri": "https://oauth2.googleapis.com/token", "client_id": "396419005169-0rlvknnf4suo2d8a95k91d35rn59cana.apps.googleusercontent.com", "client_secret": "RYgNazeJBJ5wh963v8QIfHL2", "scopes": ["openid", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/business.manage", "https://www.googleapis.com/auth/businesscommunications"]}
    credentials = google.oauth2.credentials.Credentials(**oauth_dict)

    biz_acc_client = gapd.build('mybusinessaccountmanagement', 'v1', credentials=credentials, discoveryServiceUrl=disc_acc)
    biz_verify_client = gapd.build('mybusinessverifications', 'v1', credentials=credentials, discoveryServiceUrl=disc_verify)
    biz_info_client = gapd.build('mybusinessbusinessinformation', 'v1', credentials=credentials, discoveryServiceUrl=disc_info)

    biz_info = biz_acc_client.accounts().list().execute()

    ## Create a new location
    response = biz_info_client.accounts().locations().create(parent=biz_info['accounts'][0]['name'], body={
        "name": f"locations/{res[1]}",
        "title": res[1],
        "languageCode": "en",
        "phoneNumbers": {
            "primaryPhone": f"+1 {res[2][:3]} {res[2][3:6]} {res[2][6:]}"
        },
        "categories": {
            "primaryCategory": {
            "name": "categories/gcid:beauty_salon",
            "displayName": "Beauty Parlour"
            }
        },
        "storefrontAddress": {
            "revision": 0,
            "regionCode": "US",
            "languageCode": "en",
            "postalCode": res[5],
            "addressLines": [res[4]],
            "administrativeArea": res[6],
            "locality": res[4]
        },
        "latlng": {
            "latitude": res[3].split(',')[0],
            "longitude": res[3].split(',')[1]
        }
    }).execute()

    print(response)

    name = response["name"]

    response = biz_verify_client.locations().fetchVerificationOptions(location=name, body={
      "languageCode": "en"
    }).execute()

    print(response)

    response = biz_verify_client.locations().verify(name=name, body={
        "method": "SMS",
        "languageCode": "en",
        "phoneNumber": f"+1 {res[2][:3]}-{res[2][3:6]}-{res[2][6:]}"
    }).execute()
    print(response)

    verification_token = response['verification']['name']

    sql_query(f"UPDATE styleseat_gbp_mapping SET location_name='{name}', verified='{False}', verification_token='{verification_token}' WHERE url='{request.json['styleseat-link']}'")
    conn.commit()

    return {"res": "created"}


# @app.route('/profile', methods=['GET'])
# def profile():
#     return render_template('profile.html')

@app.route('/google/verify-gbp/listing', methods=['POST'])
def gmb_verify_gbp_listing():
    print(request.json)

    sql_query(f"SELECT * FROM styleseat_gbp_mapping WHERE url='{request.json['styleseat-link']}'")
    res = cur.fetchall()[0]
    print(res)

    oauth_dict = {"token": "ya29.a0AVA9y1sSk1JKHDRW9hlPvn4uaPEoGSAi_Zt7zKVte38SgnBphKO0VHuTk8CKcaoC7LYRlb9k6SNK9DWfJ9DCNntCyCRvmiWP3u98XYzG7dlJ5X7K-K7YRs3Nekw88-twPlL75fZU9Psgwah955momPJn8kBCaCgYKATASAQASFQE65dr8ka-M_ARmzix5jwJV8615Ng0163", "refresh_token": "1//0dyhMKl3v1QduCgYIARAAGA0SNwF-L9IrD-gLSeL-x6Ik9rwl2ndTo3XqMKU-VrkAhryukzTC6RNefW_76H7LdH1Icwohuv4WC7g", "token_uri": "https://oauth2.googleapis.com/token", "client_id": "396419005169-0rlvknnf4suo2d8a95k91d35rn59cana.apps.googleusercontent.com", "client_secret": "RYgNazeJBJ5wh963v8QIfHL2", "scopes": ["openid", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/business.manage", "https://www.googleapis.com/auth/businesscommunications"]}
    credentials = google.oauth2.credentials.Credentials(**oauth_dict)

    biz_verify_client = gapd.build('mybusinessverifications', 'v1', credentials=credentials, discoveryServiceUrl=disc_verify)

    response = biz_verify_client.locations().verifications().complete(name=res[10], body={
        "pin": request.json['otp']
    }).execute()
    print(response)

    sql_query(f"UPDATE styleseat_gbp_mapping SET verified='{True}' WHERE url='{request.json['styleseat-link']}'")
    conn.commit()

    return {"profile": "verified"}


@app.route('/google/own-gbp/listing', methods=['POST'])
def gmb_own_gbp_listing():
    print(request.json)

    try:
        sql_query(f"SELECT * FROM styleseat_gbp_mapping WHERE url='{request.json['styleseat-link']}'")
        res = cur.fetchall()[0]
        print(res)

        oauth_dict = {"token": "ya29.a0AVA9y1sSk1JKHDRW9hlPvn4uaPEoGSAi_Zt7zKVte38SgnBphKO0VHuTk8CKcaoC7LYRlb9k6SNK9DWfJ9DCNntCyCRvmiWP3u98XYzG7dlJ5X7K-K7YRs3Nekw88-twPlL75fZU9Psgwah955momPJn8kBCaCgYKATASAQASFQE65dr8ka-M_ARmzix5jwJV8615Ng0163", "refresh_token": "1//0dyhMKl3v1QduCgYIARAAGA0SNwF-L9IrD-gLSeL-x6Ik9rwl2ndTo3XqMKU-VrkAhryukzTC6RNefW_76H7LdH1Icwohuv4WC7g", "token_uri": "https://oauth2.googleapis.com/token", "client_id": "396419005169-0rlvknnf4suo2d8a95k91d35rn59cana.apps.googleusercontent.com", "client_secret": "RYgNazeJBJ5wh963v8QIfHL2", "scopes": ["openid", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/business.manage", "https://www.googleapis.com/auth/businesscommunications"]}
        credentials = google.oauth2.credentials.Credentials(**oauth_dict)


        biz_acc = gapd.build('mybusinessaccountmanagement', 'v1', credentials=credentials, discoveryServiceUrl=disc_acc)

        try:
            admins = biz_acc.locations().admins().create(parent=res[8], body = {'admin': request.json["email"], 'role': 'OWNER'}).execute()
        except Exception as e:
            print("admin oenwrship error: "+str(e))
        
        try:
            manager = biz_acc.locations().admins().create(parent=res[8], body = {'admin': 'shambhav@timelyai.com', 'role': 'MANAGER'}).execute()
        except Exception as e:
            print("manager oenwrship error: "+str(e))

        sql_query(f"UPDATE styleseat_gbp_mapping SET verified='{True}', email='{request.json['email']}' WHERE url='{request.json['styleseat-link']}'")
        conn.commit()
    except Exception as e:
        print(e)

    return {"res": "owned"}


def getReviewsTargetValue(val):
    if val<=10:
        return 100
    elif val<=50:
        return 150
    else:
        return math.ceil(val/100.0)*250

def getPhotosTargetValue(val):
    if val<=10:
        return 100
    elif val<=50:
        return 150
    else:
        return math.ceil(val/100.0)*250


def profile_details(credentials, place_id, lc):
    # try:
    biz_acc = gapd.build('mybusinessaccountmanagement', 'v1', credentials=credentials, discoveryServiceUrl=disc_acc)
    accs = biz_acc.accounts().list().execute()
    i = 0
    
    biz_place_actions = gapd.build('mybusinessplaceactions', 'v1', credentials=credentials, discoveryServiceUrl=disc_place)
    biz_info = gapd.build('mybusinessbusinessinformation', 'v1', credentials=credentials, discoveryServiceUrl=disc_info)
    results = biz_info.accounts().locations().list(parent=accs['accounts'][i]['name'], readMask=readMask, pageSize=100).execute()
    first_name = ''
    last_name = ''
    oauth2_client = gapd.build('oauth2', 'v2', credentials=credentials)
    userinfo = oauth2_client.userinfo().get().execute()

    if "given_name" in userinfo:
        first_name = userinfo["given_name"]
        first_name = first_name.replace("'","''")
    if "family_name" in userinfo:
        last_name = userinfo["family_name"]
    
    # except Exception as e:
    #     print(f"Exception: {e}")
    #     return {}
    
    print("results", results)
    row = {}

    row["first_name"] = first_name
    row["last_name"] = last_name

    if 'locations' in results:
        for profileData in results['locations']:
            print(profileData["name"], "locations/"+lc, profileData["name"]=="locations/"+lc)
            if (profileData["name"]=="locations/"+lc):
                print("location matched!!!")
                latitude, longitude = get_biz_latlng(place_id)
                
                if(latitude=='0' and longitude=='0'):
                    try:
                        latitude, longitude = get_biz_latlng(profileData['serviceArea']['places']['placeInfos'][0]['placeId'])
                    except:
                        pass
                
                row["lat"] = latitude
                row["lng"] = longitude
                # row['city'] = city

                row["open_date"] = ""
                if "openingDate" in profileData["openInfo"].keys():
                    row["open_date"] = str(profileData["openInfo"]["openingDate"]).replace("'", "''")

                row["appointment_link"] = ''
                try:
                    actionlinks = biz_place_actions.locations().placeActionLinks().list(parent=profileData["name"]).execute()

                    if "placeActionLinks" in actionlinks.keys():
                        for link in actionlinks["placeActionLinks"]:
                            if link["placeActionType"]=='APPOINTMENT':
                                row["appointment_link"] = link["uri"]
                except:
                    pass
                
                        
                row['website'] = ""
                if "websiteUri" in profileData.keys():
                    row['website'] = profileData["websiteUri"]
            
                
                row['biz_name'] = ""
                if "title" in profileData.keys():
                    row['biz_name'] = profileData["title"].replace("'", "''")
                
                row['description'] = ""
                if "description" in profileData.keys():
                    row['description'] = profileData["profile"]["description"].replace("'", "''")
                
                row['phone'] = ""
                if "phoneNumbers" in profileData.keys() and "primaryPhone" in profileData["phoneNumbers"].keys():
                    row['phone'] = profileData["phoneNumbers"]["primaryPhone"]
                    
                if 'storefrontAddress' not in profileData:
                    row['address'] = ''
                    row['zipcode'] = ''
                    row['state'] = ''
                else:
                    if "addressLines" in profileData['storefrontAddress'].keys():
                        row['address'] = ''.join(profileData['storefrontAddress']['addressLines']).replace("'", "''")
                    else:
                        row['address'] = ''
                    
                    if "postalCode" in profileData['storefrontAddress'].keys():
                        row['zipcode'] = profileData['storefrontAddress']['postalCode']
                    else:
                        row['zipcode'] = ''
                    
                    if "administrativeArea" in profileData['storefrontAddress'].keys():
                        row['state'] = profileData['storefrontAddress']['administrativeArea'].replace("'", "''")
                    else:
                        row['state'] = ''
                
                if "regular_hours" in profileData.keys():
                    row["regular_hours"] = json.dumps(profileData["regularHours"]["periods"])
                else:
                    row["regular_hours"] = ''
                
                if "special_hours" in profileData.keys():
                    row["special_hours"] = json.dumps(profileData["specialHours"])
                else:
                    row["special_hours"] = ''
                
                categories = []
                if "categories" in profileData.keys():
                    if "primaryCategory" in profileData["categories"].keys():
                        row['primary_category'] = profileData["categories"]["primaryCategory"]['displayName']
                    if "additionalCategories" in profileData["categories"].keys():
                        for cat in profileData["categories"]["additionalCategories"]:
                            categories.append(cat['displayName'])
                        row['additional_categories'] = ', '.join(categories)
            else:
                print("location not matched")
                pass
        print(row)

        return row
    else:
        return {"res": "no way"}


@app.route('/biz_profile_completion', methods=['GET'])
def biz_profile_completion():
    place_id=request.args['place_id']
    email=request.args['email']
    print(place_id)

    # creds = get_gapd_creds(email)
    # location = get_location_db(email)

    # profile_data = profile_details(creds, place_id, location)

    query =f"""
        select
            *
        from
            gmb_profile_details
        where
            place_id='{place_id}'
    """
    sql_query(query)
    
    desc = cur.description
    column_names = [col[0] for col in desc]
    result = cur.fetchall()
    if len(result):
        data = [dict(zip(column_names, row)) for row in result]
    else:
        data = [dict(zip(column_names, row)) for row in [""]*len(column_names)]

    print("res from gmb_profile_details",data[0])

    return data[0], 200


@app.route('/update_comms_table', methods=['POST'])
def update_comms_table():
    data = request.json
    insert_msg = insert_sql('gmb_retool_contacts',data)
    return {"res":insert_msg}

@app.route('/account-complete', methods=['GET'])
def profile_complete():
    return render_template("profile_completion.html")


@app.route('/set-profile-details', methods=['GET'])
def set_profile_details():
    place_id=request.args['place_id']
    email=request.args['email']
    location_name=request.args['location']
    print(place_id)

    creds = get_gapd_creds(email)
    biz_info_location = get_bizinfo_location(creds)
    
    locations = biz_info_location['locations']

    location = None
    for loc in locations:
        if loc['name']==f'locations/{location_name}':
            location = loc
            break

    # location = get_location_db(email)

    print("profile data 1")
    profile_data = profile_details(creds, place_id, location["name"].split("/")[1])
    print("profile data 2")

    if "lat" in profile_data.keys():
        del profile_data["lat"]
    if "lng" in profile_data.keys():
        del profile_data["lng"]
    profile_data["place_id"] = place_id
    print("profile_data", profile_data)

    insert_sql("gmb_profile_details", profile_data)

    return {"res": "Done"}, 200


@app.route('/get_place_id_info', methods=['GET'])
def get_place_id_info():
    place_id = request.args['place_id']
    info = get_biz_latlng(place_id)
    print(info)
    return info

@app.route('/biz_profile_completion_formdata', methods=['POST'])
def profile_completion_formdata():

    place_id = request.args['place_id']
    email = request.args['email']

    print(request.args)

    # creds = get_gapd_creds(email)
    # location_name = get_location_db(email)
    # location = get_bizinfo_location(creds)

    # print(location)

    # data = json.loads(request.data)
    # date = datetime.utcnow().strftime(f"%Y%m%dT%H%M%SZ")
    # print(date)    

    # for key,val in data.items():
    #     if val=="":
    #         continue
    #     else:
    #         print(f"{key} : {val}")
    #         update_data={
    #             "place_id":place_id,
    #             "field":key,
    #             "value":val,
    #             "datetime":date
    #         }

    #         print(update_data)
    #         check = insert_sql("gmb_sp_profile_completion_form_data",update_data)
    #         print(check)

    return {"res":"ok"}

# '''     
# phone, description, website, title, appointmentLink, openDate

# if key == 'phone':
#     updateData={}
#     updateData['phoneNumbers'] = {'primaryPhone': f"{val[0:5]} {val[5:10]}"}
#     updateMask = "phoneNumbers"
#     updated_profile = gmb_update_profileData(creds,f"locations/{location_name}",updateData,updateMask)
#     print(updated_profile)

# if key == 'description':
#     updateData={}
#     updateData['profile'] = {'description': val}
#     updateMask ="profile.description"
#     updated_profile = gmb_update_profileData(creds,f"locations/{location_name}",updateData,updateMask)
#     print(updated_profile)

# if key == 'website':
#     updateData={}
#     updateData['websiteUri'] = val
#     updateMask ="websiteUri"
#     updated_profile = gmb_update_profileData(creds,f"locations/{location_name}",updateData,updateMask)
#     print(updated_profile)

# if key == 'title':
#     updateData={}
#     updateData['title'] = val
#     updateMask ="title"
#     updated_profile = gmb_update_profileData(creds,f"locations/{location_name}",updateData,updateMask)
#     print(updated_profile)

# if key == 'openDate':
#     updateData={
#         "openInfo":{
#             "openingDate":{
#                 "year": val.split("-")[0],
#                 "month": val.split("-")[1],
#                 "day": val.split("-")[2]
#         }}}
#     updateMask ="openInfo.openingDate"
#     updated_profile = gmb_update_profileData(creds,f"locations/{location_name}",updateData,updateMask)
#     print(updated_profile)

# if key == 'zipcode':
#     updateData={
#         "storefrontAddress":{
#             "postalCode":val
#         }
#     }
#     updateMask ="storefrontAddress.postalCode"
#     updated_profile = gmb_update_profileData(creds,f"locations/{location_name}",updateData,updateMask)
#     print(updated_profile)

# if key == 'state':
#     updateData={
#         "storefrontAddress":{
#             "administrativeArea":val
#         }
#     }
#     updateMask ="storefrontAddress.administrativeArea"
#     updated_profile = gmb_update_profileData(creds,f"locations/{location_name}",updateData,updateMask)
#     print(updated_profile)

# if key == 'appointmentLink':
#     updateData={
#     "uri": val,
#     "placeActionType": 'APPOINTMENT',
#     }
#     biz_place_actions = gapd.build('mybusinessplaceactions', 'v1', credentials=creds, discoveryServiceUrl=disc_place)
#     actionlinks = biz_place_actions.locations().placeActionLinks().list(parent=f"locations/{location_name}").execute()
#     actionlinks = biz_place_actions.locations().placeActionLinks().create(parent=f"locations/{location_name}", body=updateData).execute()
#     print(actionlinks)

# return {"res":"ok"}
# '''

@app.route('/biz-review-target', methods=['GET'])
def biz_review_target():
    data = request.args
    place_id = data['place_id']
    email = data['email']
    
    query = f"select review_target, review_intimation, photos_target from biz_target where place_id = '{place_id}'"
    sql_query(query)
    res = cur.fetchall()

    if len(res)>0:
        response = {
            "review_target": res[0][0],
            "invite_target": res[0][1],
            "photos_target": res[0][2]
        }
    else:
        data = reviews_data()
        review_target = getReviewsTargetValue(data["review_count"])
        invite_target = review_target*3
        photos_target = getPhotosTargetValue(0)
        response = {
            "review_target": review_target,
            "invite_target": invite_target,
            "photos_target": photos_target
        }

        biz_target = {
            "place_id": place_id,
            "review_target": review_target,
            "review_intimation": invite_target,
            "photos_target": photos_target
        }
        insert_sql("biz_target", biz_target)
        conn.commit()

    return response


@app.route('/send-sms', methods=['POST'])
def send_sms():
    data = request.json
    print(data)
    biz_name = data['biz_name']
    message = data['message']
    recipient = data['recipient']
    email = data['email']
    url = data['url']+"?uid="+recipient

    account_sid = app_config.TWILIO_SID
    auth_token = app_config.TWILIO_TOKEN
    client = Client(account_sid, auth_token)

    twilio_message = client.messages.create(
        body=message,
        from_=app_config.TWILIO_NUMBER,
        to="+"+recipient
    )

    twilio_review_msg = client.messages.create(
        body=url,
        from_=app_config.TWILIO_NUMBER,
        to="+"+recipient
    )

    now = datetime.now().isoformat()

    data_json = {
        "name":biz_name.replace("'", "''"),
        "phone":recipient,
        "followed_link":0,
        "message":message,
        "url":url,
        "timestamp": now,
        "email": email
    }

    insert_sql("gmb_sms_invites", data_json)
    conn.commit()

    return {"status":"messages sent"}

@app.route('/check-matv', methods=['POST'])
def check_matv():
    sql_query("select * from gbp_sp_rank limit 10")
    res = cur.fetchall()
    print(res)
    return json.dumps("OK")

@app.route('/website/<source>')
def chrone_website(source):
    response = get_ip_details(request)
    response['link'] = request.url
    response['source'] = source

    insert_sql('website_views',response)
    conn.commit()

    return redirect("https://www.chrone.app")

@app.route('/gmb_onboarding_mail', methods=['POST'])
def gmb_ob_mail():
    data = request.json
    email = data['email']
    credentials = get_gapd_creds(email)
    oauth2_client = gapd.build('oauth2', 'v2', credentials=credentials)
    info = oauth2_client.userinfo().get().execute()
    
    try:
        sp_name = info['name'].split(" ")[0]
    except:
        sp_name = ""
    
    subject = "Welcome to Chrone"
    body = mail_bodies.onboarding_mail.format(sp_name=sp_name)
    try:
        html_mail(subject,body,email)
        return {"status":"mail sent"}
    except Exception as e:
        return {"error":str(e)}

@app.route('/gmb_onboarding_sms', methods=['POST'])
def gmb_ob_sms():
    data = request.json
    email = data['email']
    location_name = data['location']
    credentials = get_gapd_creds(email)
    biz_info_location = get_bizinfo_location(credentials)

    locations = biz_info_location['locations']
    oauth2_client = gapd.build('oauth2', 'v2', credentials=credentials)
    info = oauth2_client.userinfo().get().execute()
    
    try:
        sp_name = info['name'].split(" ")[0]
    except:
        sp_name = ""
    
    
    # url = "https://chrone.work/dashboard"
    phone=None
    for loc in locations:
        if loc['name']==f'locations/{location_name}':
            if "phoneNumbers" in loc.keys():
                phone = loc['phoneNumbers']['primaryPhone'].replace(" ","").replace("(","").replace(")","").replace("+","").replace("-","")
                biz_name = loc['title']
                sms_text = f"""Hi there, thanks for visiting {biz_name}. If you liked my service, please leave me a 5-star review using the link below. Do mention the service. https://chrone.work/review/{location_name}"""
                # print(sms_text)
                # print(json.dumps(loc, indent=2))
                # phone = loc['phoneNumbers']['primaryPhone'].replace(" ","").translate("()+-")
                # phone = phone[-10:]
                # print(phone)
                # phone = "5168644715"
            break

    try:
        if phone:
            print(phone)
            send_twilio_sms(sms_text, phone)
            # send_twilio_sms(url, phone)
            return {"status":f"SMS sent to {phone}"}
        else:
            return {"status":"biz number not found"}
    except Exception as e:
        return {"error":str(e)}

@app.route('/sms-text')
def sms_text():
    return render_template("sms_text.html")

@app.route('/track-link', methods=['POST'])
def track_link():
    data = request.json

    data_json = {
        "url": data['url'],
        "trackable_link": data['trackable_link']
    }

    status = insert_sql('chrone_links', data_json)
    if status=='Success':
        return {"status":"trackable link created"}
    else:
        return {"error":status}


@app.route('/r/<link>')
def redirect_link(link):
    print(request.referrer)
    response = get_ip_details(request)
    response['link'] = request.url
    # response['headers'] = str(request.headers)
    
    query = f"select distinct url from chrone_links where trackable_link='{link}' limit 1"
    sql_query(query)
    res = cur.fetchall()

    if len(res):
        main_url = res[0][0]

        if "http" not in main_url:
            main_url = "https://"+main_url

        response["page"] = main_url

        insert_sql('referral_link_views',response)

        return redirect(main_url)
    else:
        response["page"] = ""

        insert_sql('referral_link_views',response)
        return {"res": "Invalid URL"}

@app.route('/reviews-pubsub', methods=['POST'])
def reviews_pubsub():
    data = json.loads(request.data.decode('utf-8'))
    send_slack_notification(str(data), "review-webhook", blocks={})
    print("Review Webhook:"+str(data))
    return 'OK', 200

@app.route('/webflow-form', methods=['GET','POST'])
def webflow_form():
    data = request.json
    print(data)

    if len(data.keys())>3:
        return {"demand":2000}, 200
    else:
        return {"error":"no data"}, 200

@app.route("/feedback/<sp_name>", methods=["GET"])
def referral(sp_name):
    link = request.url
    response = get_ip_details(request)

    hidden_field = f"sp_name={sp_name},link={link}"
    # for iter, key in enumerate(response.keys()):
    #     if(iter==0):
    #         hidden_field += f"{key}={response[key]}"
    #     else:
    #         hidden_field += f",{key}={response[key]}"

    response['link'] = link
    response['page'] = "feedback"
    # response['headers'] = str(request.headers)

    insert_sql('referral_link_views',response)
    conn.commit()

    return render_template('feedback.html', hidden_field = hidden_field, title="Chrone Feedback")

def send_retool_comms(data):
    biz_name = data['biz_name']
    intent = data['intent']
    primary_msg = data['primary_message']
    secondary_message = data['secondary_message']
    email = data['email']
    phone = data['phone']
    message_type = data['type']

    insert_json = {
        "biz_name":biz_name.replace("'","''"),
        "type":message_type.replace("'","''"),
        "intent":intent.replace("'","''"),
        "primary_message":primary_msg.replace("'","''"),
        "secondary_message":secondary_message.replace("'","''") if secondary_message!="" else None,
    }

    if "place_id" in data.keys():
        place_id = data['place_id']
        insert_json['place_id'] = place_id
    # print(data)
    
    if (message_type=='text' and phone!=""):
        response1 = send_twilio_sms(primary_msg, phone)
        if secondary_message != "":
            response2 = send_twilio_sms(secondary_message, phone)
        insert_sql("gmb_retool_comms_raw", insert_json)
    
    elif (message_type=='email' and email!=""):
        # print("email")
        subject = intent
        body = f"""<pre><span style="font-size: 16px; font-family: sans-serif">{primary_msg}</span></pre>"""
        html_mail(subject,body,email,cc=True)
        insert_sql("gmb_retool_comms_raw", insert_json)
    
    elif (message_type=='call'):
        insert_sql("gmb_retool_comms_raw", insert_json)
    
    elif (message_type=='fatime_text'):
        insert_sql("gmb_retool_comms_raw", insert_json)

@app.route('/retool-comms', methods=['POST'])
def retool_comms():
    data = request.json
    send_retool_comms(data)
    return {"ok":"ok"}


@app.route('/retool-bulk-comms', methods=["POST"])
def retool_bulk_comms():
    data_raw = request.data
    if data_raw != '':
        datas = json.loads(data_raw)

        contact_missing_msg = """Message Send Failure: 
Business Name: {biz_name}
Reason: Contact details doesn't exist"""
        
        try:
            for data in datas:
                biz_name = data['biz_name']
                place_id = data['place_id']
                sql_query(f"""
                    select distinct
                        phone,
                        gbd.email
                    from 
                        gmb_profile_details gpd
                        
                        inner join gmb_retool_onboarding_details god
                        on gpd.place_id = god.place_id
                        
                        inner join gmb_biz_data gbd
                        on gpd.place_id = gbd.place_id
                    where
                        gbd.email not in ('ashish.verma@timelyai.com','fatime.elr@timelyai.com')
                        and gpd.place_id= '{place_id.replace("'","''")}'
                """)
                res = cur.fetchall()

                if(len(res)>0):
                    phone = res[0][0]
                    email = res[0][1]

                    data_json = {
                        "intent":data['intent'],
                        "biz_name":data['biz_name'],
                        "primary_message":data['primary_message'],
                        "secondary_message":data['secondary_message'],
                        "email":email,
                        "phone":str(phone),
                        "type":data['type'],
                        "place_id":place_id
                    }

                    # print(data_json)
                    send_retool_comms(data_json)
                else:
                    send_slack_notification(
                        contact_missing_msg.format(biz_name=biz_name), 
                        "bulk-comms-alerts", blocks={}
                    )
        except Exception as e:
            print(str(e))
            send_slack_notification(
                f"Error: {str(e)}", 
                "bulk-comms-alerts", blocks={}
            )

    return {"OK":"OK"}

@app.route('/health_check')
def aws_ebs_health_check():
    return {"OK":"OK"}, 200

@app.route('/insert-sql', methods=['POST'])
def insert_sql_api():
    data = json.loads(request.data.decode('utf-8'))
    table_name = data['table']
    data_json = data['data_json']
    try:
        insert_sql(table_name, data_json)
        return {"status":"success"}, 200
    except Exception as e:
        return {"error":str(e)}, 200

@app.route('/send-twilio-sms', methods=['POST'])
def send_twilio_sms1():
    data = request.json
    message = data['message']
    recipient = data['recipient']
    slack_channel = "website-lead-gen-submission"
    # slack_channel = "slack-notifs-test"

    if recipient == "12194550912":
        try:
            cust_name = message.split("Name: ")[1].split("\n")[0]
            cust_number = message.split("Customer Number: ")[1]
            masked_name = f"{cust_name[:1]}******{cust_name[-1:]}"
            masked_number = f"{cust_number[:3]}******{cust_number[-3:]}"
            message = f"Customer Name: {masked_name}\nCustomer Number: {masked_number}"
            sql_query(f"SELECT biz_name, email FROM gmb_retool_contacts WHERE phone='{recipient}'")
            biz_data = cur.fetchall()
            if len(biz_data) and len(biz_data[0])==2:
                send_slack_notification(f"{message}\nrecipient: {recipient}\nbiz_name: {biz_data[0][0]}\nemail: {biz_data[0][1]}\n\nactual name: {cust_name}\nactual number: {cust_number}", slack_channel)
            else:
                send_slack_notification(f"{message}\nrecipient: {recipient}\n\nactual name: {cust_name}\nactual number: {cust_number}", slack_channel)
        except:
            send_slack_notification(f"{message}\nrecipient: {recipient}\n\nactual name: {cust_name}\nactual number: {cust_number}", slack_channel)

        try:
            response = send_twilio_sms(message+"\nPlease reach out to your Chrone SPOC to unmask the customer details.", recipient)
            return {"status":"success","response":response}, 200
        except Exception as e:
            return {"status":"error", "response":str(e)}, 200
    else:
        try:
            sql_query(f"SELECT biz_name, email FROM gmb_retool_contacts WHERE phone='{recipient}'")
            biz_data = cur.fetchall()
            if len(biz_data) and len(biz_data[0])==2:
                send_slack_notification(f"{message}\nrecipient: {recipient}\nbiz_name: {biz_data[0][0]}\nemail: {biz_data[0][1]}", slack_channel)
            else:
                send_slack_notification(f"{message}\nrecipient: {recipient}", slack_channel)
        except:
            send_slack_notification(f"{message}\nrecipient: {recipient}", slack_channel)

        try:
            response = send_twilio_sms(message, recipient)
            return {"status":"success","response":response}, 200
        except Exception as e:
            return {"status":"error", "response":str(e)}, 200



@app.route('/send-leadgen-sms', methods=['POST'])
def send_leadgen_sms():
    print('chrone.work/send-leadgen-sms')
    try:
        data = request.json
        user_ipdata = get_ip_details(request)
        try:
            cust_type = data['cust_type']
            if cust_type=="Not Selected":
                message = 'Hurray! You have a booking request from a client on your website built by Chrone:\n'
            else:
                message = f'Hurray! You have a booking request from a {cust_type} on your website built by Chrone:\n'
        except:
            message = 'Hurray! You have a booking request from a client on your website built by Chrone:\n'


        form_data = json.loads(data['form_data'])
        for i in form_data:
            message = message + i + ' - ' + form_data[i] + '\n'
        try:
            print(data["booking_link"])
            message = message + "We have sent them your booking link, but please reach out to them immediately to fix a time and confirm the request."
        except:
            message = message + "Please reach out to them immediately to fix a time and confirm the request."

        recipient = data['recipient']
        print(message, recipient)
        try:
            message_cust = "Hi! Your booking request with "+data["bizname"]+" has been received. To make a confirmed booking immediately, you can call us at - "+recipient+"\nor book by clicking here - \n"+data["booking_link"]
        except:
            message_cust = "Hi! Your booking request with "+data["bizname"]+" has been received. To make a confirmed booking immediately, you can call us at - "+recipient
    
        try:
            if user_ipdata['country'] == 'India': send_slack_notification(f"Tester-\nSP message:\n{message}\n\nCust message:\n{message_cust}\nbiz_name: {data['bizname']}\n\nCustomer Type: {cust_type}", "website_leadgen_testing")
            else: send_slack_notification(f"Production-\nSP message:\n{message}\n\nCust message:\n{message_cust}\nbiz_name: {data['bizname']}\n\nCustomer Type: {cust_type}", "website-lead-gen-submission")
        except:
            send_slack_notification(f"Exception:\nSP message:\n{message}\n\nCust message:\n{message_cust}\n\nCustomer Type: {cust_type}", "website_leadgen_testing")
    
        print(message_cust)
        if user_ipdata['country'] == 'India': response = send_twilio_sms(message, '14805267612')
        else:
            response = send_twilio_sms(message, recipient)
            if data['place_id'] == "ChIJ2SrKL6UNK4cRIhpzYRI1aMU": response = send_twilio_sms(message, '16025504001')
            data['biz_name'] = data['bizname'].replace("'", "''")
            try : 
                print(data['place_id'])
                insert_sql('sp_website_form', {'biz_name':data['bizname'], 'place_id':data['place_id'], 'form_data':form_data, 'customer_type':cust_type})
            except: insert_sql('sp_website_form', {'biz_name':data['bizname'], 'form_data':form_data, 'customer_type':cust_type})
        response_cust = send_twilio_sms(message_cust, data["cust_number"])
        return {"status":"success","response":response}, 200
    except Exception as e:
        send_slack_notification(f"Error Encountered while sending message:\n{str(e)}", "website_leadgen_testing")
        return {"status":"error", "response":str(e)}, 200

def all_posts_data(location_name, account_name, credentials):
    my_biz = gapd.build('mybusiness', 'v4', credentials=credentials, discoveryServiceUrl=disc_mybiz)

    pagetoken = ''
    all_posts = []

    for i in range(10):
        if i==0:
            posts_resp = my_biz.accounts().locations().localPosts().list(parent=account_name+'/locations/'+location_name, pageSize=2500).execute()
        elif pagetoken==None:
            break
        else:
            posts_resp = my_biz.accounts().locations().localPosts().list(parent=account_name+'/locations/'+location_name, pageToken=pagetoken, pageSize=2500).execute()
        
        if "localPosts" in posts_resp.keys():
            reviews = posts_resp["localPosts"]
            
            all_posts.extend(reviews)
        
        if "nextPageToken" in posts_resp.keys():
            pagetoken=posts_resp["nextPageToken"]
        else:
            pagetoken=None
    posts_df = pd.DataFrame()
    if len(all_posts)>0:
        posts_df = pd.DataFrame(all_posts)
        posts_df.sort_values(by='createTime', ignore_index=True, inplace=True)
        posts_df['date'] = posts_df['createTime'].str.split("T").str[0]

        posts_pivot = posts_df.pivot_table(index='date', values="searchUrl", aggfunc='count').reset_index()
        posts_pivot['posts_count'] = posts_pivot['searchUrl']
        posts_pivot['posts_count_cumsum'] = posts_pivot['posts_count'].cumsum()

        return posts_pivot[['date','posts_count','posts_count_cumsum']]
    
    return posts_df

def get_onboarding_date(email):
    sql_query(f"""
        select distinct
            god.place_id,
            ob_date::date
        from
            gmb_biz_data gbd
            inner join gmb_retool_onboarding_details god
            on god.place_id = gbd.place_id
        where
            email ilike '{email}'
    """)

    res = cur.fetchall()
    print(res)
    if len(res)>0:
        ob_date=res[0][1]
    else:
        ob_date=date(2022,8,1)
    
    return ob_date


@app.route('/google/get-profile-views')
def get_gmb_stats():
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    biz_perf_client = get_business_perf_client(credentials)
    # biz_info = get_biz_info(credentials)

    ob_date = get_onboarding_date(request.args["email"])

    print(ob_date)

    no_days = (datetime.utcnow().date()-ob_date).days

    biz_perf_dmap = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
        no_days
    )
    dates = [months[x["date"]["month"]-1]+' '+str(x["date"]["day"]) for x in biz_perf_dmap["timeSeries"]["datedValues"]]
    imp_1 = [x["value"] if "value" in x.keys() else 0 for x in biz_perf_dmap["timeSeries"]["datedValues"]]

    biz_perf_dsea = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
        no_days
    )
    imp_2 = [x["value"] if "value" in x.keys() else 0 for x in biz_perf_dsea["timeSeries"]["datedValues"]]

    biz_perf_mmap = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
        no_days
    )
    imp_3 = [x["value"] if "value" in x.keys() else 0 for x in biz_perf_mmap["timeSeries"]["datedValues"]]

    biz_perf_msea = get_performance_metric(
        biz_perf_client,
        location_name,
        "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
        no_days
    )
    imp_4 = [x["value"] if "value" in x.keys() else 0 for x in biz_perf_msea["timeSeries"]["datedValues"]]

    impressions = [int(imp_1[i])+int(imp_2[i])+int(imp_3[i])+int(imp_4[i]) for i in range(len(dates))]

    # print(sum(impressions))

    return {"profile_views":sum(impressions)}

@app.route('/google/get-post-count')
def get_post_count():
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    # biz_perf_client = get_business_perf_client(credentials)
    biz_info = get_biz_info(credentials)

    ob_date = get_onboarding_date(request.args["email"])

    posts_df = all_posts_data(location_name, biz_info['accounts'][0]['name'], credentials)

    print(str(ob_date))

    if len(posts_df)!=0:
        post_count = sum(posts_df[posts_df['date']>=str(ob_date)]['posts_count'])
    else:
        post_count = 0
    
    return {"post_count":post_count}

def report_insights(client, account, location, metric, start_date, end_date):
    print(start_date)

    t1 = time.time()
    result = client.accounts().locations().reportInsights(name=account, body={
      "locationNames": account+'/'+location,
      "basicRequest": {
        "metricRequests": [
          {
            "metric": metric,
            "options": [
              "AGGREGATED_DAILY"
            ]
          }
        ],
        "timeRange": {
          "startTime": start_date.strftime("%Y-%m-%dT00:00:00Z"),
          "endTime": end_date.strftime("%Y-%m-%dT00:00:00Z")
        }
      }
    }).execute()

    t2 = time.time()

    print(t2-t1)

    report_df = pd.DataFrame()

    for data in result['locationMetrics'][0]['metricValues']:
        metric_name = data['metric']
        dates = []
        metric_values = []
        for val in data['dimensionalValues']:
            dates.append(val['timeDimension']['timeRange']['startTime'].split('T')[0])
            metric_values.append(val['value'] if 'value' in val.keys() else 0)
        report_df['date'] = dates
        report_df[metric_name.lower()] = metric_values
    
    report_df['direct_search'] = report_df['queries_direct'].astype(int)
    report_df['discovery_search'] = report_df['queries_indirect'].astype(int)
    report_df['branded_search'] = report_df['queries_chain'].astype(int)
    report_df['total_searches'] = report_df['direct_search'].astype(int)+report_df['discovery_search'].astype(int)+report_df['branded_search'].astype(int)
    
    report_df['impressions_count'] = report_df['views_maps'].astype(int) + report_df['views_search'].astype(int)
    report_df['website_clicks_count'] = report_df['actions_website'].astype(int)
    report_df['call_clicks_count'] = report_df['actions_phone'].astype(int)
    report_df['direction_requests'] = report_df['actions_driving_directions'].astype(int)
    report_df['pics_views'] = report_df['photos_views_customers'].astype(int) + report_df['photos_views_merchant'].astype(int)
    
    return report_df[['date','impressions_count','website_clicks_count','call_clicks_count','direction_requests','pics_views']], report_df[['date','direct_search','discovery_search','branded_search','total_searches']]

@app.route('/google/get-other-stats')
def get_other_stats():
    credentials = get_gapd_creds(request.args["email"])
    location_name = get_location_db(request.args["email"])
    # biz_perf_client = get_business_perf_client(credentials)
    my_biz_client = gapd.build('mybusiness', 'v4', credentials=credentials, discoveryServiceUrl=disc_mybiz)
    biz_info = get_biz_info(credentials)

    ob_date = get_onboarding_date(request.args["email"])
    report_insight_df, search_df = report_insights(my_biz_client, biz_info['accounts'][0]['name'], 'locations/'+location_name, "ALL", ob_date, datetime.utcnow().date())
    
    if len(report_insight_df)==0:
        return {
            "website_clicks":0,
            "photo_views":0
        }
    else:
        return {
            "website_clicks":sum(report_insight_df['website_clicks_count']),
            "photo_views":sum(report_insight_df['pics_views'])
        }


@app.route('/send-lead-sms-landingpage', methods=['POST'])
def send_leadgen_sms_landing_page():
    print('chrone.work/send-leadgen-sms-landingpage')
    try:
        data = request.json
        repeat_cust = data['repeat_customer']
        user_ipdata = get_ip_details(request)
        url = data['url']
        domain = url.split("/")[2].split(".")[0]

        get_website_data_query=f"Select place_id, biz_name, booking_link, number,dead from gmb_website_details where url='{domain}'"
        sql_query(get_website_data_query)
        res = cur.fetchall()

        place_id = res[0][0]
        biz_name = res[0][1]
        booking_link = res[0][2]
        number = res[0][3]
        dead = res[0][4]

        if repeat_cust != "Not Selected":
            message = f'Hurray! You have a booking request from a {repeat_cust} on your website built by Chrone.\n'
        else:
            message = f'Hurray! You have a booking request from a customer on your website built by Chrone.\n'

        if dead==False:
            form_data = data['form_data']   
            for i in form_data:
                message = message + i + ' - ' + form_data[i] + '\n'
            if booking_link is not None:
                print(booking_link)
                message = message + "We have sent them your booking link, but please reach out to them immediately to fix a time and confirm the request."
            else:
                message = message + "Please reach out to them immediately to fix a time and confirm the request."
        else:
            form_data = data['form_data'] 
            masked_phone = form_data['phone'][:1] + 'xxxxxxxx' + form_data['phone'][9:]
            masked_name = form_data['name'][:1] + 'xxxxx' + form_data['name'][-1:] 
            message = message + "Name - " + masked_name + '\n'
            message = message + "Phone - " + masked_phone + '\n'
            message = message + "Please reach out to your Chrone SPOC to unmask the customer details."

        recipient = number
        print(message, recipient)
        if booking_link is not None:
            message_cust = "Hi! Your booking request with "+biz_name+" has been received. To make a confirmed booking immediately, you can call us at - "+recipient+"\nor book by clicking here - \n"+booking_link
        else:
            message_cust = "Hi! Your booking request with "+biz_name+" has been received. To make a confirmed booking immediately, you can call us at - "+recipient

        try:
            if dead==True:
                send_slack_notification(f"user_ip_details", "website_leadgen_testing")
                if user_ipdata['country'] == 'India': send_slack_notification(f"Tester-\nSP message:\n{message}\n\nCust message:\n{message_cust}\nbiz_name: {biz_name}\n\nCustomer Type: {repeat_cust}\n Dead Profile", "website_leadgen_testing")
                else: send_slack_notification(f"Production-\nSP message:\n{message}\n\nCust message:\n{message_cust}\nbiz_name: {biz_name}\n\nCustomer Type: {repeat_cust}\n Dead Profile", "website-lead-gen-submission")
            else:                
                send_slack_notification(f"user_ip_details", "website_leadgen_testing")
                if user_ipdata['country'] == 'India': send_slack_notification(f"Tester-\nSP message:\n{message}\n\nCust message:\n{message_cust}\nbiz_name: {biz_name}\n\nCustomer Type: {repeat_cust}", "website_leadgen_testing")
                else: send_slack_notification(f"Production-\nSP message:\n{message}\n\nCust message:\n{message_cust}\nbiz_name: {biz_name}\n\nCustomer Type: {repeat_cust}", "website-lead-gen-submission")
        except:
            send_slack_notification(f"Exception:\nSP message:\n{message}\n\nCust message:\n{message_cust}\n\nCustomer Type: {repeat_cust}", "website_leadgen_testing")

        print(message_cust)
        if user_ipdata['country'] == 'India': response = send_twilio_sms(message, '14805267612')
        else:
            response = send_twilio_sms(message, recipient)  
            biz_name = biz_name.replace("'", "''")
            if place_id is not None:
                insert_sql('sp_website_form', {'biz_name':biz_name, 'place_id':place_id, 'form_data':form_data, 'customer_type':repeat_cust})
            else: 
                insert_sql('sp_website_form', {'biz_name':biz_name, 'form_data':form_data, 'customer_type':repeat_cust})
        response_cust = send_twilio_sms(message_cust, form_data["phone"])
        response = {"msg":"done"}
        return {"status":"success","response":response}, 200
    except Exception as e:
        send_slack_notification(f"Error Encountered while sending message:\n{str(e)}", "website_leadgen_testing")
        return {"status":"error", "response":str(e)}, 200



@app.route('/twilio-incoming-notifier', methods=['POST'])
def twilio_incoming_notifier():
    print('chrone.work/twilio-incoming-notifier')
    # print(request.data)

    data = json.loads(request.data.decode('utf-8'))
    print(data)
    try: 
        message = data['message']
        phone = data['phone']
        phone_clean = phone[-10:] #"("+phone[-10:][:3]+") "+phone[-10:][3:6]+"-"+phone[-10:][6:10]
        db_query = f"Select biz_name from gmb_profile_details where replace(replace(replace(replace(phone,'(',''),')',''),' ',''),'-','') ilike '{phone_clean}'"
        sql_query(db_query)
        biz_name = cur.fetchall()[0][0]
        message = "Message: "+ message + "\nBusiness name: " + biz_name
        send_slack_notification(message, "twilio-received-sms")
        return {"status":"success"}, 200
    except Exception as e:
        send_slack_notification("Message:" + data['message'] + "\nPhone number:" + data['phone'], "twilio-received-sms")
        return {"status":"error", "response":str(e)}, 200

@app.errorhandler(404)
def page_not_found(e):
    return redirect('https://chrone.work/login')

if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')

