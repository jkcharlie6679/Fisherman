import psycopg2, os, configparser


path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)


pg = psycopg2.connect(database = config['POSTGRES']['ship_Data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])

print("Opened database successfully")

pgadmin = pg.cursor()


pgadmin.execute('''CREATE TABLE Ship_Fix
        (I_Ship_Fix_ID SERIAL PRIMARY KEY NOT NULL,
         D_Ship_Fix_Time timestamp WITH TIME ZONE NOT NULL,
         S_Fisherman_Account text NOT NULL,
         S_Ship_Fix_Item text NOT NULL,
         S_Ship_Fix_Log text NOT NULL,
         I_Ship_Fix_Finish text NOT NULL);''')

print("Ship_Fix create successfully")

pg.commit()
pg.close()
