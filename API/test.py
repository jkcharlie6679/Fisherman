import paho.mqtt.client as mqtt  
import time, json, random, os, configparser
from datetime import datetime, timezone, timedelta
import math

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'
config = configparser.ConfigParser()
config.read(cfgpath)

day = timedelta(days=1) 
tz_utc_8 = timezone(timedelta(hours=8))
tz_utc_0 = timezone(timedelta(hours=0))
now_8 = datetime.now().replace(tzinfo=tz_utc_8)
now_0 = datetime.now().astimezone(tz_utc_0)
now_24 = now_0 - day

nn = datetime.strptime("2020-11-1T12:12:12.123123Z", "%Y-%m-%dT%H:%M:%S.%f").replace(tzinfo = tz_utc_8)

print(nn)
