import paho.mqtt.client as mqtt
import os, configparser, psycopg2, json
from MQTT_to_DB import ship_sent_to_DB

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'
config = configparser.ConfigParser()
config.read(cfgpath)


def on_connect(client, userdata, flags, rc):

    print("Connected with result code ", rc)
    client.subscribe(config["MQTT"]["topic_s1"])
    # client.subscribe("Ship1")


def on_message(client, userdata, msg):
    mqtt_data = json.loads(msg.payload)
    # print(mqtt_data, "\n")
    ship_sent_to_DB(mqtt_data)
    print("done")




mqtt_client = mqtt.Client()
mqtt_client.connect(config["MQTT"]["host"], int(config["MQTT"]["port"]), int(config["MQTT"]["alive"]))    
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.loop_forever()

