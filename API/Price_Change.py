import psycopg2, json, configparser, os

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)
    
def price_change(S_Platform_Number, price1, price2, price3, price4, price5):
    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s' %("Fish_" + S_Platform_Number))
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if(raw[13] == 0 | raw[13] == 1):
            if(raw[2] == "Tuna"):
                pgadmin.execute("UPDATE %s SET I_Goods_Price = %s WHERE S_Fish_Name = 'Tuna';" %("Fish_" + S_Platform_Number, int(raw[3] * int(price1))))
            elif(raw[2] == "Swordfish"):
                pgadmin.execute("UPDATE %s SET I_Goods_Price = %s WHERE S_Fish_Name = 'Swordfish';" %("Fish_" + S_Platform_Number, int(raw[3] * int(price2))))
            elif(raw[2] == "Grouper"):
                pgadmin.execute("UPDATE %s SET I_Goods_Price = %s WHERE S_Fish_Name = 'Grouper';" %("Fish_" + S_Platform_Number, int(raw[3] * int(price3))))
            elif(raw[2] == "Mackerel"):
                pgadmin.execute("UPDATE %s SET I_Goods_Price = %s WHERE S_Fish_Name = 'Mackerel';" %("Fish_" + S_Platform_Number, int(raw[3] * int(price4))))
            elif(raw[2] == "Mahi_mahi"):
                pgadmin.execute("UPDATE %s SET I_Goods_Price = %s WHERE S_Fish_Name = 'Mahi_mahi';" %("Fish_" + S_Platform_Number, int(raw[3] * int(price5))))
            pg.commit()