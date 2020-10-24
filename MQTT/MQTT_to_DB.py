import os, configparser, psycopg2, json, datetime

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'
config = configparser.ConfigParser()
config.read(cfgpath)

def week_count(S_Price_Week):
    if(S_Price_Week == "0"):
        delta = datetime.timedelta(days = 0)
    elif(S_Price_Week == "1"):
        delta = datetime.timedelta(days = 7)
    elif(S_Price_Week == "2"):
        delta = datetime.timedelta(days = 14)    
    
    day = datetime.datetime.now() + delta

    return str(datetime.datetime.now())[0:4] + "-" + day.strftime("%U")

def fish_sent_to_DB(mqtt_data, hash_code):
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if(mqtt_data["S_Fisherman_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute("SELECT * FROM %s;" %("Price_" + S_Platform_Number))
    data_db = pgadmin.fetchall()

    price1 = 0
    price2 = 0
    price3 = 0
    price4 = 0
    price5 = 0

    for raw in data_db:
        if(week_count("1") == raw[1]):
            price1 = raw[2]
            price2 = raw[3]
            price3 = raw[4]
            price4 = raw[5]
            price5 = raw[6]

    if(mqtt_data["S_Fish_Name"] == "Tuna"):
        I_Goods_Price = int(price1 * float(mqtt_data["F_Fish_Weight"]))
        fish_type = "A"
    elif(mqtt_data["S_Fish_Name"] == "Swordfish"):
        I_Goods_Price = int(price2 * float(mqtt_data["F_Fish_Weight"]))
        fish_type = "B"
    elif(mqtt_data["S_Fish_Name"] == "Grouper"):
        I_Goods_Price = int(price3 * float(mqtt_data["F_Fish_Weight"]))
        fish_type = "C"
    elif(mqtt_data["S_Fish_Name"] == "Mackerel"):
        I_Goods_Price = int(price4 * float(mqtt_data["F_Fish_Weight"]))
        fish_type = "D"
    elif(mqtt_data["S_Fish_Name"] == "Mahi_mahi"):
        I_Goods_Price = int(price5 * float(mqtt_data["F_Fish_Weight"]))
        fish_type = "E"


    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    pgadmin.execute("SELECT * FROM %s;" %("Fish_" + str(S_Platform_Number)))
    data_db = pgadmin.fetchall()

    I_Fish_ID = 1
    for raw in data_db:
        if(raw[2] == mqtt_data["S_Fish_Name"]):
            I_Fish_ID = I_Fish_ID + 1

    INSERT = ('''INSERT into %s(S_Fish_Hash_Code, S_Fish_Name, F_Fish_Weight, F_Fish_Length, S_Fish_Picture, D_Fish_Datetime, S_Fish_Location_X, S_Fish_Location_Y, F_Fish_Depth, F_Fish_Temperature, S_Goods_Number, I_Goods_Price, I_Goods_Status)''' %("Fish_" + str(S_Platform_Number))) + '''VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'''
    

    insert_data = (
        str(hash_code),
        mqtt_data["S_Fish_Name"],
        mqtt_data["F_Fish_Weight"],
        mqtt_data["F_Fish_Length"],
        mqtt_data["S_Fish_Picture"],
        mqtt_data["D_Fish_Datetime"],
        mqtt_data["S_Fish_Location_X"],
        mqtt_data["S_Fish_Location_Y"],
        mqtt_data["F_Fish_Depth"],
        mqtt_data["F_Fish_Temperature"],
        S_Platform_Number + "-" + fish_type + "-" + str(I_Fish_ID),
        I_Goods_Price,
        '0'
    )
    print(insert_data)
    pgadmin.execute(INSERT, insert_data)
    pg.commit()
    


def ship_sent_to_DB(mqtt_data):
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute("SELECT * FROM Fisherman_Account")
    data_db = pgadmin.fetchall()
    for raw in data_db:
        if(mqtt_data["S_Fisherman_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    print(S_Platform_Number)
    pg = psycopg2.connect(database = config['POSTGRES']['ship_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    INSERT = ('''INSERT into %s(S_Ship_Location_X, S_Ship_Location_Y, F_Ship_Engine_Temp, F_Ship_Temperature, F_Ship_Pressure, F_Ship_Humidity, F_Ship_Wind, F_Ship_Ref_Temp, F_Ship_Wind_Speed, D_Ship_Time)''' %("Sensor_" + str(S_Platform_Number))) + '''VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);'''

    insert_data = (
        mqtt_data["S_Ship_Location_X"],
        mqtt_data["S_Ship_Location_Y"],
        mqtt_data["F_Ship_Engine_Temp"],
        mqtt_data["F_Ship_Temperature"],
        mqtt_data["F_Ship_Pressure"],
        mqtt_data["F_Ship_Humidity"],
        mqtt_data["F_Ship_Wind"],
        mqtt_data["F_Ship_Ref_Temp"],
        mqtt_data["F_Ship_Wind_Speed"],
        mqtt_data["D_Ship_Time"]
    )

    pgadmin.execute(INSERT, insert_data)
    print("insert\n")
    pg.commit()
