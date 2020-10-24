import psycopg2, os, configparser


path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)


pg = psycopg2.connect(database = config['POSTGRES']['platform_Data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])

print("Opened database successfully")

pgadmin = pg.cursor()


pgadmin.execute('''CREATE TABLE Goods
        (I_Goods_ID SERIAL PRIMARY KEY NOT NULL,
         S_Goods_Number text NOT NULL,
         I_Goods_Price integer NOT NULL,
         I_Goods_Ststus integer NOT NULL);''')

print("Goods create successfully")

pgadmin.execute('''CREATE TABLE Trade_Data	
        (I_Trade_ID SERIAL PRIMARY KEY NOT NULL,
         S_Trade_Account text NOT NULL,
         S_Trade_Number text NOT NULL,
         D_Trade_Time timestamp WITH TIME ZONE NOT NULL,
         S_Trade_Goods_ID text NOT NULL,
         I_Trade_Status integer NOT NULL,
         I_Trade_Pay integer NOT NULL,
         S_Trade_Tax_ID text,
         S_Trade_Logistics text NOT NULL,
         S_Trade_Receiver text NOT NULL,
         S_Trade_Post_Number text NOT NULL,
         S_Trade_Address text NOT NULL,
         S_Trade_Phone text NOT NULL);''')

print("Trade_Data create successfully")

pgadmin.execute('''CREATE TABLE Messege_Box
        (I_Message_ID SERIAL PRIMARY KEY NOT NULL,
         S_Message_Transformer text NOT NULL,
         S_Message_Receiver text NOT NULL,
         D_Message_Time timestamp WITH TIME ZONE NOT NULL,
         S_Message_Message text NOT NULL,
         I_Message_Read integer NOT NULL);''')

print("Messege_Box create successfully")


pgadmin.execute('''CREATE TABLE Shopping_Cart
        (I_Shopping_ID SERIAL PRIMARY KEY NOT NULL,
         S_Shopping_Goods_ID text NOT NULL);''')

print("Shopping_Cart create successfully")

pg.commit()
pg.close()
