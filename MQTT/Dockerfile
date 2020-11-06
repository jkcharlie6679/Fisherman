FROM python:3.6

WORKDIR /Fisherman/MQTT
RUN mkdir /Fisherman/API

COPY config.ini /Fisherman/API
# COPY subcribe_fish.py /Fisherman/MQTT
# COPY Ethereum_Transaction.py /Fisherman/MQTT

# COPY subcribe_ship.py /Fisherman/MQTT

COPY publish1.py /Fisherman/MQTT

# COPY MQTT_to_DB.py /Fisherman/MQTT
COPY requirements.txt /Fisherman/MQTT

RUN pip install -r requirements.txt

# CMD python subcribe_fish.py
# CMD python subcribe_ship.py
CMD python publish1.py
