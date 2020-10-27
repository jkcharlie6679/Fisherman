import requests, json
from requests.auth import HTTPBasicAuth




url = "http://iot.cht.com.tw/iot/v1/device"
headers = {
    "CK": "PK32XAX73C2RR4W59A"
    }

data = {
  "name": "humi11",
  "desc": "test humi",
  "type": "general"
}

params = {
    "id": "24976023929"
}

response = requests.get(url, headers=headers, params = json.dumps(params))

print(response.json())


