import google.oauth2.credentials
import googleapiclient.discovery as gapd
import requests


oauth_dict = {"token": "ya29.a0AeTM1ie4nnVXz7zAb5AMf39fhDPQ4DR0GFakbvKZbXSKBTgxlStFBmMfQByko6K15WWE2dwUJ5TIiZO1sRw49rElJUAzPJUuL1J47DJ2t83G0tvcM_y6Bt9yvbJQVg6ZDNSNx8zfE7HUoS8Afa-tMaS2YuXraCgYKAdwSARISFQHWtWOm0AeBRNjsMAsRfsJTmum7tQ0163", "refresh_token": "1//0drlm_y3c1FR-CgYIARAAGA0SNwF-L9IrW9ZLre2zsAuVrEw5NOpNPFG7GjXgj2MKiVESEaSOJ5K8TXgeaaTFw1gY7E_w_8e6NYg", "token_uri": "https://oauth2.googleapis.com/token", "client_id": "396419005169-0rlvknnf4suo2d8a95k91d35rn59cana.apps.googleusercontent.com", "client_secret": "RYgNazeJBJ5wh963v8QIfHL2", "scopes": ["openid", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/business.manage", "https://www.googleapis.com/auth/businesscommunications"]}


disc_info = 'https://mybusinessbusinessinformation.googleapis.com/$discovery/rest?version=v1'
disc_acc = 'https://mybusinessaccountmanagement.googleapis.com/$discovery/rest?version=v1'
disc_verify = 'https://mybusinessverifications.googleapis.com/$discovery/rest?version=v1'
disc_perf = 'https://businessprofileperformance.googleapis.com/$discovery/rest?version=v1'
disc_mybiz = "https://developers.google.com/static/my-business/samples/mybusiness_google_rest_v4p9.json"
# mapsbooking_url = "https://partnerdev-mapsbooking.googleapis.com/$discovery/rest?version=v1alpha"
readMask="storeCode,regularHours,name,languageCode,title,phoneNumbers,categories,storefrontAddress,websiteUri,regularHours,specialHours,serviceArea,labels,adWordsLocationExtensions,latlng,openInfo,metadata,profile,relationshipData,moreHours"

credentials = google.oauth2.credentials.Credentials(**oauth_dict)

oauth2_client = gapd.build('oauth2', 'v2', credentials=credentials)
profile_data = oauth2_client.userinfo().get().execute()

print(profile_data)

my_biz = gapd.build('mybusiness', 'v4', credentials=credentials, discoveryServiceUrl=disc_mybiz)

biz_info_client = gapd.build('mybusinessbusinessinformation', 'v1', credentials=credentials, discoveryServiceUrl=disc_info)
biz_acc_client = gapd.build('mybusinessaccountmanagement', 'v1', credentials=credentials, discoveryServiceUrl=disc_acc)
# biz_verify_client = gapd.build('mybusinessverifications', 'v1', credentials=credentials, discoveryServiceUrl=disc_verify)
biz_perf_client = gapd.build('businessprofileperformance', 'v1', credentials=credentials, discoveryServiceUrl=disc_perf)


biz_info = biz_acc_client.accounts().list().execute()
biz_info_location = biz_info_client.accounts().locations().list(parent=biz_info['accounts'][0]['name'], readMask=readMask, pageSize=100).execute()

lcs = biz_info_location['locations']
print([x["title"]+' - '+str(x["metadata"]["placeId"]) for x in lcs if "placeId" in x["metadata"].keys()])

location_index = 0
lc = lcs[location_index]
# print(lc)

resp = my_biz.accounts().locations().media().list(parent=biz_info['accounts'][0]['name']+"/"+lc["name"], pageSize=2500).execute()

print(resp)



