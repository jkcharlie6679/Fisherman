//https://www.valentinog.com/blog/html-table/
//create table 
//https://jsonplaceholder.typicode.com/posts   =>test
var click_id=1;
function decode_Report(key){
  if(key == 'D_Ship_Fix_ID'){
    return "ID"; 
  }
  else if(key == 'D_Ship_Fix_Time'){
    return "Fix Time";
  }
  else if(key == 'S_Fisherman_Account'){
    return "Account";
  }
  else if(key == 'S_Ship_Fix_Item'){
    return "Fix Item";
  }
  else if(key == 'S_Ship_Fix_Log'){
    return "Fix Log";
  }
  else if(key == 'S_Ship_Fix_Finish'){
    return "Fix Finish";
  }
}

function decode_fisherman(key){
  if(key == 'S_Fisherman_ID'){
    return "ID"; 
  }
  else if(key == 'S_Fisherman_Account'){
    return "Account";
  }
  else if(key == 'S_Fisherman_Password'){
    return "Password";
  }
  else if(key == 'S_Fisherman_Username'){
    return "Username";
  }
  else if(key == 'I_Fisherman_Verify'){
    return "Verify";
  }
  else if(key == 'S_Fisherman_Owner'){
    return "Owner";
  }
  else if(key == 'S_Fisherman_Company'){
    return "Company";
  }
  else if(key == 'S_Fisherman_Company_Serial'){
    return "Company Serial";
  }
  else if(key == 'S_Fisherman_Serial'){
    return "Ship Serial";
  }
  else if(key == 'S_Fisherman_Phone'){
    return "Phone number";
  }
  else if(key == 'S_Fisherman_Tele'){
    return "telephone";
  }
  else if(key == 'S_Fisherman_Blkchain_ID'){
    return "Blkchain ID";
  }
  else if(key == 'S_Fisherman_Blkchain_passwd'){
    return "Blkchain_passwd";
  }
  else if(key == 'S_Fisherman_Company_Address'){
    return "Company Address";
  }
  else if(key == 'S_Fisherman_Port'){
    return "Fisherman Port";
  }
}
function decode_customer(key){
  if(key == 'S_Customer_ID'){
    return "ID"; 
  }
  else if(key == 'S_Customer_Account'){
    return "Account";
  }
  else if(key == 'S_Customer_Password'){
    return "Password";
  }
  else if(key == 'S_Customer_Username'){
    return "Username";
  }
  else if(key == 'S_Customer_First_Name'){
    return "First Name";
  }
  else if(key == 'S_Customer_Last_Name'){
    return "Last Name";
  }
  else if(key == 'I_Customer_Verify'){
    return "Verify";
  }
  else if(key == 'D_Customer_Birthday'){
    return "Birthday";
  }
  else if(key == 'S_Customer_Post_Number'){
    return "Post Number";
  }
  else if(key == 'S_Customer_City'){
    return "City";
  }
  else if(key == 'S_Customer_Town'){
    return "Town";
  }
  else if(key == 'S_Customer_Other'){
    return "Other";
  }
  else if(key == 'S_Customer_Phone'){
    return "Phone number";
  }
}
function getposts(){ 
  fetch('http://140.118.121.100:5000/Admin/Fix_list')
  .then(response => {return response.json()})
  .then((res) =>{result(res)})   

  function result (mountains){
    console.log(mountains[0])
    function generateTableHead(table, data) {
      let thead = table.createTHead();
      let row = thead.insertRow();
      console.log(data+1)
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
              let text = document.createTextNode('Abnormal position of fishing boat');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==1)
            {
              let text = document.createTextNode('Abnormal temperature');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==2)
            {
              let text = document.createTextNode('Abnormal atmospheric pressure');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==3)
            {
              let text = document.createTextNode('Engine temperature is abnormal');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==4)
            {
              let text = document.createTextNode('Abnormal wind speed');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==5)
            {
              let text = document.createTextNode('Abnormal wind direction');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==6)
            {
              let text = document.createTextNode('Abnormal temperature in ice storage');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==7)
            {
              let text = document.createTextNode('Abnormal humidity');
              cell.appendChild(text);
            }
            else if(element["S_Ship_Fix_Item"]==8)
            {
              let text = document.createTextNode('other error');
              cell.appendChild(text);
            } 
          }
          else if(key=="D_Ship_Fix_Time"){
            let cell = row.insertCell();
            let text = document.createTextNode(new Date(element[key]).Format("yyyy-MM-dd hh:mm:ss"));
            cell.appendChild(text);
          }
          else if(key!="S_Ship_Fix_Item"){
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
          }

          if(key=="S_Ship_Fix_Finish"){
            var button = document.createElement("input");
            button.type = "button";
            button.id +=click_id;
            button.value = "click me";
            button.className +="info" ;
            // console.log("info"+click_id)
            click_id+=1;
            // console.log
            button.setAttribute("onClick", "reply_click(this.id)");
            let cell = row.insertCell();
            cell.appendChild(button);
          }
        }
      }
    }
    
    let table = document.querySelector("table");
    let data = Object.keys(mountains[0]);
    generateTableHead(table, ["ID", "Fix Time","Account","Fix Item","Fix Log","Fix Status","Fix Finish"]);
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
        let text = document.createTextNode(decode_fisherman(key));
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
        let text = document.createTextNode(decode_customer(key));
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
  let I_Fisherman_Role = 0;
  

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
    alert('帳號註冊成功')
  }
  else if(status == '1'){
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
  //地圖生成
  fetch('http://140.118.121.100:5000/Admin/Ship_Location')
  .then(response => {return response.json()})
  .then((res) =>{map(res)}) 
  
  // if("geolocation" in navigator){
  // console.log('geolocation available');
  // navigator.geolocation.getCurrentPosition(position => {

  //   var lat = position.coords.latitude;
  //   var long = position.coords.longitude;
  //   console.log(position);
  //   console.log(position.coords.latitude);
  //   console.log(position.coords.longitude);

  //   const mymap = L.map('mapid').setView([25.00, 122.00], 9);
  //   var marker = L.marker([lat, long]).addTo(mymap);
  //   marker.bindPopup("<b>Hello !</b><br>Your locate.").openPopup();
  //   var marker1 = L.marker([24.898, 121.941]).addTo(mymap);		
  //   marker1.bindPopup("<b>CTR-KH5491</b>").openPopup();
  //   var marker2 = L.marker([24.898, 122.041]).addTo(mymap);		
  //   marker2.bindPopup("<b>CT3-3327</b>").openPopup();
    
  //   const attribution =
  //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  //   const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  //   const tiles = L.tileLayer(tileUrl, { attribution });

  //   tiles.addTo(mymap);


  // }); 
  // } else{
  //   console.log('geolocation not available');
  // }
  //   return false;
}



if (window.sessionStorage.getItem("admin")==null) {
    //window.location.replace("../login/login.html")
}
else{
    document.getElementById("admin").innerHTML= window.sessionStorage.getItem("admin");
}
const Logout = document.getElementById('Logout');
Logout.addEventListener('click', function change(){
    window.sessionStorage.clear();
    window.location.replace("../login_admin/login.html");
})


function map(res){
  var map = L.map('mapid', {
    'center': [25.748, 121.941],
    'zoom': 9,
    'layers': [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    ]
  });

  var markers = {};

  var fish_icon = L.icon({
      iconUrl: '../img/fish_icon.png',
      iconSize:     [10, 10], // size of the icon
      iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
      popupAnchor:  [-10, -10] // point from which the popup should open relative to the iconAnchor
    });
    var ship_icon = L.icon({
      iconUrl: '../img/ship_icon.png',
      iconSize:     [38, 38], // size of the icon
      iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
      popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
    });
    // if (!markers.hasOwnProperty('ship')) {
    //   markers['ship'] = new L.Marker([25.748, 121.941],{icon:ship_icon}).bindTooltip("Your locate").addTo(map);
    //   markers['ship'].previousLatLngs = [];
    // } else {
    //   markers['ship'].previousLatLngs.push(markers['ship'].getLatLng());
    //   markers['ship'].setLatLng([25.748, 121.941],{icon:ship_icon}).bindTooltip("Your locate");
    //   console.log(25.748, 121.941)
    // }
    for (var i=0;i<res.length;i++)
      {
        console.log(res.length)
        console.log(res[i].S_Fisherman_Serial)
        marker = new L.marker([res[i].S_Ship_Location_Y, res[i].S_Ship_Location_X],{icon:ship_icon})
      .bindTooltip(res[i].S_Fisherman_Serial)
      .addTo(map);
      }
      click_id=0;
}
Date.prototype.Format = function (fmt) { 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function reply_click(clicked_id) {
  // console.log(clicked_id)
  fetch('http://140.118.121.100:5000/Admin/Fix_Change', {
    method:'POST',
    body:JSON.stringify({
      "I_Ship_Fix_ID": clicked_id
    }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      "Access-Control-Request-Headers": "*"
    }
  })
  .then(response => {return response.json()})
  .then((res) =>{
    Swal.fire({
      title: '', 
      html: 'Fish Weight',
      confirmButtonText: "<u>ok</u>",

    });
  }) 
};