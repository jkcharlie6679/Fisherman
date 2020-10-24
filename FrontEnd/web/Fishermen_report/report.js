const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  //let D_Ship_Fix_Time = new Date().toLocaleString( );
  let S_Ship_Fix_Log = document.getElementById('S_Ship_Fix_Log').value;
  var form = document.getElementById("myForm");
  let S_Fisherman_Account = "b10702130@gapps.ntust.edu.tw"//email
  let S_Ship_Fix_Item
  for(var i=0; i<form.S_Ship_Fix_Item.length;i++){
    if(form.S_Ship_Fix_Item[i].checked){
        S_Ship_Fix_Item = form.S_Ship_Fix_Item[i].value;
    }
}
  
  fetch('http://140.118.121.100:5000/Fisherman/Fix',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      "Access-Control-Request-Headers": "*"
    },
    body: JSON.stringify({
      //D_Ship_Fix_Time:D_Ship_Fix_Time,
      S_Fisherman_Account:S_Fisherman_Account,
      S_Ship_Fix_Item:S_Ship_Fix_Item,
      S_Ship_Fix_Log:S_Ship_Fix_Log,
    })
  }).then((res) => res.json())
    .then((data) => console.log(data))
});

