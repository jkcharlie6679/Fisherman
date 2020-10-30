//https://www.valentinog.com/blog/html-table/
//create table 
var info_json;
var click_id=1;
crossorigin="anonymous"//??

//create select bar table
function getposts(){
  fetch('http://140.118.121.100:5000/Fisherman/Fish_list', {
    method:'POST',
    body:JSON.stringify({
      "S_Fisherman_Account" : "b10702130@gapps.ntust.edu.tw"
    }),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      "Access-Control-Request-Headers": "*"
    }
  })
  .then(response => {return response.json()})
  .then((res) =>{decode(res)}) 
  function decode (result){
    Log_result = result[0]
    info_json = result
    delete result[0]
    console.log(JSON.stringify(result))
    console.log(result)
    function generateTableHead(table, data) {
      let thead = table.createTHead();
      let row = thead.insertRow();
      for (let key of data) {
        var th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
      }
    }
    
    function generateTable(table, data) {
      for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
          if(key=="S_Fish_Hash_Code" || key=="S_Fish_Name")
          {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
          } 
          else if (key=="S_Fish_Datetime")
          {
            let cell = row.insertCell();
            let text = document.createTextNode(new Date(element[key]).toLocaleString('zh-Hans-CN'))
            cell.appendChild(text);
          }
          else if (key=="S_Fish_Depth")
          {
            var button = document.createElement("input");
            button.type = "button";
            button.id +=click_id;
            button.value = "click me";
            button.className +="info" ;
            console.log("info"+click_id)
            click_id+=1;
            button.setAttribute("onClick", "reply_click(this.id)");
            let cell = row.insertCell();
            cell.appendChild(button);
          }
        }
      }
    }
    let table = document.querySelector("table");
    let data = Object.keys(result[1]);
    console.log(data)
    generateTableHead(table, ["Hash Code", "Fish Name","Datetime","Detail"]);
    generateTable(table, result);
    console.log(result)
  }
}
getposts();


//設定按鈕反應
  
function reply_click(clicked_id) {
  console.log(clicked_id)
  Swal.fire({
    title: 'Fish Name:'+info_json[clicked_id].S_Fish_Name, 
    html: 'Fish Weight  :  '+info_json[clicked_id].S_Fish_Weight+'kg<br>'+'Fish Length  :  '+info_json[clicked_id].S_Fish_Length+'m<br>'+'Fish Datetime  :  '+new Date(info_json[clicked_id].S_Fish_Datetime).toLocaleString('zh-Hans-CN')+'<br>'+'Fish Location  :  ('+info_json[clicked_id].S_Fish_Location_X+','+info_json[clicked_id].S_Fish_Location_Y+')<br>'+'Fish Depth  :  '+info_json[clicked_id].S_Fish_Depth+'m<br>'+'Fish Temperature  :  '+info_json[clicked_id].S_Fish_Temperature+'°C<br>',
    confirmButtonText: "<u>ok</u>",
    imageUrl:'https://unsplash.it/400/200',
  });
};


//地圖生成
var map = L.map('mapid', {
  'center': [25.248, 121.741],
  'zoom': 10,
  'layers': [
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  ]
});

var markers = {};

var fish_icon = L.icon({
    iconUrl: '../img/fish_icon.png',
    iconSize:     [15, 15], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [-10, -10] // point from which the popup should open relative to the iconAnchor
  });
  var ship_icon = L.icon({
    iconUrl: '../img/ship_icon.png',
    iconSize:     [38, 38], // size of the icon
    iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  });
function setMarkers(S_Fish_Location_Y,S_Fish_Location_X) {
  if (!markers.hasOwnProperty('ship')) {
    markers['ship'] = new L.Marker([S_Fish_Location_Y,S_Fish_Location_X],{icon:ship_icon}).bindTooltip("Your locate").addTo(map);
    markers['ship'].previousLatLngs = [];
  } else {
    markers['ship'].previousLatLngs.push(markers['ship'].getLatLng());
    markers['ship'].setLatLng([S_Fish_Location_Y, S_Fish_Location_X],{icon:ship_icon}).bindTooltip("Your locate");
    console.log(S_Fish_Location_Y,S_Fish_Location_X)
  }
  for (var i=1;i<click_id;i++)
    {
      marker = new L.marker([info_json[i].S_Fish_Location_Y, info_json[i].S_Fish_Location_X],{icon: fish_icon})
    .bindTooltip(info_json[i].S_Fish_Name)
    .addTo(map);
    }
}

//Ship_sensor_get
var data_Pull = function(){
  fetch('http://140.118.121.100:5000/Fisherman/Ship_sensor', {
  method:'POST',
  body:JSON.stringify({
    "S_Fisherman_Account": "b10702130@gapps.ntust.edu.tw"
  }),
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  }
})
.then(response => {return response.json()})
.then((res) =>{
  setMarkers(res.S_Ship_Location_Y, res.S_Ship_Location_X);
  document.getElementById("sensor_0").innerHTML ="Temperature<br>" + res.F_Ship_Temperature + "°C";
  document.getElementById("sensor_1").innerHTML ="Humidity<br>" + res.F_Ship_Humidity + "%";
  document.getElementById("sensor_2").innerHTML ="Atm. Pressure<br>" + res.F_Ship_Pressure + "Pa";
  document.getElementById("sensor_3").innerHTML ="Wind<br>" + res.F_Ship_Wind + "°";
  document.getElementById("sensor_4").innerHTML ="Wind_Speed<br>" + res.F_Ship_Wind_Speed + "m/s";
  document.getElementById("sensor_5").innerHTML ="Freeze_Temp<br>" + res.F_Ship_Ref_Temp + "°C";
  document.getElementById("sensor_6").innerHTML ="Engine_Temp<br>" + res.F_Ship_Engine_Temp + "°C";
})
  return data_Pull
}

var timeoutID = window.setInterval(data_Pull(),5000);
const Logout = document.getElementById('Logout');
Logout.addEventListener('click', function change(){
    window.sessionStorage.clear();
    window.location.replace("../Fisherman-Login/Fisherman-Login.html");
})