import psycopg2, json, configparser, os

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)

def create_cart_table(S_Customer_Username):
    pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    pgadmin.execute('''CREATE TABLE %s
        (I_Cart_ID SERIAL PRIMARY KEY NOT NULL,
         S_Goods_Number text NOT NULL,
         I_Goods_Quantity integer NOT NULL);''' %("Cart_" + str(S_Customer_Username)))

    pg.commit()

def create_trade_table(S_Customer_Username):
    pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    pgadmin.execute('''CREATE TABLE %s
        (I_Trade_ID SERIAL PRIMARY KEY NOT NULL,
         S_Customer_Account text NOT NULL,
         S_Customer_Username text NOT NULL,
         S_Trade_Number text NOT NULL,
         D_Trade_Time timestamp WITH TIME ZONE NOT NULL,
         S_Goods_Number text NOT NULL,
         I_Goods_Quantity integer NOT NULL,
         I_Trade_Pay integer NOT NULL,
         S_Trade_Tax_ID text,
         S_Trade_Logistics text NOT NULL,
         S_Trade_Receiver text NOT NULL,
         S_Receiver_Phone text NOT NULL,
         I_Trade_Post_Number integer NOT NULL,
         S_Trade_Address text NOT NULL,
         I_Goods_Status Integer NOT NULL);''' %("Trade_" + str(S_Customer_Username)))

    pg.commit()

# create_trade_table("Charlie")
# create_cart_table("Charlie")
