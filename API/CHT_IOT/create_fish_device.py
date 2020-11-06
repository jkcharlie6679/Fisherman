import requests, os, configparser, json

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)

def cht_create_fish(S_Platform_Number):
    url = config["CHT"]["device_url"]
    headers = {
        "CK": config["CHT"]["fish_ck"]
        }

    data = {
        "name": ("Fish_" + str(S_Platform_Number)),
        "desc": "fish data",
        "type": "general"
    }

    response = requests.post(url, headers = headers, data = json.dumps(data))

    divicd_id = (response.json()["id"])

    url = "http://iot.cht.com.tw/iot/v1/device/" + str(divicd_id) + "/sensor"
    
    x = 1
    data = {
        "id": (str(S_Platform_Number) + "_Sensor" + str(x)),
        "name": "Name",
        "type": "text"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "_Sensor" + str(x)),
        "name": "weight",
        "type": "gauge",
        "unit": "kg"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "_Sensor" + str(x)),
        "name": "length",
        "type": "gauge",
        "unit": "m"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "_Sensor" + str(x)),
        "name": "location",
        "type": "text"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "_Sensor" + str(x)),
        "name": "depth",
        "type": "gauge",
        "unit": "m"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "_Sensor" + str(x)),
        "name": "Temperature",
        "type": "gauge",
        "unit": "℃"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))

    
# cht_create_fish("AAC")

