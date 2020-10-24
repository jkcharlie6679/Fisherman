import configparser, os
from web3 import Web3


path = os.path.abspath('.')
cfgpath = path.split('Fisherman')[0] + 'Fisherman/API/config.ini'

config = configparser.ConfigParser()
config.read(cfgpath)


w3 = Web3(Web3.HTTPProvider('http://' + config['ETHEREUM']['host'] + ':' +config['ETHEREUM']['port']))

def check_connect():
    w3.isConnected()

def create_account(S_Fisherman_Blkchain_passwd):
    check_connect()
    
    account = w3.parity.personal.newAccount(str(S_Fisherman_Blkchain_passwd))

    return account
