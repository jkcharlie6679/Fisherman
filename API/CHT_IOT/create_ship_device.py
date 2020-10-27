import requests, os, configparser, json

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)

def cht_create_ship(S_Platform_Number):
    url = config["CHT"]["device_url"]
    headers = {
        "CK": config["CHT"]["ship_ck"]
        }

    data = {
        "name": ("Ship_" + str(S_Platform_Number)),
        "desc": "ship sensor data",
        "type": "general"
    }

    response = requests.post(url, headers = headers, data = json.dumps(data))

    divicd_id = (response.json()["id"])

    url = "http://iot.cht.com.tw/iot/v1/device/" + str(divicd_id) + "/sensor"
    x = 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "location",
        "type": "gauge"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Engine_Temp",
        "type": "gauge",
        "unit": "℃"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Engine_Tern",
        "type": "gauge",
        "unit": "rpm"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Air_Temperature",
        "type": "gauge",
        "unit": "℃"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Water_Temperature",
        "type": "gauge",
        "unit": "℃"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Air_Pressure",
        "type": "gauge",
        "unit": "Hpa"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Water_Pressure",
        "type": "gauge"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Humidity",
        "type": "gauge",
        "unit": "%"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Wind_dir",
        "type": "gauge",
        "unit": "°"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Ref_Temp",
        "type": "gauge",
        "unit": "℃"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Wind_Speed",
        "type": "gauge",
        "unit":  "m/s"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Ref_open",
        "type": "switch"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    x = x + 1
    data = {
        "id": (str(S_Platform_Number) + "sensor" + str(x)),
        "name": "Gyro",
        "type": "switch"
    }
    response = requests.post(url, headers = headers, data = json.dumps(data))
    
cht_create_ship("AAB")
