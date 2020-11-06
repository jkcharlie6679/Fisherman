//https://www.valentinog.com/blog/html-table/
//create table 
var info_json;
var click_id=1;
var ship_X=121.741,ship_Y=25.248;
crossorigin="anonymous"//??

//create select bar table
var getposts = function(){
  // console.log("hihi")
  fetch('http://140.118.121.100:5000/Fisherman/Fish_list', {
    method:'POST',
    body:JSON.stringify({
      "S_Fisherman_Account" : window.sessionStorage.getItem("fishermenAccount")
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
    // console.log(JSON.stringify(result))
    // console.log(result)
    var tbl = document.getElementById('fish');
    tbl.parentNode.removeChild(tbl);
    let output = ``;
    output+= `
    <table id="fish">
    <!-- here goes our data! -->
    </table>
        `
    document.getElementById('output').innerHTML = output;
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
      
      for (let element of data.reverse()) {
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
            let text = document.createTextNode(new Date(element[key]).Format("yyyy-MM-dd hh:mm:ss"))
            cell.appendChild(text);
          }
          else if (key=="S_Fish_Depth")
          {
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
    let data = Object.keys(result[1]);
    generateTableHead(table, ["Hash Code", "Fish Name","Datetime","Detail"]);
    generateTable(table, result);
    // console.log(result)
  }
  return getposts
}
var timeoutID1 = window.setInterval(getposts(),5000);
// getposts();


//設定按鈕反應
  
function reply_click(clicked_id) {
  // console.log(clicked_id)
  Swal.fire({
    title: ''+info_json[clicked_id].S_Fish_Name, 
    html: 'Fish Weight  :  '+info_json[clicked_id].S_Fish_Weight+'kg<br>'+'Fish Length  :  '+info_json[clicked_id].S_Fish_Length+'m<br>'+'Fish Datetime  :  '+new Date(info_json[clicked_id].S_Fish_Datetime).toLocaleString('zh-Hans-CN')+'<br>'+'Fish Location  :  ('+info_json[clicked_id].S_Fish_Location_X+','+info_json[clicked_id].S_Fish_Location_Y+')<br>'+'Fish Depth  :  '+info_json[clicked_id].S_Fish_Depth+'m<br>'+'Fish Temperature  :  '+info_json[clicked_id].S_Fish_Temperature+'°C<br>',
    confirmButtonText: "<u>ok</u>",
    imageUrl:"../images/"+ChooseFish(info_json[clicked_id].S_Fish_Name),
  });
};


//地圖生成
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
function setMarkers(S_Fish_Location_Y,S_Fish_Location_X) {
  if (!markers.hasOwnProperty('ship')) {
    markers['ship'] = new L.Marker([S_Fish_Location_Y,S_Fish_Location_X],{icon:ship_icon}).bindTooltip("Your locate").addTo(map);
    markers['ship'].previousLatLngs = [];
  } else {
    markers['ship'].previousLatLngs.push(markers['ship'].getLatLng());
    markers['ship'].setLatLng([S_Fish_Location_Y, S_Fish_Location_X],{icon:ship_icon}).bindTooltip("Your locate");
    console.log(S_Fish_Location_Y,S_Fish_Location_X)
  }
  for (var i=1;i<(click_id-1);i++)
    {
      marker = new L.marker([info_json[i].S_Fish_Location_Y, info_json[i].S_Fish_Location_X],{icon: fish_icon})
    .bindTooltip(info_json[i].S_Fish_Name)
    .addTo(map);
    }
    click_id=0;
}

//Ship_sensor_get
var data_Pull = function(){
  fetch('http://140.118.121.100:5000/Fisherman/Ship_sensor', {
  method:'POST',
  body:JSON.stringify({
    "S_Fisherman_Account": window.sessionStorage.getItem("fishermenAccount") 
  }),
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
  }
})
.then(response => {return response.json()})
.then((res) =>{
  ship_Y=res.S_Ship_Location_Y
  ship_X=res.S_Ship_Location_X
  setMarkers(res.S_Ship_Location_Y, res.S_Ship_Location_X);
  document.getElementById("sensor_0").innerHTML ="Ship Direct<br><br>" + res.S_Ship_Direction + "°";
  document.getElementById("sensor_1").innerHTML ="Engine Temp<br><br>" + res.F_Ship_Engine_Temp + "°C";
  document.getElementById("sensor_2").innerHTML ="Engine Turn<br><br>" + res.F_Ship_Engine_Tern + "Rpm";
  document.getElementById("sensor_3").innerHTML ="Freeze Temp<br><br>" + res.F_Ship_Ref_Temp + "°C";
  document.getElementById("sensor_4").innerHTML ="Wind Speed<br><br>" + res.F_Ship_Wind_Speed + "m/s";
  document.getElementById("sensor_5").innerHTML ="Freeze<br><br>" + ref(res.I_Ship_Ref_Open) + "";
  document.getElementById("sensor_6").innerHTML ="Air Temp<br><br>" + res.F_Ship_Air_Temperature + "°C";
})
  return data_Pull
}

var timeoutID = window.setInterval(data_Pull(),5000);

const Logout = document.getElementById('Logout');
Logout.addEventListener('click', function change(){
    window.sessionStorage.clear();
    window.location.replace("../Fisherman-Login/Fisherman-Login.html");
})
function ref(stats){
  if(stats==0)
    return "Close"
  else
    return "Open"  
}

function ChooseFish(Fishclassify){
  let SwordfishPicture = 'swordfish(2).png';
  let MackerelPicture = 'mackerel(2).png';
  let TunaPicture = 'tuna(2).png';
  let GrouperPicture = 'grouper(2).png';
  let MahiMahiPicture = 'Θ«¬Θ¡Ü2(2).png';

  if(Fishclassify == 'Swordfish'){
    return SwordfishPicture; 
  }
  else if(Fishclassify == 'Mackerel'){
    return MackerelPicture;
  }
  else if(Fishclassify == 'Tuna'){
    return TunaPicture;
  }
  else if(Fishclassify == 'Grouper'){
    return GrouperPicture;
  }
  else if(Fishclassify == 'Mahi_mahi'){
    return MahiMahiPicture;
  }
  else{
    return GrouperPicture;
  }

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

