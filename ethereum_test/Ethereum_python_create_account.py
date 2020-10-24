#coding: utf-8
# import datetime
# import time
from web3 import Web3
#python use http connect to Ethereum
#docker create account
#w3 = Web3(Web3.HTTPProvider('http://172.17.0.2:30303'))
#virtual machine create account
w3 = Web3(Web3.HTTPProvider('http://140.118.121.100:8545'))
#confirm connection is True
def check_connect():
    w3.isConnected()

def create_account():
    #web3.eth.getTransaction('0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060')
    check_connect()
    #print("please input your password to create account :")
    #i = input()
    # t1 = datetime.datetime.now()
    #print(t1)
    print(w3.parity.personal.newAccount("qwe123"))
    # t2 = datetime.datetime.now()

    # total_time = t2 - t1

    # print(total_time.seconds+total_time.microseconds/1000000)
#    return int(total_time)

# def `average`():
#     average_time = 0
#     for i in range(100):
#         average_time = create_account() + average_time


create_account()


