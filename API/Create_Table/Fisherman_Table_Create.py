import psycopg2, json, configparser, os

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)

def create_sensor_table(S_Platform_Number):
    pg = psycopg2.connect(database = config['POSTGRES']['ship_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    pgadmin.execute('''CREATE TABLE %s
        (I_Ship_ID SERIAL PRIMARY KEY NOT NULL,
         D_Ship_Time timestamp WITH TIME ZONE NOT NULL,
         S_Ship_Location_X text NOT NULL,
         S_Ship_Location_Y text NOT NULL,
         S_Ship_Direction real NOT NULL,
         F_Ship_Engine_Temp real NOT NULL,
         F_Ship_Engine_Tern real NOT NULL,
         F_Ship_Air_Temperature real NOT NULL,
         F_Ship_Water_Temperature real NOT NULL,
         F_Ship_Air_Pressure real NOT NULL,
         F_Ship_Water_Pressure real NOT NULL,
         F_Ship_Humidity real NOT NULL,
         F_Ship_Wind_Dir real NOT NULL,
         F_Ship_Ref_Temp real NOT NULL,
         F_Ship_Wind_Speed real NOT NULL,
         I_Ship_Ref_Open integer NOT NULL,
         F_Ship_Gyro_x real NOT NULL,
         F_Ship_Gyro_y real NOT NULL,
         F_Ship_Gyro_z real NOT NULL,
         I_Ship_Rain integer NOT NULL,
         I_Ship_Water_Intrusion_1 integer NOT NULL,
         I_Ship_Water_Intrusion_2 integer NOT NULL,
         I_Ship_Water_Intrusion_3 integer NOT NULL);''' %("Sensor_" + str(S_Platform_Number)))

    pg.commit()
    
def create_price_table(S_Platform_Number):
    pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    pgadmin.execute('''CREATE TABLE %s
        (I_Price_ID SERIAL PRIMARY KEY NOT NULL,
         S_Price_Week text NOT NULL,
         %s integer NOT NULL,
         %s integer NOT NULL,
         %s integer NOT NULL,
         %s integer NOT NULL,
         %s integer NOT NULL);''' %(("Price_" + str(S_Platform_Number)), config['FISH']['fish_1'], config['FISH']['fish_2'], config['FISH']['fish_3'], config['FISH']['fish_4'], config['FISH']['fish_5']))
    
    pg.commit()

def create_fish_table(S_Platform_Number):
    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    pgadmin.execute('''CREATE TABLE %s
        (I_Fish_ID SERIAL PRIMARY KEY NOT NULL,
         S_Fish_Hash_Code text NOT NULL,
         S_Fish_Name text NOT NULL,
         F_Fish_Weight real NOT NULL,
         F_Fish_Length real NOT NULL,
         S_Fish_Picture text,
         D_Fish_Datetime timestamp WITH TIME ZONE NOT NULL,
         S_Fish_Location_X text NOT NULL,
         S_Fish_Location_Y text NOT NULL,
         F_Fish_Depth real NOT NULL,
         F_Fish_Temperature real NOT NULL,
         S_Goods_Number text NOT NULL,
         I_Goods_Price integer NOT NULL,
         I_Goods_Status integer NOT NULL,
         S_Trade_Number text);''' %("Fish_" + str(S_Platform_Number)))

    pg.commit()

def create_trade_table(S_Platform_Number):
    pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    pgadmin.execute('''CREATE TABLE %s
        (I_Trade_ID SERIAL PRIMARY KEY NOT NULL,
         D_Trade_Datetime timestamp WITH TIME ZONE NOT NULL,
         S_Customer_Account text NOT NULL,
         S_Customer_Username text NOT NULL,         
         S_Trade_Number text NOT NULL,
         S_Goods_Number text NOT NULL,
         I_Goods_Status Integer NOT NULL);''' %("Trade_" + str(S_Platform_Number)))

    pg.commit()

# create_trade_table("AAB")
# create_price_table("AAB")
# create_sensor_table("AAB")