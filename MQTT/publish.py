import paho.mqtt.client as mqtt  
import time  
import json  
import random
import os, configparser
from datetime import datetime, timezone, timedelta

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'
config = configparser.ConfigParser()
config.read(cfgpath)

mqtt_client = mqtt.Client()  
mqtt_client.connect(config["PUBLISHER"]["MQTT_SERVER"], int(config["PUBLISHER"]["MQTT_PORT"]), int(config["PUBLISHER"]["MQTT_ALIVE"]))    


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

    # print(x_now, " ", cnt, " ", track)
    # print(y_now, " ", cnt, " ", track, "\n")

    tz_utc_8 = timezone(timedelta(hours=8))
    data_ship1 = {}
    data_ship1["S_Fisherman_Account"] = "b10702130@gapps.ntust.edu.tw"
    data_ship1["S_Ship_Location_X"] = str(x_now)
    data_ship1["S_Ship_Location_Y"] = str(y_now)
    data_ship1["F_Ship_Engine_Temp"] = 180 + round(random.uniform(-1, 1), 2)
    data_ship1["F_Ship_Temperature"] = 21 + round(random.uniform(-1, 1), 2)
    data_ship1["F_Ship_Pressure"] = 1013 + round(random.uniform(-3, 3), 2)
    data_ship1["F_Ship_Humidity"] = 75 + round(random.uniform(-5, 5), 2)
    data_ship1["F_Ship_Wind"] = 75 + round(random.uniform(-5, 5), 2)
    data_ship1["F_Ship_Ref_Temp"] = -65 + round(random.uniform(-2, 2), 2)
    data_ship1["F_Ship_Wind_Speed"] = 30 + random.uniform(-5, 5)
    data_ship1["D_Ship_Time"] = str(datetime.now().replace(tzinfo=tz_utc_8))
    
    print(json.dumps(data_ship1), "\n")
    mqtt_client.publish(config["PUBLISHER"]["MQTT_TOPIC_S1"], json.dumps(data_ship1), qos=1)


    if(random.randint(1,1)):
        tz_utc_8 = timezone(timedelta(hours=8))
        data_fish = {}
        data_fish["S_Fisherman_Account"] = "b10702130@gapps.ntust.edu.tw"
        data_fish["S_Fish_Name"] = name[random.randint(0,4)]
        data_fish["F_Fish_Weight"] = str(round(random.uniform(100, 200), 2))
        data_fish["F_Fish_Length"] = str(round(random.uniform(1, 3), 2))
        data_fish["S_Fish_Picture"] = "NULL"
        data_fish["D_Fish_Datetime"] = str(datetime.now().replace(tzinfo=tz_utc_8))
        data_fish["S_Fish_Location_X"] = str(x_now)
        data_fish["S_Fish_Location_Y"] = str(y_now)
        data_fish["F_Fish_Depth"] = str(round(random.uniform(50, 300), 2))
        data_fish["F_Fish_Temperature"] = str(round(random.uniform(-65, -55), 2))
        print(json.dumps(data_fish))
        mqtt_client.publish(config["PUBLISHER"]["MQTT_TOPIC_F"], json.dumps(data_fish), qos=1)



    time.sleep(15)
