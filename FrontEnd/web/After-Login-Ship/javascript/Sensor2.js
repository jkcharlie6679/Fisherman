const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let Time_Up = document.getElementById('Time_Up').value;
  let Time_LOW = document.getElementById('Time_LOW').value;

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
    })
})
/*---------Sensor2--------*/ 
function Sensor2(date){
  google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart(date));

      function drawChart(date) {
        var data = google.visualization.arrayToDataTable(CreateDateTem(date));

        var options = {
          title: 'Ship Engine Temperature',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
      }
}
/*---------Sensor1--------*/ 
function Sensor1(date){
  google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart(date));

      function drawChart(date) {
        var data = google.visualization.arrayToDataTable(CreateDateSpeed(date));

        var options = {
          title: 'Ship Engine Rotating Speed',
          hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
    }

/*---------Sensor3--------*/ 
function Sensor3(date){
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart(date));

  function drawChart(date) {
    var data = google.visualization.arrayToDataTable(CreateWaterPressure(date));

    var options = {
      title: 'Ship Air Temperature',
      hAxis: {title: 'Date',  titleTextStyle: {color: '#666'}},
      vAxis: {minValue: 0},
      colors: ['#a52714']
    };

    var chart = new google.visualization.AreaChart(document.getElementById('chart_div2'));
    chart.draw(data, options);
  }
  }




function CreateDateTem(money){
  var date =[];
  date[0] = ['Time','Temperature'];
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
function CreateWaterPressure(pressure){
  var pre =[];
  pre[0] = ['Time','Air Temperature']
  for(var i=0;i<=pressure.S_Sensor_Time.length-1;i++){
    pre[i+1] = [transformDate(pressure.S_Sensor_Time[i]),pressure.F_Ship_Air_Temperature[i]];
  }
  return pre
}

function transformDate(date){
  data = new Date(date);
  year = data.getFullYear();
  month = data.getMonth()+1;
  dt = data.getDate();
  
  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }
  var fix = year+'-' + month + '-'+dt;
  return fix
}


/*--------------Preset---------------*/ 
fetch('http://140.118.121.100:5000/Fisherman/Sensor_board',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Fisherman_Account: "b10702130@gapps.ntust.edu.tw",
      S_Sensor_Time_Up: "2020-11-1T11:12:34.123Z",
      S_Sensor_Time_Low: "2020-10-31T12:23:23.123Z"
    })
  }).then(response => {
        return response.json()
      }
    )
    .then( (data) =>{      
      Sensor1(data);
      Sensor2(data);
      Sensor3(data);
    })