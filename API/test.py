import paho.mqtt.client as mqtt  
import time, json, random, os, configparser
from datetime import datetime, timezone, timedelta

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'
config = configparser.ConfigParser()
config.read(cfgpath)
    
test = {"asd": "123"}
print(test["asd"])

