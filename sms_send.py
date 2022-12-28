import app_config
from twilio.rest import Client

def send_twilio_sms(message, recipient):
    # biz_name = data['biz_name']

    account_sid = app_config.TWILIO_SID
    auth_token = app_config.TWILIO_TOKEN
    client = Client(account_sid, auth_token)

    twilio_message = client.messages.create(
        body=message,
        from_=app_config.TWILIO_NUMBER,
        to=recipient
    )

    data_json = {
        "phone":recipient,
        "message":message,
    }

    return data_json

message = """Congrats! you have got a new lead from Google Maps:
Customer Name - Gari Lynn craver
Customer Number - 5097502018
Do reach out to them to confirm their booking!"""
url = "https://chrone.work/dashboard"
recipient = "+16028055070"

# print(message)
res = send_twilio_sms(message, recipient)
print(res)

# res1 = send_twilio_sms(url, recipient)
# print(res1)
