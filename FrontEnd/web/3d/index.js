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
    var img = $('#S_Ship_Direction');
	function rotate() {
		img.css('rotate', res.S_Ship_Direction+90);
    }
    rotate();
    // setMarkers(res.S_Ship_Location_Y, res.S_Ship_Location_X);
    if(res.F_Ship_Engine_Temp>150){
        document.getElementById("temp").style.backgroundImage = "url('img/temp_hot.png')";
    }
    document.getElementById("temp1").innerHTML ="<h3>Engine:" + res.F_Ship_Engine_Temp + "°C</h3>";
    document.getElementById("turn1").innerHTML ="<h3>" + res.F_Ship_Engine_Tern + "rpm</h3>";
    document.getElementById("air_temp1").innerHTML ="<h3>" + res.F_Ship_Air_Temperature + "°C</h3>";
    document.getElementById("water_temp1").innerHTML ="<h3>" + res.F_Ship_Water_Temperature + "°C</h3>";
    document.getElementById("Air_Pressure1").innerHTML ="<h3>" + res.F_Ship_Air_Pressure + "pa</h3>";
    document.getElementById("Water_Pressure1").innerHTML ="<h3>" + res.F_Ship_Water_Pressure + "Pa N/m2</h3>";
    document.getElementById("Humidity1").innerHTML ="<h3>" + res.F_Ship_Humidity + "%</h3>";
    document.getElementById("Wind_Dir1").innerHTML ="<h3>" + res.F_Ship_Wind_Dir + "°</h3>";
    document.getElementById("Ref_Temp1").innerHTML ="<h3>" + res.F_Ship_Ref_Temp + "°C</h3>";
    document.getElementById("Wind_Speed1").innerHTML ="<h3>" + res.F_Ship_Wind_Speed + "km/h</h3>";
    document.getElementById("Ref_Open1").innerHTML ="<h3>" + ref(res.I_Ship_Ref_Open) + "</h3>";
    document.getElementById("Rain1").innerHTML ="<h3>" + rain(res.I_Ship_Rain) + "</h3>";
    document.getElementById("Water_Intrusion_11").innerHTML ="<h3>" + error(res.I_Ship_Water_Intrusion_1) + "</h3>";
    document.getElementById("Water_Intrusion_21").innerHTML ="<h3>" + error(res.I_Ship_Water_Intrusion_2) + "</h3>";
    document.getElementById("Water_Intrusion_31").innerHTML ="<h3>" + error(res.I_Ship_Water_Intrusion_3) + "</h3>";
    document.getElementById("time1").innerHTML ="<h3>" + new Date(res.D_Ship_Datetime).Format("yyyy-MM-dd hh:mm:ss") + "</h3>";
    document.getElementById("S_Ship_Direction1").innerHTML ="<h3>" + res.S_Ship_Direction + "°</h3>";

    // document.getElementById("sensor_1").innerHTML ="Humidity<br>" + res.F_Ship_Humidity + "%";
    // document.getElementById("sensor_2").innerHTML ="Atm. Pressure<br>" + res.F_Ship_Pressure + "Pa";
    // document.getElementById("sensor_3").innerHTML ="Wind<br>" + res.F_Ship_Wind + "°";
    // document.getElementById("sensor_4").innerHTML ="Wind_Speed<br>" + res.F_Ship_Wind_Speed + "m/s";
    // document.getElementById("sensor_5").innerHTML ="Freeze_Temp<br>" + res.F_Ship_Ref_Temp + "°C";
    // document.getElementById("sensor_6").innerHTML ="Engine_Temp<br>" + res.F_Ship_Engine_Temp + "°C";
  })
    return data_Pull
  }
  
  var timeoutID = window.setInterval(data_Pull(),1000);
  
  function rain(stats){
      if(stats==0)
        return "No rain"
      else
        return "rain"  
  }
  function error(stats){
    if(stats==0)
      return "No water"
    else
      return "Water ingress"  
}
function ref(stats){
    if(stats==0)
      return "Close"
    else
      return "Open"  
}
const Logout = document.getElementById('Logout');
Logout.addEventListener('click', function change(){
    window.sessionStorage.clear();
    window.location.replace("../Fisherman-Login/Fisherman-Login.html");
})

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