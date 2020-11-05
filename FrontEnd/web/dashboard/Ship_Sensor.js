setInterval(function(){
    fetch('http://140.118.121.100:5000/Fisherman/Ship_sensor',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "S_Fisherman_Account":"b10702130@gapps.ntust.edu.tw"
      })
    }).then(response => {
          return response.json()
        }
      )
      .then( (data) =>{      
        PriceList(data)
      })
      

    function PriceList(sensor){
            document.getElementById("D_Ship_Datetime").innerHTML='Date '+new Date(sensor.D_Ship_Datetime);
            document.getElementById("S_Ship_Location_X").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Location &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>( '+LocationXY(sensor.S_Ship_Location_Y)+' , '+LocationXY(sensor.S_Ship_Location_X)+' )';
            document.getElementById("S_Ship_Direction").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Ship Direction &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>'+sensor.S_Ship_Direction+' °';
            document.getElementById("F_Ship_Engine_Temp").innerHTML='<u>&nbsp&nbsp Engine Temperature &nbsp&nbsp</u><br>'+sensor.F_Ship_Engine_Temp+' °C';
            document.getElementById("F_Ship_Engine_Tern").innerHTML='<u> Engine Rotating Speed </u><br>'+sensor.F_Ship_Engine_Tern+' RPM';
            document.getElementById("F_Ship_Air_Temperature").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Air Temperature &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>'+sensor.F_Ship_Air_Temperature+' °C';
            document.getElementById("F_Ship_Water_Temperature").innerHTML='<u>&nbsp&nbsp Water Temperature &nbsp&nbsp</u><br>'+sensor.F_Ship_Water_Temperature+' °C';
            document.getElementById("F_Ship_Air_Pressure").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Air Pressure &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>'+sensor.F_Ship_Air_Pressure+' hPa';
            document.getElementById("F_Ship_Water_Pressure").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Water Pressure &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>'+sensor.F_Ship_Water_Pressure+' kg/cm2';
            document.getElementById("F_Ship_Humidity").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Ship Humidity &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>'+sensor.F_Ship_Humidity+' %';
            document.getElementById("F_Ship_Wind_Dir").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Wind Direction &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>'+sensor.F_Ship_Wind_Dir+' °';
            document.getElementById("F_Ship_Ref_Temp").innerHTML='<u>Refrigerator Temperature</u><br>'+sensor.F_Ship_Ref_Temp+' °C';
            document.getElementById("F_Ship_Wind_Speed").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Wind Speed &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>'+sensor.F_Ship_Wind_Speed+' m/s';
            document.getElementById("I_Ship_Ref_Open").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp Refrigerator Switch &nbsp&nbsp&nbsp&nbsp</u><br>'+Switch(sensor.I_Ship_Ref_Open);
            document.getElementById("F_Ship_Gyro_x").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Gyro (x,y,z) &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>( '+sensor.F_Ship_Gyro_X+' , '+sensor.F_Ship_Gyro_Y+' , '+sensor.F_Ship_Gyro_Z+' )';
            document.getElementById("I_Ship_Rain").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Rain status &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>'+sensor.I_Ship_Rain;
            document.getElementById("I_Ship_Water_Intrusion_1").innerHTML='<u>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Water Intrusion &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</u><br>( '+sensor.I_Ship_Water_Intrusion_1+' , '+sensor.I_Ship_Water_Intrusion_2+' , '+sensor.I_Ship_Water_Intrusion_3+' )';
    }
},2000)

function LocationXY(X){
    return Math.floor(X * 1000000) / 1000000
}

function Switch(status) {
    let close = 'close'
    let opendoor = 'open'
    if(status == 0){
        return close
    }
    else if(status == 1){
        return opendoor
    }
}
const Logout = document.getElementById('Logout');
Logout.addEventListener('click', function change(){
    window.sessionStorage.clear();
    window.location.replace("../Fisherman-Login/Fisherman-Login.html");
})