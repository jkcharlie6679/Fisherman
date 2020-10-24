//https://www.valentinog.com/blog/html-table/
//create table 
//https://jsonplaceholder.typicode.com/posts   =>test
function getposts(){ 
  fetch('http://140.118.121.100:5000/Admin/Fix_list')
  .then(response => {return response.json()})
  .then((res) =>{result(res)})   

  function result (mountains){
    console.log(mountains[0])
    function generateTableHead(table, data) {
      let thead = table.createTHead();
      let row = thead.insertRow();
      for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
      }
    }
    
    function generateTable(table, data) {
      for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
          console.log(key)
          if(key=="S_Ship_Fix_Item"){
            let cell = row.insertCell();
            console.log(element["S_Ship_Fix_Item"])
            if(element["S_Ship_Fix_Item"]==0)
            {
              console.log('element["S_Ship_Fix_Item"]')
              let text = document.createTextNode('漁船位置異常');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==1)
            {
              let text = document.createTextNode('氣溫異常');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==2)
            {
              let text = document.createTextNode('大氣壓力異常');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==3)
            {
              let text = document.createTextNode('引擎溫度異常');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==4)
            {
              let text = document.createTextNode('風速異常');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==5)
            {
              let text = document.createTextNode('風向異常');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==6)
            {
              let text = document.createTextNode('冰庫溫度異常');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==7)
            {
              let text = document.createTextNode('濕度異常');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==8)
            {
              let text = document.createTextNode('其他');
              cell.appendChild(text);
            } 
          }
          else if(key!="S_Ship_Fix_Item"){
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
          }   
        }
      }
    }
    
    let table = document.querySelector("table");
    let data = Object.keys(mountains[0]);
    generateTableHead(table, data);
    generateTable(table, mountains);
  }
}
getposts();

function getposts_Fishman_list(){ 
  fetch('http://140.118.121.100:5000/Admin/Fisherman_list')
  .then(response => {return response.json()})
  .then((res) =>{result(res)})   

  function result (mountains){
    console.log(mountains[0])
    function generateTableHead(table, data) {
      let thead = table.createTHead();
      let row = thead.insertRow();
      for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
      }
    }
    
    function generateTable(table, data) {
      for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);   
        }
      }
    }
    
    let table = document.querySelector(".fishman");
    let data = Object.keys(mountains[0]);
    generateTableHead(table, data);
    generateTable(table, mountains);
  }
}
getposts_Fishman_list();

function getposts_Customer_list(){ 
  fetch('http://140.118.121.100:5000/Admin/Customer_list')
  .then(response => {return response.json()})
  .then((res) =>{result(res)})   

  function result (mountains){
    console.log(mountains[0])
    function generateTableHead(table, data) {
      let thead = table.createTHead();
      let row = thead.insertRow();
      for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
      }
    }
    
    function generateTable(table, data) {
      for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);   
        }
      }
    }
    
    let table = document.querySelector(".Customer");
    let data = Object.keys(mountains[0]);
    generateTableHead(table, data);
    generateTable(table, mountains);
  }
}
getposts_Customer_list();

//Fetch Api 
const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let S_Fisherman_Account = document.getElementById('S_Fishman_Account').value;
  let S_Fisherman_Password = document.getElementById('S_Fishman_Password').value;
  let S_Fisherman_Username = document.getElementById('S_Fishman_Username').value;
  let S_Fisherman_Owner = document.getElementById('S_FishMan_Owner').value;
  let S_Fisherman_Company = document.getElementById('S_Fishman_Company').value;
  let S_Fisherman_Company_Serial = document.getElementById('S_Fishman_Company_Serial').value;
  let S_Fisherman_Serial = document.getElementById('S_Fishman_Serial').value;
  let S_Fisherman_Phone = document.getElementById('S_Fishman_Phone').value;
  let S_Fisherman_Tele = document.getElementById('S_Fishman_Tele').value;
  let S_Fisherman_Blkchain_passwd= document.getElementById('S_Fishman_Blkchain_passwd').value;
  let S_Fisherman_Company_Address = document.getElementById('S_Fishman_Company_Address').value;
  let S_Fisherman_Port = document.getElementById('S_Fishman_Port').value;
  let I_Fisherman_Role = document.getElementById('I_Fishman_Role').value;
  

  fetch('http://140.118.121.100:5000/Fisherman/Sign_up',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Fisherman_Account:S_Fisherman_Account,
      S_Fisherman_Password:S_Fisherman_Password,
      S_Fisherman_Username:S_Fisherman_Username,
      S_Fisherman_Owner:S_Fisherman_Owner,
      S_Fisherman_Company:S_Fisherman_Company,
      S_Fisherman_Company_Serial:S_Fisherman_Company_Serial,
      S_Fisherman_Serial:S_Fisherman_Serial,
      S_Fisherman_Phone:S_Fisherman_Phone,
      S_Fisherman_Tele:S_Fisherman_Tele,
      S_Fisherman_Blkchain_passwd:S_Fisherman_Blkchain_passwd,
      S_Fisherman_Company_Address:S_Fisherman_Company_Address,
      S_Fisherman_Port:S_Fisherman_Port,
      I_Fisherman_Role:I_Fisherman_Role
    })
  }).then(response => {
    return response.json()
  }
)
.then( (data) =>{
  render(data)
})
});

function render(data){

let status = data.S_Fisherman_Signup_Status;

  if(status == '0')
  { 
    myVerify.addEventListener('submit',function Verify(e){
    e.preventDefault();
    alert('帳號註冊成功')
    })
  }
  else if(status == '1'){
    console.log("Account existed");
    alert('帳號已有人使用')
  }
}

function signup() {
  $("signup").show();
  $("report").hide();
  $("locate").hide();
  $("Fishman_list").hide();
  $("Customer_list").hide();
    return false;
}
function report() {
  $("report").show();
  $("signup").hide();
  $("locate").hide();
  $("Fishman_list").hide();
  $("Customer_list").hide();
    return false;
}
function Fishman_list() {
  $("Fishman_list").show();
  $("Customer_list").hide();
  $("report").hide();
  $("signup").hide();
  $("locate").hide();
    return false;
}
function Customer_list() {
  $("Customer_list").show();
  $("Fishman_list").hide();
  $("report").hide();
  $("signup").hide();
  $("locate").hide();
    return false;
}
function locate() {
  $("locate").show();
  $("signup").hide();
  $("report").hide();
  $("Customer_list").hide();
  $("Fishman_list").hide();
  if("geolocation" in navigator){
  console.log('geolocation available');
  navigator.geolocation.getCurrentPosition(position => {

    var lat = position.coords.latitude;
    var long = position.coords.longitude;
    console.log(position);
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);

    const mymap = L.map('mapid').setView([25.00, 122.00], 9);
    var marker = L.marker([lat, long]).addTo(mymap);
    marker.bindPopup("<b>Hello !</b><br>Your locate.").openPopup();
    var marker1 = L.marker([24.898, 121.941]).addTo(mymap);		
    marker1.bindPopup("<b>CTR-KH5491</b>").openPopup();
    var marker2 = L.marker([24.898, 122.041]).addTo(mymap);		
    marker2.bindPopup("<b>CT3-3327</b>").openPopup();
    
    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });

    tiles.addTo(mymap);


  }); 
  } else{
    console.log('geolocation not available');
  }
    return false;
}



if (window.sessionStorage.getItem("Username")==null) {
    //window.location.replace("../login/login.html")
}
else{
    document.getElementById("Username").innerHTML= window.sessionStorage.getItem("Username");
}