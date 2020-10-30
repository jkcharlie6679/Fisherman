import paho.mqtt.client as mqtt  
import time, json, random, os, configparser
from datetime import datetime, timezone, timedelta

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'
config = configparser.ConfigParser()
config.read(cfgpath)


def iot_pub_fish(device_id, data):
	mqtt_client = mqtt.Client()  
	mqtt_client.username_pw_set(username=config["CHT"]["ship_ck"], password=config["CHT"]["ship_ck"])
	mqtt_client.connect(config["CHT"]["mqtt_host"], int(config["CHT"]["mqtt_port"]), int(config["CHT"]["mqtt_alive"]))    

	mqtt_client.publish("/v1/device/" + str(device_id) + "/rawdata", json.dumps(data), qos=1)

def server_pub(topic, data):
    mqtt_client = mqtt.Client()
    mqtt_client.connect(config["MQTT"]["host"], int(config["MQTT"]["port"]), int(config["MQTT"]["alive"]))
    mqtt_client.publish(str(topic), json.dumps(data), qos=1)


cnt = 0
track = 1
x_now = 121.752976
x1 = 121.752976
x2 = 121.470152
x3 = 122.996127

y_now = 25.159238
y1 = 25.159238
y2 = 26.029515
y3 = 26.518220
# 25.159238, 121.752976
# 26.169392, 121.779846
# 25.920339, 122.442752
S_Fisherman_Account = "b10702130@gapps.ntust.edu.tw"
S_Platform_Number = "AAB"
ship_deice_id = 25069775529
ship_topic = "ship"
fish_topic = "fish"
name = ['Tuna', 'Swordfish', 'Grouper', 'Mackerel', 'Mahi_mahi']

def x_gps_Track(x_now):
    x_gps = x_now
    if((x_gps > x2) & (track == 1)):
        x_gps = x_gps - 0.01
    if((x_gps < x3) & (track == 2)):
        x_gps = x_gps + 0.01
    if((x_gps >= x1) & (track == 3)):
        x_gps = x_gps - 0.01
    return x_gps

def y_gps_Track(y_now):
    y_gps = y_now
    if((y_gps < y2) & (track == 1)):
        y_gps = y_gps + 0.01
    if((y_gps < y3) & (track == 2)):
        y_gps = y_gps + 0.01
    if((y_gps >= y1) & (track == 3)):
        y_gps = y_gps - 0.01
    return y_gps


while (track != 4): 
    time_now = datetime.utcnow().replace(tzinfo=timezone.utc).isoformat()
    cnt = cnt + 1
    x_now = x_gps_Track(x_now)
    y_now = y_gps_Track(y_now)
    if((x_now < x2) & (y_now > y2) & (track == 1)):
        track = 2
    elif((x_now > x3) & (y_now > y3) & (track == 2)):
        track = 3
    elif((x_now < x1) & (y_now < y1)& (track == 3)):
        x_now = x1
        y_now = y1
        track = 1

    tz_utc_8 = timezone(timedelta(hours=8))
    data = {}
    data["S_Fisherman_Account"] = S_Fisherman_Account
    data["D_Ship_Datetime"] = str(time_now)
    data["S_Ship_Location_X"] = str(x_now)
    data["S_Ship_Location_Y"] = str(y_now)
    data["F_Ship_Engine_Temp"] = 180 + round(random.uniform(-1, 1), 2)
    data["F_Ship_Engine_Tern"] = 1000 + random.randint(500, 1000)
    data["F_Ship_Air_Temperature"] = 21 + round(random.uniform(-1, 1), 2)
    data["F_Ship_Water_Temperature"] = 10 + round(random.uniform(-3, 3), 2)
    data["F_Ship_Air_Pressure"] = 1013 + round(random.uniform(-5, 5), 2)
    data["F_Ship_Water_Pressure"] = 1013 + round(random.uniform(-5, 5), 2)
    data["F_Ship_Humidity"] = 70 + round(random.uniform(-2, 2), 2)
    data["F_Ship_Wind_dir"] = 30 + round(random.uniform(-3, 3), 2)
    data["F_Ship_Ref_Temp"] = -65 + round(random.uniform(-3, 3), 2)
    data["F_Ship_Wind_Speed"] = 30 + round(random.uniform(-3, 3), 2)
    data["I_Ship_Ref_open"] = random.randint(0, 1)
    data["F_Ship_Gyro_x"] = 90 + round(random.uniform(-1, 1), 2)
    data["F_Ship_Gyro_y"] = 90 + round(random.uniform(-1, 1), 2)
    data["F_Ship_Gyro_z"] = 90 + round(random.uniform(-1, 1), 2)
    data["I_Ship_Rain"] = 0
    data["I_Ship_Water_Intrusion_Sensor1"] = 0
    data["I_Ship_Water_Intrusion_Sensor2"] = 0
    data["I_Ship_Water_Intrusion_Sensor3"] = 0
    
    data_cht = {}
    data_cht["0"] = "(" + str(x_now) + "," + str(y_now) + ")"
    # data_cht["0"] = 123
    data_cht["1"] = 180 + round(random.uniform(-1, 1), 2)
    data_cht["2"] = 1000 + random.randint(500, 1000)
    data_cht["3"] = 21 + round(random.uniform(-1, 1), 2)
    data_cht["4"] = 10 + round(random.uniform(-3, 3), 2)
    data_cht["5"] = 1013 + round(random.uniform(-5, 5), 2)
    data_cht["6"] = 1013 + round(random.uniform(-5, 5), 2)
    data_cht["7"] = 70 + round(random.uniform(-2, 2), 2)
    data_cht["8"] = 30 + round(random.uniform(-3, 3), 2)
    data_cht["9"] = -65 + round(random.uniform(-3, 3), 2)
    data_cht["10"] = 30 + round(random.uniform(-3, 3), 2)
    data_cht["11"] = random.randint(0, 1)
    data_cht["12"] = 90 + round(random.uniform(-1, 1), 2)
    data_cht["13"] = 90 + round(random.uniform(-1, 1), 2)
    data_cht["14"] = 90 + round(random.uniform(-1, 1), 2)
    data_cht["15"] = 0
    data_cht["16"] = 0
    data_cht["17"] = 0
    data_cht["18"] = 0
    data_iot = []
    for x in range(19):
        data_json = {
            "id": S_Platform_Number + "_Sensor" + str(x + 1),
            "time": str(time_now),
            "value": [
                str(data_cht[str(x)])
                ]
        }
        data_iot.append(data_json)

    server_pub(ship_topic, data)
    iot_pub_fish(ship_deice_id, data_iot)
    print(json.dumps(data), "\n")

    if(random.randint(0,1)):
        tz_utc_8 = timezone(timedelta(hours=8))
        data1 = {}
        data1["S_Fisherman_Account"] = S_Fisherman_Account
        data1["S_Fish_Name"] = name[random.randint(0,4)]
        data1["F_Fish_Weight"] = str(round(random.uniform(100, 200), 2))
        data1["F_Fish_Length"] = str(round(random.uniform(1, 3), 2))
        data1["S_Fish_Picture"] = "NULL"
        data1["D_Fish_Datetime"] = str(time_now)
        data1["S_Fish_Location_X"] = str(x_now)
        data1["S_Fish_Location_Y"] = str(y_now)
        data1["F_Fish_Depth"] = str(round(random.uniform(50, 300), 2))
        data1["F_Fish_Temperature"] = str(round(random.uniform(-65, -55), 2))
        print(json.dumps(data1), "\n")

        server_pub(fish_topic, data1)


    time.sleep(5)