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
          <td><button class="fishbutton" onclick="Click(this)" id="${money.S_Goods_Number}"><img src="../../images/blockchain.png"></button></td>
          <td>${money.S_Goods_Number}</td>
          <td>${money.S_Fish_Name}</td>
          <td><img src="../../images/${ChooseFish(money.S_Fish_Name)}"></td>
          <td>${money.S_Fish_Weight} kg</td>
          <td>${money.S_Fish_Length} m</td>
          <td>${new Date(money.S_Fish_Datetime).Format("yyyy-MM-dd hh:mm:ss")}</td>
          <td>$${money.I_Goods_price}</td>
          <td><input type="checkbox" name="Fishname" id="Fishname" value="${money.S_Goods_Number}"></td>
        </tr>`   
         
            
});
   document.getElementById('output').innerHTML = output;
}

function Click(number){
  window.sessionStorage.setItem("SellFishDetail",number.id)
  fetch('http://140.118.121.100:5000/Customer/Goods_detail',{
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "S_Goods_Number":window.sessionStorage.getItem("SellFishDetail")
    })
    }).then(response => {
        return response.json()
        }
    )
    .then( (data) =>{
        showdata(data)
    })

  
}	
function showdata(data){
  Swal.fire({
      title: data.S_Fish_Name, 
      html: 'Hash Code  :  '+data.S_Fish_Hash_Code+'<br>Fish Weight  :  '+data.S_Fish_Weight+' kg<br>'+'Fish Length  :  '+data.S_Fish_Length+' m<br>'+'Fish Datetime  :  '+new Date(data.S_Fish_Datetime).Format("yyyy-MM-dd hh:mm:ss")+'<br>'+'Fish Location  : <br> ( '+data.S_Fish_Location_Y+' , '+data.S_Fish_Location_X+' )<br>'+'Fish Depth  :  '+data.S_Fish_Depth+' m<br>'+'Fish Temperature  :  '+data.S_Fish_Temperature+'°C<br>',
      imageUrl:'../../images/'+ChooseFish(data.S_Fish_Name), 
  },
  function(){
      var element =document.getElementById("register-box");
      element.style.background = "#154360";
});
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