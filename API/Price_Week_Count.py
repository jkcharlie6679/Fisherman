import datetime

def week_count(S_Price_Week):
    if(S_Price_Week == "0"):
        delta = datetime.timedelta(days = 0)
    elif(S_Price_Week == "1"):
        delta = datetime.timedelta(days = 7)
    elif(S_Price_Week == "2"):
        delta = datetime.timedelta(days = 14)    
    
    day = datetime.datetime.now() + delta

    return str(datetime.datetime.now())[0:4] + "-" + day.strftime("%U")
