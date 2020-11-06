import paho.mqtt.client as mqtt
import os, configparser, psycopg2, json
from MQTT_to_DB import fish_sent_to_DB, CHT_Blockchain, Find_CHT_Blockchain
from Ethereum_Transaction import Transaction

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'
config = configparser.ConfigParser()
config.read(cfgpath)


def on_connect(client, userdata, flags, rc):
    print("Connected with result code ", rc)
    client.subscribe(config["MQTT"]["topic_f1"])

def on_message(client, userdata, msg):
    mqtt_data = json.loads(msg.payload)
    print(mqtt_data)

    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()

    S_Blkchain_ID = "NULL"

    for raw in data_db:
        if(mqtt_data["S_Fisherman_Account"] == raw[1]):
            S_Blkchain_ID = raw[11]

    hash_code = Transaction(mqtt_data, S_Blkchain_ID)
    print("done1")
    fish_sent_to_DB(mqtt_data, hash_code)
    print("done2")
    # CHT_Blockchain(mqtt_data)
    # Find_CHT_Blockchain()
    print("done")




mqtt_client = mqtt.Client()
mqtt_client.connect(config["MQTT"]["host"], int(config["MQTT"]["port"]), int(config["MQTT"]["alive"])) 
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.loop_forever()

