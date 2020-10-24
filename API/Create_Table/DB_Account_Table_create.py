import psycopg2, os, configparser


path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)


pg = psycopg2.connect(database = config['POSTGRES']['Account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])

print ("Opened database successfully")

pgadmin = pg.cursor()

# pgadmin.execute('''CREATE TABLE Customer_Account
#        (I_Customer_ID SERIAL PRIMARY KEY NOT NULL,
#        S_Customer_First_Name text NOT NULL,
#        S_Customer_Last_Name text NOT NULL,
#        S_Customer_Account text NOT NULL,
#        S_Customer_Username text NOT NULL,
#        S_Customer_Password text NOT NULL,
#        I_Customer_Verify INT NOT NULL,
#        D_Customer_Birthday DATE NOT NULL,
#        S_Customer_Phone text NOT NULL,
#        S_Customer_Post_Number text NOT NULL,
#        S_Customer_City text NOT NULL,
#        S_Customer_Town text NOT NULL,
#        S_Customer_Other text NOT NULL);''')

# print ("Customer_Account Table created successfully")

pgadmin.execute('''CREATE TABLE Fisherman_Account
       (I_Fisherman_ID SERIAL PRIMARY KEY NOT NULL,
       S_Fisherman_Account text NOT NULL,
       S_Fisherman_Password text NOT NULL,
       S_Fisherman_Username text NOT NULL,
       I_Fisherman_Verify integer NOT NULL,
       S_FisherMan_Owner text,
       S_Fisherman_Company text,
       S_Fisherman_Company_Serial text,
       S_Fisherman_Serial text,
       S_Fisherman_Phone text,
       S_Fisherman_Tele text,
       S_Fisherman_Blkchain_ID text NOT NULL,
       S_Fisherman_Blkchain_passwd text,
       S_Fisherman_Company_Address text,
       S_Fisherman_Port text,
       I_Fisherman_Role INT NOT NULL,
       S_Platform_Number text NOT NULL);''')


print ("Ship_Account Table created successfully")

# pgadmin.execute('''CREATE TABLE Admin_Account
#        (I_Admin_ID SERIAL PRIMARY KEY NOT NULL,
#        S_Admin_First_Name text NOT NULL,
#        S_Admin_Last_Name text NOT NULL,
#        S_Adnim_Username text NOT NULL,
#        S_Admin_Account text NOT NULL,
#        S_Admin_Password text NOT NULL);''')


# print ("Admin_Account Table created successfully")

pg.commit()
pg.close()

