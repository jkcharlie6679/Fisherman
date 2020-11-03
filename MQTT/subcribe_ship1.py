import paho.mqtt.client as mqtt
import os, configparser, psycopg2, json
from MQTT_to_DB import ship_sent_to_DB
from Ethereum_Transaction import Transaction

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'
config = configparser.ConfigParser()
config.read(cfgpath)


def on_connect(client, userdata, flags, rc):

    print("Connected with result code ", rc)
    client.subscribe(config["PUBLISHER"]["MQTT_TOPIC_S1"])
    # client.subscribe("Ship1")


def on_message(client, userdata, msg):
    mqtt_data = json.loads(msg.payload)
    print(mqtt_data)
    ship_sent_to_DB(mqtt_data)
    print("done")




mqtt_client = mqtt.Client()
mqtt_client.connect(config["PUBLISHER"]["MQTT_SERVER"], int(config["PUBLISHER"]["MQTT_PORT"]), int(config["PUBLISHER"]["MQTT_ALIVE"]))    
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.loop_forever()

