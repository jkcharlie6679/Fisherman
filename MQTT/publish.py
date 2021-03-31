import paho.mqtt.client as mqtt  
import time, json, random, os, configparser, math
from datetime import datetime, timezone, timedelta

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'
config = configparser.ConfigParser()
config.read(cfgpath)


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

S_Fisherman_Account = "b10702130@gapps.ntust.edu.tw"
S_Platform_Number = "AAB"

ship_topic = config["MQTT"]["topic_s"]
fish_topic = config["MQTT"]["topic_f"]
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

    if(cnt == 1):
        x_temp = 121.752976
        y_temp = 25.159238

    if((y_now - y_temp) != 0):
        if((x_now - x_temp) > 0):
            ship_direction = (math.atan((x_now - x_temp) / (y_now - y_temp)) / math.pi * 180)
        elif(((x_now - x_temp) < 0)):
            ship_direction = (math.atan((x_now - x_temp) / (y_now - y_temp)) / math.pi * 180) + 180
        else:
            if((y_now - y_temp) > 0):
                ship_direction = 90
            elif((y_now - y_temp) < 0):
                ship_direction = 270
    else:
        if((x_now - x_temp) > 0):
            ship_direction = 0
        elif((x_now - x_temp) < 0):
            ship_direction = 180
        else:
            ship_direction = random.randint(0, 360)

    tz_utc_8 = timezone(timedelta(hours=8))
    data = {}
    data["S_Fisherman_Account"] = S_Fisherman_Account
    data["D_Ship_Datetime"] = str(time_now)
    data["S_Ship_Location_X"] = str(x_now)
    data["S_Ship_Location_Y"] = str(y_now)
    data["S_Ship_Direction"] = str(ship_direction)
    data["F_Ship_Engine_Temp"] = 180 + round(random.uniform(-1, 1), 2)
    data["F_Ship_Engine_Tern"] = 1000 + random.randint(500, 1000)
    data["F_Ship_Air_Temperature"] = 21 + round(random.uniform(-1, 1), 2)
    data["F_Ship_Water_Temperature"] = 10 + round(random.uniform(-3, 3), 2)
    data["F_Ship_Air_Pressure"] = 1013 + round(random.uniform(-5, 5), 2)
    data["F_Ship_Water_Pressure"] = 1013 + round(random.uniform(-5, 5), 2)
    data["F_Ship_Humidity"] = 70 + round(random.uniform(-2, 2), 2)
    data["F_Ship_Wind_Dir"] = 30 + round(random.uniform(-3, 3), 2)
    data["F_Ship_Ref_Temp"] = -65 + round(random.uniform(-3, 3), 2)
    data["F_Ship_Wind_Speed"] = 30 + round(random.uniform(-3, 3), 2)
    data["I_Ship_Ref_Open"] = random.randint(0, 1)
    data["F_Ship_Gyro_x"] = 90 + round(random.uniform(-1, 1), 2)
    data["F_Ship_Gyro_y"] = 90 + round(random.uniform(-1, 1), 2)
    data["F_Ship_Gyro_z"] = 90 + round(random.uniform(-1, 1), 2)
    data["I_Ship_Rain"] = 0
    data["I_Ship_Water_Intrusion_1"] = 0
    data["I_Ship_Water_Intrusion_2"] = 0
    data["I_Ship_Water_Intrusion_3"] = 0

    x_temp = x_now
    y_temp = y_now

    server_pub(ship_topic, data)

    if(random.randint(0,1)):
        tz_utc_8 = timezone(timedelta(hours=8))
        data1 = {}
        data1["S_Fisherman_Account"] = S_Fisherman_Account
        data1["S_Fish_Name"] = name[random.randint(0,4)]
        data1["F_Fish_Weight"] = round(random.uniform(100, 200), 2)
        data1["F_Fish_Length"] = round(random.uniform(1, 3), 2)
        data1["S_Fish_Picture"] = "NULL"
        data1["D_Fish_Datetime"] = str(time_now)
        data1["S_Fish_Location_X"] = str(x_now)
        data1["S_Fish_Location_Y"] = str(y_now)
        data1["F_Fish_Depth"] = round(random.uniform(50, 300), 2)
        data1["F_Fish_Temperature"] = round(random.uniform(-65, -55), 2)

        server_pub(fish_topic, data1)
        print(json.dumps(data1), "\n")


    time.sleep(5)
