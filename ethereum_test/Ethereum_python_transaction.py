#coding: utf-8
import datetime
import time
import json
from web3 import Web3
# from ethereum.transactions import Transaction
#connect to ethereum using http
w3 = Web3(Web3.HTTPProvider('http://140.118.121.100:8545'))
#unlock account have to convert account checksum
w3.parity.personal.unlockAccount(w3.toChecksumAddress("0x4aafe9247955de5c0b7651263467b7a308cbfec4"), "qwe123", 0)
#做壓力測試的時候可能會用到
for i in range(1):
    #input
    print("Please input data:")
    print("\n")
    i = input()

    #encoding string to byte
    input_data = bytes(i, encoding = "utf8")
    print(input_data)

    #send transaction
    tx = w3.eth.sendTransaction({
        'to': w3.toChecksumAddress("0xa8364d143a99edc5d5610388172ba92f7850823c"),
        'from': w3.eth.coinbase,
        'value': 1000,
        'data': input_data
    })

    #send transaction Oringinal return
    print("Original hashbyte:",tx)
    print("\n")
    #convert sendtransaction to hex
    tx1 = tx.hex()
    #print transaction hash
    print("hex:",tx1)
    print("\n")
    # print("transaction time:",total_time.seconds+total_time.microseconds/1000000)

    #get transaction hash
    get_input_hash = w3.eth.getTransaction(tx)
    #transaction detail
    print("transaction detail:", get_input_hash)
    print("\n")
    #get transaction input
    print("Original input hash:", get_input_hash['input'])
    print("\n")
    get_input = get_input_hash['input']
    #conver input hex to string & delete 0x
    get_input = get_input[2:]
    #print(get_input)
    input_result = bytes.fromhex(get_input).decode('utf-8')
    print("decode input:",input_result)
    print("\n")
