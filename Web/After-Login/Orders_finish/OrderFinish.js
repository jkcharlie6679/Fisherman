const Logout = document.getElementById('Logout');
Logout.addEventListener('click', function change(){
    window.sessionStorage.clear();
    window.location.replace("../../login/login.html");
})



/*-----fetch API-----*/ 

let Account = window.sessionStorage.getItem("Fisherman_account");
    fetch('http://140.118.121.100:5000/Customer/Trade_list_fin',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        S_Customer_Username:window.sessionStorage.getItem("Username")
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
        <td>${DisplayGoodsNumber(order.S_Goods_Number)}</td>
        <td>${order.S_Goods_Quantity}</td>
        <td><img src="../../images/OrderStatus/delivered.png" width="68" height="50"></td>
        <td>${order.I_Goods_Total}</td>
        <td>${order.S_Trade_Address}</td>
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
      html: 'Hash Code  :  '+data.S_Fish_Hash_Code+'<br>Fish Weight  :  '+data.S_Fish_Weight+' kg<br>'+'Fish Length  :  '+data.S_Fish_Length+' m<br>'+'Fish Datetime  :  '+new Date(data.S_Fish_Datetime).Format("yyyy-MM-dd hh:mm:ss")+'<br>'+'Fish Location  : <br>( '+data.S_Fish_Location_Y+' , '+data.S_Fish_Location_X+' )<br>'+'Fish Depth  :  '+data.S_Fish_Depth+' m<br>'+'Fish Temperature  :  '+data.S_Fish_Temperature+'°C<br>',
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
