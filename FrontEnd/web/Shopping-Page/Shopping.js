
let Account = window.sessionStorage.getItem("Username");
console.log(Account);
fetch('http://140.118.121.100:5000/Customer/Goods_list',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "S_Fish_Name": 31,
        "I_Price_Up": '0',
        "I_Price_Low":'0'
      })
    }).then(response => {
          return response.json()
        }
      )
      .then( (money) =>{
        PriceList(money)
      })

function PriceList(money){
    var photo;
    let output = ``;
    console.log(money)
    money.forEach(function(money){
        switch(money.S_Fish_Name){
            case 'Mackerel':
                photo='../images/鮪魚2.png';
                break;
            case 'Grouper':
                photo='../images/swordfish.png';
                break;
            case 'Swordfish':
                photo='../images/tuna.png';
                break;
            case 'Mahi_mahi':
                photo='../images/mackerel.png';
                break;
            case 'Tuna':
                photo='../images/grouper.png';
                break;
        }
        output+= `
        <a href="../Fish-detail2/Fish-detail2.html"><button class="product-list">
        <div class="product-fishname">
            <p>${money.S_Fish_Name}</p>
        </div>
        <div class="product-price">
            <p>$價格：${money.I_Goods_price} 元(臺幣/臺斤)</p>
        </div>
        <div class="product-box">
            <img src="${photo}">
        </div>
        </button></a>
        `
        
});
   document.getElementById('output').innerHTML = output;
}

const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  //let D_Ship_Fix_Time = new Date().toLocaleString( );
  let S_Fish_Name=0;
  let flag=0;
    for(var i=0; i<myForm.fish.length;i++){
        if(myForm.fish[i].checked){
            S_Fish_Name += parseInt(myForm.fish[i].value);
            flag=1;
            console.log(S_Fish_Name)
        }
    }
    if(flag==0)
    {
        S_Fish_Name=31;
    }
//   let S_Fish_Name = parseInt(document.getElementById('Tuna').value)+parseInt(document.getElementById('Swordfish').value)+parseInt(document.getElementById('Grouper').value)+parseInt(document.getElementById('Mackerel').value)+parseInt(document.getElementById('Mahi_mahi').value);
//   let S_Ship_Fix_Log = document.getElementById('Swordfish').value;
//   let S_Ship_Fix_Log = document.getElementById('Grouper').value;
//   let S_Ship_Fix_Log = document.getElementById('Mackerel').value;
//   let S_Ship_Fix_Log = document.getElementById('Mahi_mahi').value;
if(document.getElementById("min2").value=="")
    {
        var I_Price_Low='0';  
    }
else 
    var I_Price_Low = document.getElementById("min2").value;
if(document.getElementById("max2").value=="")
    {
        var I_Price_Up='0';
    }
else
  var I_Price_Up = document.getElementById("max2").value;
//   let S_Fisherman_Account = "b10702130@gapps.ntust.edu.tw"//email
//   let S_Ship_Fix_Item
//   for(var i=0; i<form.S_Ship_Fix_Item.length;i++){
//     if(form.S_Ship_Fix_Item[i].checked){
//         S_Ship_Fix_Item = form.S_Ship_Fix_Item[i].value;
//     }
// }
console.log({
    "S_Fish_Name": S_Fish_Name,
    "I_Price_Up": I_Price_Up,
    "I_Price_Low":I_Price_Low
  })
fetch('http://140.118.121.100:5000/Customer/Goods_list',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "S_Fish_Name": S_Fish_Name,
        "I_Price_Up": I_Price_Up,
        "I_Price_Low":I_Price_Low
      })
    }).then(response => {
          return response.json()
        }
      )
      .then( (money) =>{
        PriceList(money)
      })
});