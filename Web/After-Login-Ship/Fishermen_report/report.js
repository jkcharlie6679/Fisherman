const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let D_Ship_Fix_Time = new Date();
  let S_Ship_Fix_Log = document.getElementById('S_Ship_Fix_Log').value;
  let S_Ship_Fix_Fishman_Account = "york"
  switch(S_Ship_Fix_Item){
    case "1":
          let S_Ship_Fix_Item = "漁船位置異常";
    case "1":
          let S_Ship_Fix_Item = "氣溫異常";
    case "1":
          let S_Ship_Fix_Item = "大氣壓力異常";
    case "1":
          let S_Ship_Fix_Item = "引擎溫度異常";    
    case "1":
          let S_Ship_Fix_Item = "風速異常";
    case "1":
          let S_Ship_Fix_Item = "風向異常";
    case "1":
          let S_Ship_Fix_Item = "冰庫溫度異常";
    case "1":
          let S_Ship_Fix_Item = "濕度異常";
    default:
          let S_Ship_Fix_Item = S_Ship_Fix_Log;
  }
  fetch('http://127.0.0.1:5000/Customer/Sign_up',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      D_Ship_Fix_Time:D_Ship_Fix_Time,
      S_Ship_Fix_Fishman_Account:S_Ship_Fix_Fishman_Account,
      S_Ship_Fix_Item:S_Ship_Fix_Item,
      S_Ship_Fix_Log:S_Ship_Fix_Log,
    })
  }).then((res) => res.json())
    .then((data) => console.log(data))
});

