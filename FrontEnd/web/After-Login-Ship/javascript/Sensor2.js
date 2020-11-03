const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let Time_Up = document.getElementById('Time_Up').value;
  let Time_LOW = document.getElementById('Time_LOW').value;
  console.log(Time_Up)
  const date_fix1 = new Date(+new Date(Time_Up) + 8 * 3600 * 1000);
  const date_fix2 = new Date(+new Date(Time_LOW) + 8 * 3600 * 1000);
  var T1 = new Date(date_fix1).toISOString()
  var T2 = new Date(date_fix2).toISOString()

  fetch('http://140.118.121.100:5000/Fisherman/Sensor_board',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Fisherman_Account: "b10702130@gapps.ntust.edu.tw",
      S_Sensor_Time_Up: T1,
      S_Sensor_Time_Low: T2
    })
  }).then(response => {
        return response.json()
      }
    )
    .then( (data) =>{  
      Sensor1(data); 
      Sensor2(data);
      Sensor3(data);
      Sensor4(data);
      Sensor5(data);
      Sensor6(data);
      Sensor7(data);
      Sensor8(data);
    })
})
/*---------Sensor1--------*/ 
function Sensor1(date){
  google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart(date));

      function drawChart(date) {
        var data = google.visualization.arrayToDataTable(CreateDateSpeed(date));

        var options = {
          title: 'Ship Engine Rotating Speed (Unit:rpm)',
          hAxis: {title: 'Time',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    }
/*---------Sensor2--------*/ 
function Sensor2(date){
  google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart(date));

      function drawChart(date) {
        var data = google.visualization.arrayToDataTable(CreateDateTem(date));

        var options = {
          title: 'Ship Engine Temperature (Unit:°C)',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }
}
/*---------Sensor3--------*/ 
function Sensor3(date){
  google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart(date));

      function drawChart(date) {
        var data = google.visualization.arrayToDataTable(CreateAirPressure(date));

        var options = {
          title: 'Ship Air Pressure (Unit:hpa)',
          curveType: 'function',
          legend: { position: 'bottom' },
          colors: ['#a52714']
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart2'));

        chart.draw(data, options);
      }
}
/*---------Sensor4--------*/ 
function Sensor4(date){
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart(date));

  function drawChart(date) {
    var data = google.visualization.arrayToDataTable(CreateAirTem(date));

    var options = {
      title: 'Ship Air Temperature (Unit:°C)',
      hAxis: {title: 'Date',  titleTextStyle: {color: '#666'}},
      vAxis: {minValue: 0},
      colors: ['#a52714']
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div2'));
    chart.draw(data, options);
  }
  }

/*---------Sensor5--------*/ 
function Sensor5(date){
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart(date));

  function drawChart(date) {
    var data = google.visualization.arrayToDataTable(CreateWaterTem(date));

    var options = {
      title: 'Ship Water Temperature (Unit:°C)',
      hAxis: {title: 'Date',  titleTextStyle: {color: '#666'}},
      vAxis: {minValue: 0},
      colors: ['rgb(25, 102, 48)']
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div3'));
    chart.draw(data, options);
  }
  }
  /*---------Sensor6--------*/ 
function Sensor6(date){
  google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart(date));

      function drawChart(date) {
        var data = google.visualization.arrayToDataTable(CreateWaterPressure(date));

        var options = {
          title: 'Ship Water Pressure (Unit:hpa)',
          curveType: 'function',
          legend: { position: 'bottom' },
          colors: ['rgb(25, 102, 48)']
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart3'));

        chart.draw(data, options);
      }
}
  /*---------Sensor7--------*/ 
  function Sensor7(date){
    google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart(date));
  
        function drawChart(date) {
          var data = google.visualization.arrayToDataTable(CreateHumidity(date));
  
          var options = {
            title: 'Ship Humidity (Unit:%)',
            curveType: 'function',
            legend: { position: 'bottom' },
            colors: ['rgb(163, 177, 42)']
          };
  
          var chart = new google.visualization.LineChart(document.getElementById('curve_chart4'));
  
          chart.draw(data, options);
        }
  }
  /*---------Sensor8--------*/ 
  function Sensor8(date){
    google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart(date));

      function drawChart(date) {
        var data = google.visualization.arrayToDataTable(CreateRefTemp(date));

        var options = {
          title: 'Ship Refrigerator Temperature (Unit:%)',
          vAxis: {title: 'Accumulated Rating'},
          isStacked: true,
          colors: ['rgb(163, 177, 42)']
        };

        var chart = new google.visualization.SteppedAreaChart(document.getElementById('chart_div4'));

        chart.draw(data, options);
      }
  }


function CreateDateTem(money){
  var date =[];
  date[0] = ['Time','Engine Temp'];
  for(var i=0;i<=money.S_Sensor_Time.length-1;i++){
    date[i+1] = [transformDate(money.S_Sensor_Time[i]),money.F_Ship_Engine_Temp[i]]
  }
  return date
}
function CreateDateSpeed(money){
  var date =[];
  date[0] = ['Time','Rotate Speed'];
  for(var i=0;i<=money.S_Sensor_Time.length-1;i++){
    date[i+1] = [transformDate(money.S_Sensor_Time[i]),money.F_Ship_Engine_Tern[i]]
  }
  return date
}
function CreateAirPressure(money){
  var date =[];
  date[0] = ['Time','Air Pre'];
  for(var i=0;i<=money.S_Sensor_Time.length-1;i++){
    date[i+1] = [transformDate(money.S_Sensor_Time[i]),money.F_Ship_Air_Pressure[i]]
  }
  return date
}
function CreateAirTem(pressure){
  var pre =[];
  pre[0] = ['Time','Air Temp']
  for(var i=0;i<=pressure.S_Sensor_Time.length-1;i++){
    pre[i+1] = [transformDate(pressure.S_Sensor_Time[i]),pressure.F_Ship_Air_Temperature[i]];
  }
  return pre
}
function CreateWaterTem(pressure){
  var pre =[];
  pre[0] = ['Time','Water Temp']
  for(var i=0;i<=pressure.S_Sensor_Time.length-1;i++){
    pre[i+1] = [transformDate(pressure.S_Sensor_Time[i]),pressure.F_Ship_Water_Temperature[i]];
  }
  return pre
}
function CreateWaterPressure(pressure){
  var pre =[];
  pre[0] = ['Time','Water Pre']
  for(var i=0;i<=pressure.S_Sensor_Time.length-1;i++){
    pre[i+1] = [transformDate(pressure.S_Sensor_Time[i]),pressure.F_Ship_Water_Pressure[i]];
  }
  return pre
}
function CreateHumidity(humidity){
  var humi =[];
  humi[0] = ['Time','Water Pre']
  for(var i=0;i<=humidity.S_Sensor_Time.length-1;i++){
    humi[i+1] = [transformDate(humidity.S_Sensor_Time[i]),humidity.F_Ship_Humidity[i]];
  }
  return humi
}
function CreateRefTemp(reftemp){
  var ref =[];
  ref[0] = ['Time','Ref Temp']
  for(var i=0;i<=reftemp.S_Sensor_Time.length-1;i++){
    ref[i+1] = [transformDate(reftemp.S_Sensor_Time[i]),reftemp.F_Ship_Ref_Temp[i]];
  }
  return ref
}

function transformDate(date){
  data = new Date(date);
  year = data.getHours();
  month = data.getMinutes();
  dt = data.getSeconds();
  
  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }
  var fix = year+':' + month + ':'+dt;
  return fix
}


/*--------------Preset---------------*/ 
setInterval(function(){
  const date_fix1 = new Date() - (-8) * 3600 * 1000;
  const date_fix2 = new Date() - (-7.95) * 3600 * 1000;
  var T1 = new Date(date_fix1).toISOString()
  var T2 = new Date(date_fix2).toISOString() 

fetch('http://140.118.121.100:5000/Fisherman/Sensor_board',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Fisherman_Account: "b10702130@gapps.ntust.edu.tw",
      S_Sensor_Time_Up: T1,
      S_Sensor_Time_Low: T2
    })
  }).then(response => {
        return response.json()
      }
    )
    .then( (data) =>{      
      Sensor1(data);
      Sensor2(data);
      Sensor3(data);
      Sensor4(data);
      Sensor5(data);
      Sensor6(data);
      Sensor7(data);
      Sensor8(data);
    })
  },5000)

fetch('http://140.118.121.100:5000/Fisherman/Sensor_board',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Fisherman_Account: "b10702130@gapps.ntust.edu.tw",
      S_Sensor_Time_Up: "2020-11-01T11:12:20.568Z",
      S_Sensor_Time_Low: "2020-10-31T12:23:23.568Z"
    })
  }).then(response => {
        return response.json()
      }
    )
    .then( (data) =>{      
      Sensor1(data);
      Sensor2(data);
      Sensor3(data);
      Sensor4(data);
      Sensor5(data);
      Sensor6(data);
      Sensor7(data);
      Sensor8(data);
    })