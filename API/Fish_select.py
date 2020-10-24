import psycopg2, json, configparser, os

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)

def fish_select(request_data, S_Platform_Number):
    data_out = []
    if(request_data["I_Price_Up"] == "0"):
        I_Price_Up = 10000000000
    else:
        I_Price_Up = int(request_data["I_Price_Up"])

    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    for x in range(len(S_Platform_Number)):
        pgadmin.execute("SELECT * FROM %s;" %("Fish_" + S_Platform_Number[x]))
        data_db = pgadmin.fetchall()
        for raw in data_db:
            data_json = {}
            if(raw[13] == 1):
                if((bin(int(request_data["S_Fish_Name"]) + 32)[7] == "1") & (raw[2] == "Tuna")):
                    data_json = json_add(raw)
                    if((int(request_data["I_Price_Low"]) < int(raw[12])) & (I_Price_Up > int(raw[12]))):
                        data_out.append(data_json)
                elif((bin(int(request_data["S_Fish_Name"]) + 32)[6] == "1") & (raw[2] == "Swordfish")):
                    data_json = json_add(raw)
                    if((int(request_data["I_Price_Low"]) < int(raw[12])) & (I_Price_Up > int(raw[12]))):
                        data_out.append(data_json)
                elif((bin(int(request_data["S_Fish_Name"]) + 32)[5] == "1") & (raw[2] == "Grouper")):
                    data_json = json_add(raw)
                    if((int(request_data["I_Price_Low"]) < int(raw[12])) & (I_Price_Up > int(raw[12]))):
                        data_out.append(data_json)
                elif((bin(int(request_data["S_Fish_Name"]) + 32)[4] == "1") & (raw[2] == "Mackerel")):
                    data_json = json_add(raw)
                    if((int(request_data["I_Price_Low"]) < int(raw[12])) & (I_Price_Up > int(raw[12]))):
                        data_out.append(data_json)
                elif((bin(int(request_data["S_Fish_Name"]) + 32)[3] == "1") & (raw[2] == "Mahi_mahi")):
                    data_json = json_add(raw)
                    if((int(request_data["I_Price_Low"]) < int(raw[12])) & (I_Price_Up > int(raw[12]))):
                        data_out.append(data_json)
    return data_out



def json_add(raw):
    data_json = {}
    data_json["S_Fish_Hash_Code"] = raw[1]
    data_json["S_Fish_Name"] = raw[2]
    data_json["S_Fish_Weight"] = raw[3]
    data_json["S_Fish_Length"] = raw[4]
    data_json["S_Fish_Picture"] = raw[5]
    data_json["S_Fish_Datetime"] = str(raw[6])
    data_json["S_Fish_Location_X"] = raw[7]
    data_json["S_Fish_Location_Y"] = raw[8]
    data_json["S_Fish_Depth"] = raw[9]
    data_json["S_Fish_Temperature"] = raw[10]
    data_json["S_Goods_Number"] = raw[11]
    data_json["I_Goods_price"] = raw[12]
    return data_json

