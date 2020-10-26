//Get Price List API
const myForm = document.getElementById('myForm');
let Account = window.sessionStorage.getItem("Fisherman_account");
fetch('http://140.118.121.100:5000/Seller/Shelf_list',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        S_Seller_Account:Account
      })
    }).then(response => {
          return response.json()
        }
      )
      .then( (money) =>{
        PriceList(money)
      })

function PriceList(money){    
    let output = ``;
    money.forEach(function(money){
        output+= `
        <tr>
          <td><button class="fishbutton" onclick="Click(this)" id="${money.S_Fish_Hash_Code}"><img  src="../../images/key.png"></button></td>
          <td>${money.S_Goods_Number}</td>
          <td>${money.S_Fish_Name}</td>
          <td><img src="../../images/${ChooseFish(money.S_Fish_Name)}"></td>
          <td>${money.S_Fish_Weight}kg</td>
          <td>${money.S_Fish_Length}m</td>
          <td>${money.S_Fish_Datetime}</td>
          <td>$${money.I_Goods_price}</td>
          <td><input type="checkbox" name="Fishname" id="Fishname" value="${money.S_Goods_Number}"></td>
        </tr>`        
});
   document.getElementById('output').innerHTML = output;
}


function ChooseFish(Fishclassify){
  let SwordfishPicture = 'swordfish.png';
  let MackerelPicture = 'mackerel.png';
  let TunaPicture = 'tuna.png';
  let GrouperPicture = 'grouper.png';
  let MahiMahiPicture = 'Θ«¬Θ¡Ü2.png';

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

/*-----Submit API ------*/

myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  var form = document.getElementById("myForm");  
  let Good ;
  for(var i=0;i<form.Fishname.length;i++){
      if(form.Fishname[i].checked){
        Good = form.Fishname[i].value
        sendGood(Good);
      }
  } 
});

function sendGood(Good){
let HashAccount = window.sessionStorage.getItem("Fisherman_account");  
fetch('http://140.118.121.100:5000/Seller/Down_Shelf',{
  method: 'POST',
  headers: {
    'Accept': 'application/json, text/plain',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(
[
  {
    S_Seller_Account:HashAccount
  },
  {
    S_Goods_Number:Good
  }
]
  )
}).then(response => {
      return response.json()
    }
  )
  .then( (goods) =>{
    Push(goods)
  })
}

function Push(goods){
  var count = 0;
  let status = goods.S_Down_Shelf_Status;
  if(status == '0'){
    if(count == '0'){
      swal("Success", "Off the shelves successfully", "success", {timer: 2000,
        showConfirmButton: false});
      setTimeout(function(){
        window.location.replace('Shelves.html');
      },1000);
    }
    count++;
  }
  else{
    swal("Fail", "Can't find the dish", "error", {timer: 2000,
      showConfirmButton: false});
    setTimeout(function(){
      window.location.replace('Shelves.html');
    },2000);
  }
}

const Logout = document.getElementById('Logout');
Logout.addEventListener('click', function change(){
    window.sessionStorage.clear();
    window.location.replace("../../Login-Seller/Login-Seller.html");
})
