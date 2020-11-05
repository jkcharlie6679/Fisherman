
const Logout = document.getElementById('Logout');
Logout.addEventListener('click', function change(){
    window.sessionStorage.clear();
    window.location.replace("../../login/login.html");
})
/*-----fetch API-----*/ 

let Account = window.sessionStorage.getItem("Fisherman_account");
    fetch('http://140.118.121.100:5000/Seller/Trade_list_nonfin',{
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
      .then( (order) =>{
        console.log(order)
        PriceList(order)
      })

function PriceList(order){    
  let output = ``;
  order.forEach(function(order){
      output+= `
      <tr>
        <td>${new Date(order.D_Trade_Time).Format("yyyy-MM-dd hh:mm:ss")}</td>
        <td>${order.S_Trade_Number}</td>
        <td>${order.S_Customer_Username}</td>
        <td>${DisplayGoodsNumber(order.S_Goods_Number)}</td>
        <td>${order.S_Goods_Quantity}</td>
        <td><img src="../../images/OrderStatus/${SelectStatus(order.S_Goods_Status)}"></td>
        <td>${order.I_Goods_Total}</td>
        <td>
          <button class="ChangeStatus3" onclick="ChangeStatus3(this)" name="${order.S_Customer_Username}" id="${order.S_Trade_Number}" style="display: inline-block;">delivery</button>
          <button class="ChangeStatus4" onclick="ChangeStatus4(this)" name="${order.S_Customer_Username}" id="${order.S_Trade_Number}" style="display: inline-block;">Finish</button>
        </td>
      </tr>`        
});
 document.getElementById('output').innerHTML = output;
}
function ChangeStatus3(status){
  console.log(status);
  let account = window.sessionStorage.getItem("Fisherman_account");
  let username = status.name;
  let id = status.id;
  fetch('http://140.118.121.100:5000/Seller/Trade_Deal',{
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Seller_Account: account,
      S_Customer_Username: username,
      S_Goods_Deal: "1",
      S_Trade_Number: id
    })
    }).then(response => {
        return response.json()
        }
    )
    .then( (data) =>{
        change3(data)
    })


}
function change3(money){
  if(money.S_Trade_Status == '1'){
  swal("Success", "Change to transportation Successfully！", "success", {timer: 1000,
    showConfirmButton: false});
  setTimeout(function(){
    window.location.replace('OrderStatus.html');
  },1000);
  }
  else{
    swal("Fail", "Change status fail!", "error", {timer: 3000,
      showConfirmButton: false});
    setTimeout(function(){
      window.location.replace('OrderStatus.html');
    },2500);
  }
}

/*-----Change Finish----------*/ 
function ChangeStatus4(status){
  console.log(status);
  let account = window.sessionStorage.getItem("Fisherman_account");
  let username = status.name;
  let id = status.id;
  fetch('http://140.118.121.100:5000/Seller/Trade_Deal',{
    method: 'POST',
    headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Seller_Account: account,
      S_Customer_Username: username,
      S_Goods_Deal: "2",
      S_Trade_Number: id
    })
    }).then(response => {
        return response.json()
        }
    )
    .then( (data) =>{
        change4(data)
    })


}
function change4(money){
  if(money.S_Trade_Status == '1'){
  swal("Success", "Change to Finish Successfully！", "success", {timer: 1000,
    showConfirmButton: false});
  setTimeout(function(){
    window.location.replace('OrderStatus.html');
  },1000);
  }
  else{
    swal("Fail", "Change status fail!", "error", {timer: 3000,
      showConfirmButton: false});
    setTimeout(function(){
      window.location.replace('OrderStatus.html');
    },2500);
  }
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
      html: 'Hash Code  :  '+data.S_Fish_Hash_Code+'<br>Fish Weight  :  '+data.S_Fish_Weight+' kg<br>'+'Fish Length  :  '+data.S_Fish_Length+' m<br>'+'Fish Datetime  :  '+new Date(data.S_Fish_Datetime).Format("yyyy-MM-dd hh:mm:ss")+'<br>'+'Fish Location  : <br>( '+data.S_Fish_Location_Y+' , '+data.S_Fish_Location_X+' )<br>'+'Fish Depth  :  '+data.S_Fish_Depth+' m<br>'+'Fish Temperature  :  '+data.S_Fish_Temperature+' °C<br>',
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

function SelectStatus(status){
  //0為上架 1以上價 2售出未完成、3運送 4售出完成
  let prepare = "order.png";
  let truck = "delivery-truck.png"
  if(status =='2'){
    return prepare
  }
  else if(status =='3'){
    return truck
  }

}

function DisplayGoodsNumber(Goodsnumber){
  var count = "<button class='GoodsNumber' onclick='Click(this)' id='"+Goodsnumber[0]+"' style='display: inline-block;'>"+Goodsnumber[0]+"</br>";
  for(var i=0;i<=Goodsnumber.length-2;i++){
     count = count + "<button class='GoodsNumber' onclick='Click(this)' id='"+Goodsnumber[i+1]+"'>"+Goodsnumber[i+1]+"</br>";
  }
//  var x = Goodsnumber[0]+"<br>"+Goodsnumber[1]+"<br>"
  return count
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