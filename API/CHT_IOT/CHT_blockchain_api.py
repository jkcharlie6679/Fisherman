import requests
import json
def create_account():
  #創建區塊鏈帳戶
  url = 'https://iot.cht.com.tw/apis/CHTIoT/blockchain/v2/account'

  headers = {"x-api-key":"58e9d85e-81af-49f5-8eba-f6486a758baf"}
  body = {
    "ProjectID": "IoT001",
    "ProjectKey": "IoT20171221"
  }
  print(body)
  r = requests.post(url, json=body, headers=headers)
  print(r.content)

def get_account():
  #get blockcahin account，查詢區塊鏈帳戶
  url = 'https://iot.cht.com.tw/apis/CHTIoT/blockchain/v2/account'

  headers = {"projID":"IoT001","x-api-key":"58e9d85e-81af-49f5-8eba-f6486a758baf"}

  r = requests.get(url, headers = headers)
  print(r.content)

def post_blockchain():
  #將值存入區塊鏈
  #post data to blockchain
  url = 'https://iot.cht.com.tw/apis/CHTIoT/blockchain/v2/evidence'

  # Adding empty header as parameters are being sent in payload
  headers = {"x-api-key":"58e9d85e-81af-49f5-8eba-f6486a758baf"}
  body = {
    "PK01": "IOT20180108",
    "PK02": "42451863",
    "SC": "no",
    "Parm01": "29",
    "Parm02": "72",
    "Parm03": "60",
    "EvidenceInfo": "SW9UpGqlraV4qrqwz7b0w+xBUEmktrLQu6Gp+g==" #EvidenceInfo放入想要輸入的內容
  }
  # PK01 - 自行定義的主鍵(建議至少要輸入一個值)
  # PK02 - 自行定義的主鍵(預設為0,可不輸入)
  # PK03 - 自行定義的主鍵(預設為0,可不輸入)
  # SC - 是否透過智能合約存取(no)
  # Parm01~Parm05 - 自行定義的一般參數(預設空值,可不輸入)
  # EvidenceInfo - Base64編碼的存證資料
  print(body)
  r = requests.post(url, json=body, headers=headers)
  print(r.content)

def find_blockchain_latest():
  #查詢區塊鏈(最新一筆)
  #post data to blockchain
  url = 'https://iot.cht.com.tw/apis/CHTIoT/blockchain/v2/evidence/latest'

  # Adding empty header as parameters are being sent in payload
  headers = {"x-api-key":"58e9d85e-81af-49f5-8eba-f6486a758baf"}
  body = {
    "PK01": "IOT20180108",
    "PK02": "42451863",
    "SC": "no",
    "Parm01": "29",
    "Parm02": "72",
    "Parm03": "60",
    "EvidenceInfo": "SW9UpGqlraV4qrqwz7b0w+xBUEmktrLQu6Gp+g=="
  }
  #主要利用主鍵去做查詢
  # PK01 - 自行定義的主鍵(建議至少要輸入一個值)
  # PK02 - 自行定義的主鍵(預設為0,可不輸入)
  # PK03 - 自行定義的主鍵(預設為0,可不輸入)
  # group - 依群組做查詢
  # SC - 是否透過智能合約存取(no)
  # Parm01~Parm05 - 自行定義的一般參數(預設空值,可不輸入)
  # datemore - 查詢大於等於某時間
  # dateless - 查詢小於等於某時間
  # EvidenceInfo - Base64編碼的存證資料
  print(body)
  r = requests.post(url, json=body, headers=headers)
  print(r.content)

def find_blockchain_all():
  #查詢區塊鏈(全部)
  #post data to blockchain
  url = 'https://iot.cht.com.tw/apis/CHTIoT/blockchain/v2/evidence/all'

  # Adding empty header as parameters are being sent in payload
  headers = {"x-api-key":"58e9d85e-81af-49f5-8eba-f6486a758baf"}
  body = {
    "PK01": "IOT20180108",
    "PK02": "42451863",
    "SC": "no",
    "Parm01": "29",
    "Parm02": "72",
    "Parm03": "60",
    "EvidenceInfo": "SW9UpGqlraV4qrqwz7b0w+xBUEmktrLQu6Gp+g=="
  }
  #主要利用主鍵去做查詢
  # PK01 - 自行定義的主鍵(建議至少要輸入一個值)
  # PK02 - 自行定義的主鍵(預設為0,可不輸入)
  # PK03 - 自行定義的主鍵(預設為0,可不輸入)
  # group - 依群組做查詢
  # SC - 是否透過智能合約存取(no)
  # Parm01~Parm05 - 自行定義的一般參數(預設空值,可不輸入)
  # datemore - 查詢大於等於某時間
  # dateless - 查詢小於等於某時間
  # EvidenceInfo - Base64編碼的存證資料
  print(body)
  r = requests.post(url, json=body, headers=headers)
  print(r.content)

find_blockchain_latest()
find_blockchain_all()