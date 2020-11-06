import psycopg2, json, configparser, os, datetime
from flask import Flask, request
from flask_cors import CORS, cross_origin
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from SMTP import sent_mail
from Verification import generate_verification_code as Verify_Code
from eth_create_account import create_account as eth_create_account
from Create_Table.Fisherman_Table_Create import create_price_table, create_sensor_table, create_fish_table, create_trade_table
from Create_Table.Customer_Table_Create import create_cart_table, create_trade_table
from Price_Week_Count import week_count
from Price_Change import price_change
from Fish_select import fish_select
from CHT_IOT import create_ship_device, create_fish_device


app = Flask(__name__)

path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)

ABC = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]


@app.route(config['ROUTER']['app_router_Customer'] + '/Sign_up', methods = ['POST'])
@cross_origin()
def Customer_Sign_up():
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    data_json = {}
    pgadmin.execute("SELECT * FROM Customer_Account")
    data_db = pgadmin.fetchall()
    request_data = request.get_json()
    INSERT = '''INSERT INTO Customer_Account(S_Customer_First_Name, S_Customer_Last_Name, S_Customer_Account, S_Customer_Username, S_Customer_Password, I_Customer_Verify, D_Customer_Birthday, 
                                    S_Customer_Phone, S_Customer_Post_Number, S_Customer_City, S_Customer_Town, S_Customer_Other) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''

    for raw in data_db:
        if((request_data['S_Customer_Account'] == str(raw[3])) & (request_data['S_Customer_Username'] == raw[4])):
            data_json['S_Customer_Account'] = request_data['S_Customer_Account']
            data_json['S_Customer_Username'] = request_data['S_Customer_Username']
            data_json['S_Customer_Signup_Status'] = "1"
            data_json['S_Customer_Signup_Log'] = 'Account and Username existed'
            return json.dumps(data_json), 400

        elif(request_data['S_Customer_Account'] == raw[3]):
            data_json['S_Customer_Account'] = request_data['S_Customer_Account']
            data_json['S_Customer_Username'] = request_data['S_Customer_Username']
            data_json['S_Customer_Signup_Status'] = "2"
            data_json['S_Customer_Signup_Log'] = 'Account existed'
            return json.dumps(data_json), 400

        elif(request_data['S_Customer_Username'] == raw[4]):
            data_json['S_Customer_Account'] = request_data['S_Customer_Account']
            data_json['S_Customer_Username'] = request_data['S_Customer_Username']
            data_json['S_Customer_Signup_Status'] = "3"
            data_json['S_Customer_Signup_Log'] = 'Username existed'
            return json.dumps(data_json), 400

    create_cart_table(request_data['S_Customer_Username'])
    create_trade_table(request_data['S_Customer_Username'])

    insert_data = (request_data['S_Customer_First_Name'], 
                    request_data['S_Customer_Last_Name'],
                    request_data['S_Customer_Account'],
                    request_data['S_Customer_Username'],
                    request_data['S_Customer_Password'],
                    '0',
                    request_data['D_Customer_Birthday'],
                    request_data['S_Customer_Phone'],
                    request_data['S_Customer_Post_Number'],
                    request_data['S_Customer_City'],
                    request_data['S_Customer_Town'],
                    request_data['S_Customer_Other']) 
    pgadmin.execute(INSERT, insert_data)
    pg.commit()

    data_json['S_Customer_Account'] = request_data['S_Customer_Account']
    data_json['S_Customer_Username'] = request_data['S_Customer_Username']
    data_json['S_Customer_Signup_Status'] = "0"
    data_json['S_Customer_Signup_Log'] = 'Sign up done'
    Verify = Verify_Code(6)
    data_json['S_Customer_Verify_Code'] = Verify
    sent_mail(request_data['S_Customer_Account'], Verify)
    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Customer'] + '/Login', methods = ['POST'])
@cross_origin()
def Customer_Login():
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    data_json = {}
    request_data = request.get_json()
    pgadmin.execute("SELECT * FROM Customer_Account")
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if((request_data['S_Customer_Account'] == raw[3]) & (request_data['S_Customer_Password'] == raw[5]) & (raw[6] == 1)):
            data_json['S_Customer_Account'] = request_data['S_Customer_Account']
            data_json['S_Customer_Username'] = raw[4]
            data_json['S_Customer_Login_Status'] = '0'
            data_json['S_Customer_Login_Log'] = 'Login Success'
            return json.dumps(data_json), 200
        elif ((request_data['S_Customer_Account'] == raw[3]) & (request_data['S_Customer_Password'] == raw[5]) & (raw[6] == 0)):
            data_json['S_Customer_Account'] = request_data['S_Customer_Account']
            data_json['S_Customer_Username'] = raw[4]
            data_json['S_Customer_Login_Status'] = '1'
            data_json['S_Customer_Login_Log'] = 'Please Verify your email account'
            return json.dumps(data_json), 400
        elif ((request_data['S_Customer_Account'] == raw[3]) & (request_data['S_Customer_Password'] != raw[5])):
            data_json['S_Customer_Account'] = request_data['S_Customer_Account']
            data_json['S_Customer_Login_Status'] = '2'
            data_json['S_Customer_Login_Log'] = 'Incorrect Password'
            return json.dumps(data_json), 400
    
    data_json['S_Customer_Account'] = request_data['S_Customer_Account']
    data_json['S_Customer_Login_Status'] = '3'
    data_json['S_Customer_Login_Log'] = 'Account does not exist'
    return json.dumps(data_json), 400      


@app.route(config['ROUTER']['app_router_Customer'] + '/Verify', methods = ['POST'])
@cross_origin()
def Customer_Verify():
    pg = psycopg2.connect(database = config['POSTGRES']['Account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    data_json = {}
    request_data = request.get_json()
    pgadmin.execute("SELECT * FROM Customer_Account")
    data_db = pgadmin.fetchall()

    if(request_data['S_Customer_Verifiy_Status'] == '1'):
        for raw in data_db:
            if(request_data['S_Customer_Account'] == raw[3]):
                id_change = raw[0]
                pgadmin.execute("UPDATE Customer_Account SET I_Customer_Verify = '1' WHERE I_Customer_ID = '%s'; " %id_change)
                pg.commit()
                
                data_json['S_Customer_Account'] = request_data['S_Customer_Account']
                data_json['S_Customer_Verifiy_Status'] = '0'
                data_json['S_Customer_Verifiy_Log'] = 'Verify success'

                return json.dumps(data_json), 200
            
        data_json['S_Customer_Account'] = request_data['S_Customer_Account']
        data_json['S_Customer_Verifiy_Status'] = '1'
        data_json['S_Customer_Verifiy_Log'] = 'Account does not exist'

        return json.dumps(data_json), 400
        

@app.route(config['ROUTER']['app_router_Fisherman'] + '/Sign_up', methods = ['POST'])
@cross_origin()
def Fisherman_Sign_up():
    pg = psycopg2.connect(database = config['POSTGRES']['Account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    data_json = {}
    request_data = request.get_json()
    pgadmin.execute("SELECT * FROM Fisherman_Account")
    data_db = pgadmin.fetchall()

    INSERT = '''INSERT INTO Fisherman_Account(S_Fisherman_Account, S_Fisherman_Password, S_Fisherman_Username, I_Fisherman_Verify, S_Fisherman_Owner, S_Fisherman_Company, S_Fisherman_Company_Serial, S_Fisherman_Serial, 
                                    S_Fisherman_Phone, S_Fisherman_Tele, S_Fisherman_Blkchain_ID, S_Fisherman_Blkchain_passwd, S_Fisherman_Company_Address, S_Fisherman_Port, I_Fisherman_Role, S_Platform_Number) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s)'''

    I_Fisherman_ID = 1

    for raw in data_db:
        if(raw[15] == 0):
            I_Fisherman_ID = I_Fisherman_ID + 1
        if((request_data['S_Fisherman_Account'] == raw[1]) & (request_data['S_Fisherman_Username'] == raw[3])):
            data_json['S_Fisherman_Account'] = request_data['S_Fisherman_Account']
            data_json['S_Fisherman_Username'] = request_data['S_Fisherman_Username']
            data_json['S_Fisherman_Signup_Status'] = '1'
            data_json['S_Fisherman_Signup_Log'] = 'Account and username is existed'
            return json.dumps(data_json), 400
        elif(request_data['S_Fisherman_Account'] == raw[1]):
            data_json['S_Fisherman_Account'] = request_data['S_Fisherman_Account']
            data_json['S_Fisherman_Signup_Status'] = '2'
            data_json['S_Fisherman_Signup_Log'] = 'Account is existed'
            return json.dumps(data_json), 400
        elif(request_data['S_Fisherman_Username'] == raw[3]):
            data_json['S_Fisherman_Username'] = request_data['S_Fisherman_Username']
            data_json['S_Fisherman_Signup_Status'] = '3'
            data_json['S_Fisherman_Signup_Log'] = 'Username is existed'
            return json.dumps(data_json), 400

    eth_account = eth_create_account(request_data['S_Fisherman_Blkchain_passwd']);
    
    S_Platform_Number = str(ABC[int(I_Fisherman_ID / 676 % 26)]) + str(ABC[int(I_Fisherman_ID / 26 % 26)]) + str(ABC[int(I_Fisherman_ID % 26)])

    create_sensor_table(S_Platform_Number)
    create_price_table(S_Platform_Number)
    create_fish_table(S_Platform_Number)
    create_trade_table(S_Platform_Number)
    create_ship_device(S_Platform_Number)
    cht_create_fish(S_Platform_Number)


    insert_data = (
        request_data['S_Fisherman_Account'],
        request_data['S_Fisherman_Password'],
        request_data['S_Fisherman_Username'],
        '0',
        request_data['S_Fisherman_Owner'],
        request_data['S_Fisherman_Company'],
        request_data['S_Fisherman_Company_Serial'],
        request_data['S_Fisherman_Serial'],
        request_data['S_Fisherman_Phone'],
        request_data['S_Fisherman_Tele'],
        eth_account,
        request_data['S_Fisherman_Blkchain_passwd'],
        request_data['S_Fisherman_Company_Address'],
        request_data['S_Fisherman_Port'],
        request_data['I_Fisherman_Role'],
        S_Platform_Number
    )

    pgadmin.execute(INSERT, insert_data)
    pg.commit()

    
    data_json['S_Fisherman_Account'] = request_data['S_Fisherman_Account']
    data_json['S_Fisherman_Signup_Status'] = '0'
    data_json['S_Fisherman_Signup_Log'] = 'Sign up success'


    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Fisherman'] + '/Login', methods = ['POST'])
@cross_origin()
def Fisherman_Login():
    pg = psycopg2.connect(database = config['POSTGRES']['Account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    data_json = {}
    request_data = request.get_json()
    pgadmin.execute("SELECT * FROM Fisherman_Account")
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if((request_data['S_Fisherman_Account'] == raw[1]) & (request_data['S_Fisherman_Password'] == raw[2]) & (raw[4] == 1)):
            data_json['S_Fisherman_Account'] = request_data['S_Fisherman_Account']
            data_json['S_Fisherman_Username'] = raw[3]
            data_json['S_Fisherman_Login_Status'] = '0'
            data_json['S_Fisherman_Login_Log'] = 'Login success'
            return json.dumps(data_json), 200
        elif((request_data['S_Fisherman_Account'] == raw[1]) & (request_data['S_Fisherman_Password'] == raw[2]) & (raw[4] == 0)):
            data_json['S_Fisherman_Account'] = request_data['S_Fisherman_Account']
            data_json['S_Fisherman_Login_Status'] = '1'
            data_json['S_Fisherman_Login_Log'] = 'Please Verify your email account'
            return json.dumps(data_json), 400
        elif((request_data['S_Fisherman_Account'] == raw[1]) & (request_data['S_Fisherman_Password'] != raw[2])):
            data_json['S_Fisherman_Account'] = request_data['S_Fisherman_Account']
            data_json['S_Fisherman_Login_Status'] = '2'
            data_json['S_Fisherman_Login_Log'] = 'Incorrect Password'
            return json.dumps(data_json), 400

    data_json['S_Fisherman_Account'] = request_data['S_Fisherman_Account']
    data_json['S_Fisherman_Login_Status'] = '3'
    data_json['S_Fisherman_Login_Log'] = 'Account does not exist'
    return json.dumps(data_json), 400


@app.route(config['ROUTER']['app_router_Fisherman'] + '/Fix', methods = ['POST'])
@cross_origin()
def Ship_Fix():
    pg = psycopg2.connect(database = config['POSTGRES']['ship_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    data_json = {}
    request_data = request.get_json()

    INSERT = '''INSERT INTO Ship_Fix(D_Ship_Fix_Time, S_Fisherman_Account, S_Ship_Fix_Item, S_Ship_Fix_Log, I_Ship_Fix_Finish) 
                VALUES(%s, %s, %s, %s, %s)'''
    
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours=8))
    insert_data = (
        datetime.datetime.now().replace(tzinfo=tz_utc_8), 
        request_data['S_Fisherman_Account'], 
        request_data['S_Ship_Fix_Item'], 
        request_data['S_Ship_Fix_Log'], 
        '0'
    )
    print(datetime.datetime.now().replace(tzinfo=tz_utc_8))
    pgadmin.execute(INSERT, insert_data)
    pg.commit()

    data_json['S_Ship_Fix_Status'] = 'Received'

    return json.dumps(data_json)


@app.route(config['ROUTER']['app_router_Fisherman'] + '/Fish_list', methods = ['POST'])
@cross_origin()
def fish_list():
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    request_Fish = request.get_json()
    data_db = pgadmin.fetchall()

    data_out = [{"S_Fisherman_Fish_list_Status":  "0", "S_Fisherman_Fish_list_Log":  "Account does not exist"}]
    S_Platform_Number = "NULL"

    for raw in data_db:
        if(request_Fish["S_Fisherman_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    if(S_Platform_Number == "NULL"):
        return json.dumps(data_out), 400

    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s;' %("Fish_" + S_Platform_Number))
    data_db = pgadmin.fetchall()

    day = datetime.timedelta(days=1) 
    tz_utc_0 = datetime.timezone(datetime.timedelta(hours=0))
    now_0 = datetime.datetime.now().astimezone(tz_utc_0)
    now_24 = now_0 - day
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    data_out[0] = {"S_Fisherman_Fish_list_Status": "1", "S_Fisherman_Fish_list_Log":  "Success"}
    for raw in data_db:
        if(raw[6] > now_24):
            data_json = {}
            data_json["S_Fish_Hash_Code"] = raw[1]
            data_json["S_Fish_Name"] = raw[2]
            data_json["S_Fish_Weight"] = raw[3]
            data_json["S_Fish_Length"] = raw[4]
            data_json["S_Fish_Picture"] = raw[5]
            data_json["S_Fish_Datetime"] = str(raw[6].astimezone(tz_utc_8))
            data_json["S_Fish_Location_X"] = raw[7]
            data_json["S_Fish_Location_Y"] = raw[8]
            data_json["S_Fish_Depth"] = raw[9]
            data_json["S_Fish_Temperature"] = raw[10]
            data_out.append(data_json)
        
    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Admin'] + '/Fix_list', methods = ['GET'])
@cross_origin()
def Admin_Fix_list():
    pg = psycopg2.connect(database = config['POSTGRES']['ship_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Ship_Fix')
    data_db = pgadmin.fetchall()
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    data_out = []
    for raw in data_db:
        data_json = {}
        data_json['D_Ship_Fix_ID'] = raw[0]
        data_json['D_Ship_Fix_Time'] = str(raw[1].astimezone(tz_utc_8))
        data_json['S_Fisherman_Account'] = raw[2]
        data_json['S_Ship_Fix_Item'] = raw[3]
        data_json['S_Ship_Fix_Log'] = raw[4]
        data_json['S_Ship_Fix_Finish'] = raw[5]
        data_out.append(data_json)

    return json.dumps(data_out)


@app.route(config['ROUTER']['app_router_Seller'] + '/Set_Price', methods = ['POST'])
@cross_origin()
def set_price():
    data_json = {}
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    request_Fish = request.get_json()
    data_db = pgadmin.fetchall()
    
    for raw in data_db:
        if(request_Fish["S_Seller_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s' %("Price_" + S_Platform_Number))
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if(week_count(request_Fish["S_Price_Week"]) == raw[1]):
            I_Price_ID = raw[0]
            pgadmin.execute("UPDATE %s SET %s = %s, %s = %s, %s = %s, %s = %s, %s = %s WHERE I_Price_ID = %s;" %(("Price_" + S_Platform_Number), config['FISH']['fish_1'],  request_Fish[config['FISH']['fish_1']], config['FISH']['fish_2'], request_Fish[config['FISH']['fish_2']], config['FISH']['fish_3'], request_Fish[config['FISH']['fish_3']], config['FISH']['fish_4'], request_Fish[config['FISH']['fish_4']], config['FISH']['fish_5'],  request_Fish[config['FISH']['fish_5']], I_Price_ID))
            pg.commit()
            if(request_Fish["S_Price_Week"] == '1'):
                price_change(S_Platform_Number, request_Fish[config['FISH']['fish_1']], request_Fish[config['FISH']['fish_2']],  request_Fish[config['FISH']['fish_3']], request_Fish[config['FISH']['fish_4']], request_Fish[config['FISH']['fish_5']])
                
            data_json["S_Seller_Account"] = request_Fish["S_Seller_Account"]
            data_json["S_Price_Week"] = week_count(request_Fish["S_Price_Week"])
            data_json["I_Price_Set_Status"] = "2"
            data_json["S_Price_Set_Log"] = "Update success"

            return json.dumps(data_json), 200

    if(request_Fish["S_Price_Week"] == '1'):
        price_change(S_Platform_Number, request_Fish[config['FISH']['fish_1']], request_Fish[config['FISH']['fish_2']],  request_Fish[config['FISH']['fish_3']], request_Fish[config['FISH']['fish_4']], request_Fish[config['FISH']['fish_5']])

    INSERT = '''INSERT INTO %s(S_Price_Week, %s, %s, %s, %s, %s)''' %(("Price_" + str(S_Platform_Number)), config['FISH']['fish_1'], config['FISH']['fish_2'], config['FISH']['fish_3'], config['FISH']['fish_4'], config['FISH']['fish_5']) + '''VALUES(%s, %s, %s, %s, %s, %s)'''  

    insert_data = (
        week_count(request_Fish["S_Price_Week"]),
        request_Fish[config['FISH']['fish_1']],
        request_Fish[config['FISH']['fish_2']],
        request_Fish[config['FISH']['fish_3']],
        request_Fish[config['FISH']['fish_4']],
        request_Fish[config['FISH']['fish_5']]
    )

    pgadmin.execute(INSERT, insert_data)
    pg.commit()
    
    data_json["S_Seller_Account"] = request_Fish["S_Seller_Account"]
    data_json["S_Price_Week"] = week_count(request_Fish["S_Price_Week"])
    data_json["I_Price_Set_Status"] = "1"
    data_json["S_Price_Set_Log"] = "Add success"

    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Seller'] + '/Login', methods = ['POST'])
@cross_origin()
def seller_login():
    data_json = {}
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()
    request_data = request.get_json()

    for raw in data_db:
        if((request_data["S_Seller_Account"] == raw[1]) & (request_data["S_Seller_Password"] == raw[2])):
            data_json["S_Seller_Account"] = request_data["S_Seller_Account"]
            data_json["S_Seller_Username"] = raw[3]
            data_json["S_Seller_Login_Status"] = "0"
            data_json["S_Seller_Login_Log"] = "Login success"
            return json.dumps(data_json), 200
        elif((request_data["S_Seller_Account"] == raw[1]) & (request_data["S_Seller_Password"] != raw[2])):
            data_json["S_Seller_Account"] = request_data["S_Seller_Account"]
            data_json["S_Seller_Login_Status"] = "1"
            data_json["S_Seller_Login_Log"] = "Password incorrect"
            return json.dumps(data_json), 400
            
    data_json["S_Seller_Account"] = request_data["S_Seller_Account"]
    data_json["S_Seller_Login_Status"] = "2"
    data_json["S_Seller_Login_Log"] = "Account does not exist"
    return json.dumps(data_json), 400


@app.route(config['ROUTER']['app_router_Seller'] + '/Price_list', methods = ['POST'])
@cross_origin()
def seller_price_list():
    data_out = []
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()
    request_data = request.get_json()

    for raw in data_db:
        if(request_data["S_Seller_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s' %("Price_" + S_Platform_Number))
    data_db = pgadmin.fetchall()
    I_Price_Number = 0
    data_json = {}
    data_json1 = {}
    data_json2 = {}
    data_json3 = {}
    for raw in data_db:
        if(raw[1] == week_count("0")):
            data_json1["S_Price_Week"] = raw[1]
            data_json1["S_Price_Week_Status"] = "0"
            data_json1[config['FISH']['fish_1']] = raw[2]
            data_json1[config['FISH']['fish_2']] = raw[3]
            data_json1[config['FISH']['fish_3']] = raw[4]
            data_json1[config['FISH']['fish_4']] = raw[5]
            data_json1[config['FISH']['fish_5']] = raw[6]
            I_Price_Number = I_Price_Number + 1
        elif(raw[1] == week_count("1")):
            data_json2["S_Price_Week"] = raw[1]
            data_json2["S_Price_Week_Status"] = "1"
            data_json2[config['FISH']['fish_1']] = raw[2]
            data_json2[config['FISH']['fish_2']] = raw[3]
            data_json2[config['FISH']['fish_3']] = raw[4]
            data_json2[config['FISH']['fish_4']] = raw[5]
            data_json2[config['FISH']['fish_5']] = raw[6]
            I_Price_Number = I_Price_Number + 2
        elif(raw[1] == week_count("2")):
            data_json3["S_Price_Week"] = raw[1]
            data_json3["S_Price_Week_Status"] = "2"
            data_json3[config['FISH']['fish_1']] = raw[2]
            data_json3[config['FISH']['fish_2']] = raw[3]
            data_json3[config['FISH']['fish_3']] = raw[4]
            data_json3[config['FISH']['fish_4']] = raw[5]
            data_json3[config['FISH']['fish_5']] = raw[6]
            I_Price_Number = I_Price_Number + 4
    data_json["I_Price_Number"] = I_Price_Number
    data_out.append(data_json)   
    data_out.append(data_json1)   
    data_out.append(data_json2)   
    data_out.append(data_json3)   

    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Admin'] + '/Fisherman_list', methods = ['GET'])
@cross_origin()
def Fisherman_list():
    data_out = []
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()

    for raw in data_db:
        data_json = {}
        data_json["S_Fisherman_ID"] = raw[0]
        data_json["S_Fisherman_Account"] = raw[1]
        data_json["S_Fisherman_Password"] = raw[2]
        data_json["S_Fisherman_Username"] = raw[3]
        data_json["I_Fisherman_Verify"] = raw[4]
        data_json["S_Fisherman_Owner"] = raw[5]
        data_json["S_Fisherman_Company"] = raw[6]
        data_json["S_Fisherman_Company_Serial"] = raw[7]
        data_json["S_Fisherman_Serial"] = raw[8]
        data_json["S_Fisherman_Phone"] = raw[9]
        data_json["S_Fisherman_Tele"] = raw[10]
        data_json["S_Fisherman_Blkchain_ID"] = raw[11]
        data_json["S_Fisherman_Blkchain_passwd"] = raw[12]
        data_json["S_Fisherman_Company_Address"] = raw[13]
        data_json["S_Fisherman_Port"] = raw[14]
        data_out.append(data_json)

    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Admin'] + '/Customer_list', methods = ['GET'])
@cross_origin()
def customer_lisr():
    data_out = []
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Customer_Account')
    data_db = pgadmin.fetchall()

    for raw in data_db:
        data_json = {}
        data_json["S_Customer_ID"] = raw[0]
        data_json["S_Customer_First_Name"] = raw[1]
        data_json["S_Customer_Last_Name"] = raw[2]
        data_json["S_Customer_Account"] = raw[3]
        data_json["S_Customer_Username"] = raw[4]
        data_json["S_Customer_Password"] = raw[5]
        data_json["I_Customer_Verify"] = raw[6]
        data_json["D_Customer_Birthday"] = str(raw[7])
        data_json["S_Customer_Phone"] = raw[8]
        data_json["S_Customer_Post_Number"] = raw[9]
        data_json["S_Customer_City"] = raw[10]
        data_json["S_Customer_Town"] = raw[11]
        data_json["S_Customer_Other"] = raw[12]
        data_out.append(data_json)

    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Seller'] + '/Unshelf_list', methods = ['POST'])
@cross_origin()
def unsell_list():
    data_out = []
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()
    request_data = request.get_json()

    for raw in data_db:
        if(request_data["S_Seller_Account"] == raw[1]):
            S_Platform_Number = raw[16]
    
    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s;' %("Fish_" + S_Platform_Number))
    data_db = pgadmin.fetchall()
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    for raw in data_db:
        data_json = {}
        if(raw[13] == 0):
            data_json["S_Fish_Hash_Code"] = raw[1]
            data_json["S_Fish_Name"] = raw[2]
            data_json["S_Fish_Weight"] = raw[3]
            data_json["S_Fish_Length"] = raw[4]
            data_json["S_Fish_Picture"] = raw[5]
            data_json["S_Fish_Datetime"] = str(raw[6].astimezone(tz_utc_8))
            data_json["S_Fish_Location_X"] = raw[7]
            data_json["S_Fish_Location_Y"] = raw[8]
            data_json["S_Fish_Depth"] = raw[9]
            data_json["S_Fish_Temperature"] = raw[10]
            data_json["S_Goods_Number"] = raw[11]
            data_json["I_Goods_price"] = raw[12]
            data_out.append(data_json)


    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Seller'] + '/Put_Shelf', methods = ['POST'])
@cross_origin()
def put_shelf():
    data_json = {}
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()
    request_data = request.get_json()

    for raw in data_db:
        if(request_data[0]["S_Seller_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s;' %("Fish_" + S_Platform_Number))
    data_db = pgadmin.fetchall()

    for x in range((len(request_data) - 1)):
        for raw in data_db:
            if((request_data[x + 1]["S_Goods_Number"] == raw[11]) & (raw[13] == 0)):
                pgadmin.execute("UPDATE %s SET I_Goods_Status = '1' WHERE I_Fish_ID = '%s'; " %(("Fish_" + S_Platform_Number), raw[0]))
                pg.commit()
                break

    data_json["S_Put_Shelf_Status"] = "0"
    data_json["S_Put_Shelf_Log"] = "Put shelf success"
    
    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Seller'] + '/Shelf_list', methods = ['POST'])
@cross_origin()
def shelf_list():
    data_out = []
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()
    request_data = request.get_json()

    for raw in data_db:
        if(request_data["S_Seller_Account"] == raw[1]):
            S_Platform_Number = raw[16]
    
    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s;' %("Fish_" + S_Platform_Number))
    data_db = pgadmin.fetchall()
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    for raw in data_db:
        data_json = {}
        if(raw[13] == 1):
            data_json["S_Fish_Hash_Code"] = raw[1]
            data_json["S_Fish_Name"] = raw[2]
            data_json["S_Fish_Weight"] = raw[3]
            data_json["S_Fish_Length"] = raw[4]
            data_json["S_Fish_Picture"] = raw[5]
            data_json["S_Fish_Datetime"] = str(raw[6].astimezone(tz_utc_8))
            data_json["S_Fish_Location_X"] = raw[7]
            data_json["S_Fish_Location_Y"] = raw[8]
            data_json["S_Fish_Depth"] = raw[9]
            data_json["S_Fish_Temperature"] = raw[10]
            data_json["S_Goods_Number"] = raw[11]
            data_json["I_Goods_price"] = raw[12]
            data_out.append(data_json)


    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Customer'] + '/Goods_list', methods = ['POST'])
@cross_origin()
def goods_list():
    S_Platform_Number = []
    data_out = []
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute("SELECT * FROM Fisherman_Account;")
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if(raw[15] == 0):
            S_Platform_Number.append(raw[16])

    data_out = fish_select(request_data, S_Platform_Number)

    return json.dumps(data_out)


@app.route(config['ROUTER']['app_router_Seller'] + '/Down_Shelf', methods = ['POST'])
@cross_origin()
def down_shelf():
    data_json = {}
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()
    request_data = request.get_json()

    for raw in data_db:
        if(request_data[0]["S_Seller_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s;' %("Fish_" + S_Platform_Number))
    data_db = pgadmin.fetchall()

    for x in range((len(request_data) - 1)):
        for raw in data_db:
            if((request_data[x + 1]["S_Goods_Number"] == raw[11]) & (raw[13] == 1)):
                pgadmin.execute("UPDATE %s SET I_Goods_Status = '0' WHERE I_Fish_ID = '%s'; " %(("Fish_" + S_Platform_Number), raw[0]))
                pg.commit()
                break

    data_json["S_Down_Shelf_Status"] = "0"
    data_json["S_Down_Shelf_Log"] = "Down shelf success"
    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Customer'] + '/Add/Shop_Cart', methods = ['POST'])
@cross_origin()
def add_shop_cart():
    data_json = {}
    pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    request_data = request.get_json()
    pgadmin.execute("SELECT * FROM %s" %("Cart_" + request_data["S_Customer_Username"]))
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if(raw[1] == request_data["S_Goods_Number"]):
            data_json["S_Customer_Username"] = request_data["S_Customer_Username"]
            data_json["S_Cart_Add_Status"] = "1"
            data_json["S_Cart_Add_Log"] = "Good is already in your cart"
            return json.dumps(data_json), 400

    
    INSERT = '''INSERT INTO %s(S_Goods_Number, I_Goods_Quantity)''' %("Cart_" + request_data["S_Customer_Username"]) + '''VALUES(%s, %s)'''  
    
    insert_data = (request_data["S_Goods_Number"], 1)
    pgadmin.execute(INSERT, insert_data)

    pg.commit()
    data_json["S_Customer_Username"] = request_data["S_Customer_Username"]
    data_json["S_Cart_Add_Status"] = "0"
    data_json["S_Cart_Add_Log"] = "Add success"
    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Customer'] + '/Delete/Shop_Cart', methods = ['POST'])
@cross_origin()
def delete_shop_cart():
    data_json = {}
    pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    request_data = request.get_json()    
    pgadmin.execute("SELECT * FROM %s" %("Cart_" + request_data["S_Customer_Username"]))
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if(request_data["S_Goods_Number"] == raw[1]):
            I_Cart_ID = raw[0]

    pgadmin.execute('''DELETE FROM %s WHERE I_Cart_ID = %s''' %(("Cart_" + request_data["S_Customer_Username"]), I_Cart_ID))

    pg.commit()
    data_json["S_Customer_Username"] = request_data["S_Customer_Username"]
    data_json["S_Cart_Delete_Status"] = "0"
    data_json["S_Cart_Delete_Log"] = "Delete success"
    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Customer'] + '/Cart_list', methods = ['POST'])
@cross_origin()
def cart_list():
    data_out = []
    S_Platform_Number = []
    pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    request_data = request.get_json()    
    pgadmin.execute("SELECT * FROM %s" %("Cart_" + request_data["S_Customer_Username"]))
    data_db = pgadmin.fetchall()

    for raw in data_db:
        S_Platform_Number.append(raw[1])
    S_Platform_Number.sort()

    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    for x in range(len(S_Platform_Number)):
        pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute("SELECT * FROM %s" %("Fish_" + S_Platform_Number[x][0:3]))
        data_db = pgadmin.fetchall()
        for raw in data_db:
            if(raw[11] == S_Platform_Number[x]):
                data_json = {}
                data_json["S_Fish_Hash_Code"] = raw[1]
                data_json["S_Fish_Name"] = raw[2]
                data_json["S_Fish_Weight"] = raw[3]
                data_json["S_Fish_Length"] = raw[4]
                data_json["S_Fish_Picture"] = raw[5]
                data_json["S_Fish_Datetime"] = str(raw[6].astimezone(tz_utc_8))
                data_json["S_Fish_Location_X"] = raw[7]
                data_json["S_Fish_Location_Y"] = raw[8]
                data_json["S_Fish_Depth"] = raw[9]
                data_json["S_Fish_Temperature"] = raw[10]
                data_json["S_Goods_Number"] = raw[11]
                data_json["S_Goods_Price"] = raw[12]
                data_out.append(data_json)
    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Customer'] + '/Goods_detail', methods = ['POST'])
@cross_origin()
def Goods_detail():
    request_data = request.get_json()
    data_json = {}
    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute("SELECT * FROM %s" %("Fish_" + request_data["S_Goods_Number"][0:3]))
    data_db = pgadmin.fetchall()
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    for raw in data_db:
        if(raw[11] == request_data["S_Goods_Number"]):
            data_json = {}
            data_json["S_Fish_Hash_Code"] = raw[1]
            data_json["S_Fish_Name"] = raw[2]
            data_json["S_Fish_Weight"] = raw[3]
            data_json["S_Fish_Length"] = raw[4]
            data_json["S_Fish_Picture"] = raw[5]
            data_json["S_Fish_Datetime"] = str(raw[6].astimezone(tz_utc_8))
            data_json["S_Fish_Location_X"] = raw[7]
            data_json["S_Fish_Location_Y"] = raw[8]
            data_json["S_Fish_Depth"] = raw[9]
            data_json["S_Fish_Temperature"] = raw[10]
            data_json["S_Goods_Number"] = raw[11]
            data_json["S_Goods_Price"] = raw[12]

    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Customer'] + '/Trade', methods = ['POST'])
@cross_origin()
def trade():
    data_json = {}
    S_Goods_Number = []
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    for x in range(len(request_data[1])):
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = 2 WHERE S_Goods_Number = '%s';''' %(("Fish_" + request_data[1][x]["S_Goods_Number"][0:3]), request_data[1][x]["S_Goods_Number"]))
        pg.commit()
        S_Goods_Number.append(request_data[1][x]["S_Goods_Number"])

    S_Goods_Number.sort()

    tz_utc_8 = datetime.timezone(datetime.timedelta(hours=8))
    pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    pgadmin.execute('''SELECT * FROM %s''' %("Trade_" + request_data[0]["S_Customer_Username"]))
    data_db = pgadmin.fetchall()
    S_Trade_ID = 0
    for raw in data_db:
        S_Trade_ID = raw[0]
    S_Trade_ID = S_Trade_ID + 1
    INSERT = '''INSERT INTO %s(S_Customer_Account, S_Customer_Username, S_Trade_Number, D_Trade_Time, S_Goods_Number, I_Goods_Quantity, I_Trade_Pay, S_Trade_Tax_ID, S_Trade_Logistics, S_Trade_Receiver, S_Receiver_Phone, I_Trade_Post_Number, S_Trade_Address, I_Goods_status)''' %("Trade_" + request_data[0]["S_Customer_Username"]) + '''VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) '''
    S_Trade_Number = str(request_data[1][0]["S_Goods_Number"][0:3]) + "-" + str(request_data[0]["S_Customer_Username"]) + "-" + str(S_Trade_ID)
    insert_data = (
        request_data[0]["S_Customer_Account"],
        request_data[0]["S_Customer_Username"],
        S_Trade_Number,
        str(datetime.datetime.now().replace(tzinfo=tz_utc_8)),
        S_Goods_Number,
        len(request_data) - 1,
        request_data[0]["I_Trade_Pay"],
        request_data[0]["S_Trade_Tax_ID"],
        request_data[0]["S_Trade_Logistics"],
        request_data[0]["S_Trade_Receiver"],
        request_data[0]["S_Receiver_Phone"],
        request_data[0]["I_Trade_Post_Number"],
        request_data[0]["S_Trade_Address"],
        "2"
    )

    pgadmin.execute(INSERT, insert_data)
    pg.commit()

    pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()

    for x in range(len(request_data[1])):
        pgadmin.execute('''UPDATE %s SET S_Trade_Number = '%s', I_Goods_Status = 2 WHERE S_Goods_Number = '%s';''' %(("Fish_" + request_data[1][x]["S_Goods_Number"][0:3]), S_Trade_Number, request_data[1][x]["S_Goods_Number"]))
        pg.commit()

    pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    INSERT = '''INSERT INTO %s(D_Trade_Datetime, S_Customer_Account, S_Customer_Username, S_Trade_Number, S_Goods_Number, I_Goods_Status)''' %("Trade_" + str(request_data[1][0]["S_Goods_Number"][0:3])) + '''VALUES(%s, %s, %s, %s, %s, %s)'''
    insert_data = (
        str(datetime.datetime.now().replace(tzinfo=tz_utc_8)),
        request_data[0]["S_Customer_Account"],
        request_data[0]["S_Customer_Username"],
        S_Trade_Number,
        S_Goods_Number, 
        "2"
    )

    pgadmin.execute(INSERT, insert_data)
    pg.commit()

    pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    for x in range(len(request_data[1])):
        pgadmin.execute('''DELETE FROM %s WHERE S_Goods_Number = '%s' ''' %(("Cart_" + request_data[0]["S_Customer_Username"]), request_data[1][x]["S_Goods_Number"]))
        pg.commit()



    data_json["S_Trade_Status"] = "Add success"
    data_json["S_Trade_Number"] = (S_Trade_Number)
    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Seller'] + '/Trade_list_nonfin', methods = ['POST'])
@cross_origin()
def seller_trade_list_nonfin():
    data_out = []
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('''SELECT * FROM Fisherman_Account''')
    data_db = pgadmin.fetchall()
    for raw in data_db:
        if(request_data["S_Seller_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('''SELECT * FROM %s''' %("Trade_" + str(S_Platform_Number)))
    data_db = pgadmin.fetchall()
    for raw in data_db:
        if((raw[6] == 2) | (raw[6] == 3)):
            S_Goods_Number = str(raw[5][1 : len(list(raw[5])) - 1]).split(",")
            data_json = {}
            data_json["D_Trade_Time"] = str(raw[1].astimezone(tz_utc_8))
            data_json["S_Customer_Account"] = raw[2]
            data_json["S_Customer_Username"] = raw[3]
            data_json["S_Trade_Number"] = raw[4]
            data_json["S_Goods_Number"] = S_Goods_Number
            data_json["S_Goods_Quantity"] = len(S_Goods_Number)
            pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
            pgadmin = pg.cursor()
            pgadmin.execute('''SELECT * FROM %s''' %("Fish_" + str(S_Goods_Number[0][0:3])))
            data_db1 = pgadmin.fetchall()
            I_Goods_Total = 0
            for x in range(len(S_Goods_Number)):
                for raw1 in data_db1:
                    if(S_Goods_Number[x] == raw1[11]):
                        data_json["S_Goods_Status"] = raw1[13]
                        I_Goods_Total = I_Goods_Total + int(raw1[12])
                        break
            data_json["I_Goods_Total"] = I_Goods_Total
            data_out.append(data_json)

    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Seller'] + '/Trade_list_fin', methods = ['POST'])
@cross_origin()
def seller_trade_list_fin():
    data_out = []
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('''SELECT * FROM Fisherman_Account''')
    data_db = pgadmin.fetchall()
    for raw in data_db:
        if(request_data["S_Seller_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('''SELECT * FROM %s''' %("Trade_" + str(S_Platform_Number)))
    data_db = pgadmin.fetchall()
    for raw in data_db:
        if(raw[6] == 4):
            S_Goods_Number = str(raw[5][1 : len(list(raw[5])) - 1]).split(",")
            data_json = {}
            data_json["D_Trade_Time"] = str(raw[1].astimezone(tz_utc_8))
            data_json["S_Customer_Account"] = raw[2]
            data_json["S_Customer_Username"] = raw[3]
            data_json["S_Trade_Number"] = raw[4]
            data_json["S_Goods_Number"] = S_Goods_Number
            data_json["S_Goods_Quantity"] = len(S_Goods_Number)
            pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
            pgadmin = pg.cursor()
            pgadmin.execute('''SELECT * FROM %s''' %("Fish_" + str(S_Goods_Number[0][0:3])))
            data_db1 = pgadmin.fetchall()
            I_Goods_Total = 0
            for x in range(len(S_Goods_Number)):
                for raw1 in data_db1:
                    if(S_Goods_Number[x] == raw1[11]):
                        data_json["S_Goods_Status"] = raw1[13]
                        I_Goods_Total = I_Goods_Total + int(raw1[12])
                        break
            data_json["I_Goods_Total"] = I_Goods_Total
            data_out.append(data_json)

    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Customer'] + '/Trade_list_nonfin', methods = ['POST'])
@cross_origin()
def customer_trade_list_nonfin():
    data_out = []
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('''SELECT * FROM %s''' %("Trade_" + request_data["S_Customer_Username"]))
    data_db = pgadmin.fetchall()
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))

    for raw in data_db:
        if((raw[14] == 2) | (raw[14] == 3)):
            data_json = {}
            data_json["D_Trade_Time"] = str(raw[4].astimezone(tz_utc_8))
            data_json["S_Trade_Number"] = raw[3]
            S_Goods_Number = str(raw[5][1 : len(list(raw[5])) - 1]).split(",")
            data_json["S_Goods_Quantity"] = len(S_Goods_Number)
            data_json["S_Goods_Number"] = S_Goods_Number
            pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
            pgadmin = pg.cursor()
            pgadmin.execute('''SELECT * FROM %s''' %("Fish_" + str(S_Goods_Number[0][0:3])))
            data_db1 = pgadmin.fetchall()
            I_Goods_Total = 0
            for x in range(len(S_Goods_Number)):
                for raw1 in data_db1:
                    if(S_Goods_Number[x] == raw1[11]):
                        data_json["S_Goods_Status"] = raw1[13]
                        I_Goods_Total = I_Goods_Total + int(raw1[12])
                        break
            data_json["I_Goods_Total"] = I_Goods_Total
            data_json["S_Trade_Address"] = raw[13]
            data_out.append(data_json)

    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Customer'] + '/Trade_list_fin', methods = ['POST'])
@cross_origin()
def customer_trade_list_fin():
    data_out = []
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('''SELECT * FROM %s''' %("Trade_" + request_data["S_Customer_Username"]))
    data_db = pgadmin.fetchall()
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))

    for raw in data_db:
        if(raw[14] == 4):
            data_json = {}
            data_json["D_Trade_Time"] = str(raw[4].astimezone(tz_utc_8))
            data_json["S_Trade_Number"] = raw[3]
            S_Goods_Number = str(raw[5][1 : len(list(raw[5])) - 1]).split(",")
            data_json["S_Goods_Quantity"] = len(S_Goods_Number)
            data_json["S_Goods_Number"] = S_Goods_Number
            pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
            pgadmin = pg.cursor()
            pgadmin.execute('''SELECT * FROM %s''' %("Fish_" + str(S_Goods_Number[0][0:3])))
            data_db1 = pgadmin.fetchall()
            I_Goods_Total = 0
            for x in range(len(S_Goods_Number)):
                for raw1 in data_db1:
                    if(S_Goods_Number[x] == raw1[11]):
                        data_json["S_Goods_Status"] = raw1[13]
                        I_Goods_Total = I_Goods_Total + int(raw1[12])
                        break
            data_json["I_Goods_Total"] = I_Goods_Total
            data_json["S_Trade_Address"] = raw[13]
            data_out.append(data_json)

    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Seller'] + '/Trade_Deal', methods = ['POST'])
@cross_origin()
def seller_trade_deal():
    request_data = request.get_json()
    data_json = {}
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if(request_data["S_Seller_Account"] == raw[1]):
            S_Platform_Number = raw[16]
 
    if(request_data["S_Goods_Deal"] == "0"):
        pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = '2' WHERE S_Trade_Number = '%s' ''' %(("Trade_" + str(S_Platform_Number)), request_data["S_Trade_Number"]))
        pg.commit()
        pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = '2' WHERE S_Trade_Number = '%s' ''' %(("Trade_" + str(request_data["S_Customer_Username"])), request_data["S_Trade_Number"]))
        pg.commit()
        pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = '2' WHERE S_Trade_Number = '%s' ''' %(("Fish_" + str(S_Platform_Number)), request_data["S_Trade_Number"]))
        pg.commit()
    elif(request_data["S_Goods_Deal"] == "1"):
        pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = '3' WHERE S_Trade_Number = '%s' ''' %(("Trade_" + str(S_Platform_Number)), request_data["S_Trade_Number"]))
        pg.commit()
        pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = '3' WHERE S_Trade_Number = '%s' ''' %(("Trade_" + str(request_data["S_Customer_Username"])), request_data["S_Trade_Number"]))
        pg.commit()
        pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = '3' WHERE S_Trade_Number = '%s' ''' %(("Fish_" + str(S_Platform_Number)), request_data["S_Trade_Number"]))
        pg.commit()
    elif(request_data["S_Goods_Deal"] == "2"):
        pg = psycopg2.connect(database = config['POSTGRES']['seller_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = '4' WHERE S_Trade_Number = '%s' ''' %(("Trade_" + str(S_Platform_Number)), request_data["S_Trade_Number"]))
        pg.commit()
        pg = psycopg2.connect(database = config['POSTGRES']['platform_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = '4' WHERE S_Trade_Number = '%s' ''' %(("Trade_" + str(request_data["S_Customer_Username"])), request_data["S_Trade_Number"]))
        pg.commit()
        pg = psycopg2.connect(database = config['POSTGRES']['fish_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
        pgadmin = pg.cursor()
        pgadmin.execute('''UPDATE %s SET I_Goods_Status = '4' WHERE S_Trade_Number = '%s' ''' %(("Fish_" + str(S_Platform_Number)), request_data["S_Trade_Number"]))
        pg.commit()

    data_json["S_Trade_Status"] = "1"
    data_json["S_Trade_Log"] = "Success"
    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Fisherman'] + '/Ship_sensor', methods = ['POST'])
@cross_origin()
def ship_sensor():
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()
    request_data = request.get_json()

    for raw in data_db:
        if(request_data["S_Fisherman_Account"] == raw[1]):
            S_Platform_Number = raw[16]

    pg = psycopg2.connect(database = config['POSTGRES']['ship_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s' %("Sensor_" + S_Platform_Number))
    data_db = pgadmin.fetchall()
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    data_json = {}
    for raw in data_db:
        data_json = {}
        data_json["D_Ship_Datetime"] = str(raw[1].astimezone(tz_utc_8))
        data_json["S_Ship_Location_X"] = raw[2]
        data_json["S_Ship_Location_Y"] = raw[3]
        data_json["S_Ship_Direction"] = raw[4]
        data_json["F_Ship_Engine_Temp"] = raw[5]
        data_json["F_Ship_Engine_Tern"] = raw[6]
        data_json["F_Ship_Air_Temperature"] = raw[7]
        data_json["F_Ship_Water_Temperature"] = raw[8]
        data_json["F_Ship_Air_Pressure"] = raw[9]
        data_json["F_Ship_Water_Pressure"] = raw[10]
        data_json["F_Ship_Humidity"] = raw[11]
        data_json["F_Ship_Wind_Dir"] = raw[12]
        data_json["F_Ship_Ref_Temp"] = raw[13]
        data_json["F_Ship_Wind_Speed"] = raw[14]
        data_json["I_Ship_Ref_Open"] = raw[15]
        data_json["F_Ship_Gyro_X"] = raw[16]
        data_json["F_Ship_Gyro_Y"] = raw[17]
        data_json["F_Ship_Gyro_Z"] = raw[18]
        data_json["I_Ship_Rain"] = raw[19]
        data_json["I_Ship_Water_Intrusion_1"] = raw[20]
        data_json["I_Ship_Water_Intrusion_2"] = raw[21]
        data_json["I_Ship_Water_Intrusion_3"] = raw[22]

    return json.dumps(data_json), 200


@app.route(config['ROUTER']['app_router_Fisherman'] + '/Sensor_board', methods = ['POST'])
@cross_origin()
def Sensor_board():
    data_out = {}
    tz_utc_0 = datetime.timezone(datetime.timedelta(hours = 0))
    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM Fisherman_Account')
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if(request_data["S_Fisherman_Account"] == raw[1]):
            S_Platform_Number = raw[16]
    pg = psycopg2.connect(database = config['POSTGRES']['ship_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute('SELECT * FROM %s' %("Sensor_" + S_Platform_Number))
    data_db = pgadmin.fetchall()
    S_Sensor_Time_Up_8 = datetime.datetime.strptime(request_data["S_Sensor_Time_Up"], "%Y-%m-%dT%H:%M:%S.%fZ").replace(tzinfo = tz_utc_8)
    S_Sensor_Time_Low_8 = datetime.datetime.strptime(request_data["S_Sensor_Time_Low"], "%Y-%m-%dT%H:%M:%S.%fZ").replace(tzinfo = tz_utc_8)
    S_Sensor_Time_Up_0 = S_Sensor_Time_Up_8.astimezone(tz_utc_0)
    S_Sensor_Time_Low_0 = S_Sensor_Time_Low_8.astimezone(tz_utc_0)

    S_Sensor_Time = []
    F_Ship_Engine_Temp = []
    F_Ship_Engine_Tern = []
    F_Ship_Air_Temperature = []
    F_Ship_Water_Temperature = []
    F_Ship_Air_Pressure = []
    F_Ship_Water_Pressure = []
    F_Ship_Humidity = []
    F_Ship_Ref_Temp = []

    for raw in data_db:
        if((raw[1] > S_Sensor_Time_Low_0) & (raw[1] < S_Sensor_Time_Up_0)):
            S_Sensor_Time.append(str(raw[1].astimezone(tz_utc_8)))
            F_Ship_Engine_Temp.append(raw[5])
            F_Ship_Engine_Tern.append(raw[6])
            F_Ship_Air_Temperature.append(raw[7])
            F_Ship_Water_Temperature.append(raw[8])
            F_Ship_Air_Pressure.append(raw[9])
            F_Ship_Water_Pressure.append(raw[10])
            F_Ship_Humidity.append(raw[11])
            F_Ship_Ref_Temp.append(raw[13])

            data_out["S_Sensor_Time"] = S_Sensor_Time
            data_out["F_Ship_Engine_Temp"] = F_Ship_Engine_Temp
            data_out["F_Ship_Engine_Tern"] = F_Ship_Engine_Tern
            data_out["F_Ship_Air_Temperature"] = F_Ship_Air_Temperature
            data_out["F_Ship_Water_Temperature"] = F_Ship_Water_Temperature
            data_out["F_Ship_Air_Pressure"] = F_Ship_Air_Pressure
            data_out["F_Ship_Water_Pressure"] = F_Ship_Water_Pressure
            data_out["F_Ship_Humidity"] = F_Ship_Humidity
            data_out["F_Ship_Ref_Temp"] = F_Ship_Ref_Temp


    # print(len(data_out["S_Sensor_Time"]))
    return json.dumps(data_out), 200

@app.route(config['ROUTER']['app_router_Admin'] + '/Log_in', methods = ['POST'])
@cross_origin()
def admin_login():
    data_json = {}
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    request_data = request.get_json()
    pgadmin.execute("SELECT * FROM Admin_Account")
    data_db = pgadmin.fetchall()

    for raw in data_db:
        if((raw[4] == request_data["S_Admin_Account"]) & (raw[5] == request_data["S_Admin_Password"])):
            data_json["S_Admin_Login_Account"] = raw[4]
            data_json["S_Admin_Login_Username"] = raw[3]
            data_json["S_Admin_Login_Status"] = "0"
            data_json["S_Admin_Login_Log"] = "Login success"
            return json.dumps(data_json), 200
        elif((raw[4] == request_data["S_Admin_Account"]) & (raw[5] != request_data["S_Admin_Password"])):
            data_json["S_Admin_Login_Account"] = raw[4]
            data_json["S_Admin_Login_Status"] = "1"
            data_json["S_Admin_Login_Log"] = "Incorrect password"
            return json.dumps(data_json), 400
    data_json["S_Admin_Login_Account"] = request_data["S_Admin_Account"]
    data_json["S_Admin_Login_Status"] = "2"
    data_json["S_Admin_Login_Log"] = "Account does not exist"
    return json.dumps(data_json), 400
    

@app.route(config['ROUTER']['app_router_Admin'] + '/Ship_Location', methods = ['GET'])
@cross_origin()
def admin_ship_location():
    data_out = []
    pg = psycopg2.connect(database = config['POSTGRES']['account_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute("SELECT * FROM Fisherman_Account")
    data_db = pgadmin.fetchall()
    S_Platform_Number = []
    S_Fisherman_Account = []
    S_Fisherman_Username = []
    S_Fisherman_Serial = []

    for raw in data_db:
        if(raw[15] == 0):
            S_Platform_Number.append(raw[16])
            S_Fisherman_Account.append(raw[1])
            S_Fisherman_Username.append(raw[3])
            S_Fisherman_Serial.append(raw[8])

    tz_utc_8 = datetime.timezone(datetime.timedelta(hours = 8))
    pg = psycopg2.connect(database = config['POSTGRES']['ship_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    for x in range(len(S_Platform_Number)):
        data_json = {}
        pgadmin.execute("SELECT * FROM %s" %("Sensor_" + S_Platform_Number[x]))
        data_json["S_Fisherman_Account"] = S_Fisherman_Account[x]
        data_json["S_Fisherman_Username"] = S_Fisherman_Username[x]
        data_json["S_Fisherman_Serial"] = S_Fisherman_Serial[x]
        data_db = pgadmin.fetchall()
        for raw in data_db:
            data_json["D_Ship_Time"] = str(raw[1].astimezone(tz_utc_8))
            data_json["S_Ship_Location_X"] = raw[2]
            data_json["S_Ship_Location_Y"] = raw[3]
        data_out.append(data_json)

    return json.dumps(data_out), 200


@app.route(config['ROUTER']['app_router_Admin'] + '/Fix_Change', methods = ['POST'])
@cross_origin()
def admin_fix_change():
    data_json = {}
    request_data = request.get_json()
    pg = psycopg2.connect(database = config['POSTGRES']['ship_data_db'], user = config['POSTGRES']['user'], password = config['POSTGRES']['password'], host = config['POSTGRES']['host'], port = config['POSTGRES']['port'])
    pgadmin = pg.cursor()
    pgadmin.execute("UPDATE Ship_Fix SET I_Ship_Fix_Finish = '1' WHERE I_Ship_Fix_ID = '%s' " %(request_data["I_Ship_Fix_ID"]))
    data_json["S_Ship_Fix_Status"] = "1"
    data_json["S_Ship_Fix_Log"] = "Success"
    pg.commit()

    return json.dumps(data_json)

app.run(host='0.0.0.0', debug=True )
