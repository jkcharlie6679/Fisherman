
  //Fetch Api For This Week Set Price
  const myForm = document.getElementById('myForm');
  var count = 0;
  myForm.addEventListener('submit', function (e) {
    e.preventDefault();
    //本週價格
    let S_Seller_Account = window.sessionStorage.getItem("Fisherman_account");
    let S_Price_Tuna = document.getElementById('Tuna-set-price').value;
    let S_Price_Swordfish = document.getElementById('Swordfish-set-price').value;
    let S_Price_Grouper = document.getElementById('Grouper-set-price').value;
    let S_Price_Mackerel = document.getElementById('Mackerel-set-price').value;
    let S_Price_Mahi_mahi = document.getElementById('Mahi-mahi-set-price').value;
  
    fetch('http://140.118.121.100:5000/Seller/Set_Price',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        S_Seller_Account:S_Seller_Account,
        S_Price_Week:'1',
        I_Price_Tuna:S_Price_Tuna,
        I_Price_Swordfish:S_Price_Swordfish,
        I_Price_Grouper:S_Price_Grouper,
        I_Price_Mackerel:S_Price_Mackerel,
        I_Price_Mahi_mahi:S_Price_Mahi_mahi
      })
    }).then(response => {
          return response.json()
        }
      )
      .then( (data) =>{
        render(data)
      })
      
  });

  function render(data){
    let status = data.I_Price_Set_Status;

    if(status == '1'){
        console.log("Add success");
      swal("Success", "本週價格已設定成功", "success", {timer: 2000,
        showConfirmButton: false});
      setTimeout(function(){
        window.location.replace('SetFishPrice.html');
      },2000);
    }
    else if(status == '2'){
      console.log("Update success");
      swal("Success", "本週價格已更新成功", "success", {timer: 2000,
        showConfirmButton: false});
      setTimeout(function(){
        window.location.replace('SetFishPrice.html');
      },2000);
    }
    else{
      swal("Fail", "找不到漁貨", "error", {timer: 2000,
        showConfirmButton: false});
      setTimeout(function(){
        window.location.replace('SetFishPrice.html');
      },2000);
    }
  }


  // API For Next Week Set Price
  myForm.addEventListener('submit', function (e) {
    e.preventDefault();
    //下週價格
    let S_Seller_Account = window.sessionStorage.getItem("Fisherman_account");
    let S_Price_Tuna = document.getElementById('Tuna-next-price').value;
    let S_Price_Swordfish = document.getElementById('Swordfish-next-price').value;
    let S_Price_Grouper = document.getElementById('Grouper-next-price').value;
    let S_Price_Mackerel = document.getElementById('Mackerel-next-price').value;
    let S_Price_Mahi_mahi = document.getElementById('Mahi-mahi-next-price').value;
  
    fetch('http://140.118.121.100:5000/Seller/Set_Price',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        S_Seller_Account:S_Seller_Account,
        S_Price_Week:'2',
        I_Price_Tuna:S_Price_Tuna,
        I_Price_Swordfish:S_Price_Swordfish,
        I_Price_Grouper:S_Price_Grouper,
        I_Price_Mackerel:S_Price_Mackerel,
        I_Price_Mahi_mahi:S_Price_Mahi_mahi
      })
    }).then(response => {
          return response.json()
        }
      )
      .then( (user) =>{
        NextWeek(user)
      })
      
  });

  function NextWeek(user){
    let status = user.I_Price_Set_Status;

    if(status == '1'){
      console.log("Add success");
      swal("Success", "下週價格已設定成功", "success", {timer: 2000,
        showConfirmButton: false});
      setTimeout(function(){
        window.location.replace('SetFishPrice.html');
      },2000);
    }
    else if(status == '2'){
      console.log("Update success");
      swal("Success", "下週價格已更新成功", "success", {timer: 2000,
        showConfirmButton: false});
      setTimeout(function(){
        window.location.replace('SetFishPrice.html');
      },2000);
    }
    else{
        swal("Fail", "找不到漁貨", "error", {timer: 2000,
          showConfirmButton: false});
        setTimeout(function(){
          window.location.replace('SetFishPrice.html');
        },2000);
    }
  }


//Get Price List API

let Account = window.sessionStorage.getItem("Fisherman_account");
fetch('http://140.118.121.100:5000/Seller/Price_list',{
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
    //set display price to html for next week
    window.sessionStorage.setItem("Tuna2", "$"+money[2].I_Price_Tuna);
    window.sessionStorage.setItem("Swordfish2","$"+money[2].I_Price_Swordfish);
    window.sessionStorage.setItem("Grouper2","$"+money[2].I_Price_Grouper);
    window.sessionStorage.setItem("Mackerel2", "$"+money[2].I_Price_Mackerel);
    window.sessionStorage.setItem("Mahi_mahi2", "$"+money[2].I_Price_Mahi_mahi);

    //set display price to html for this week
    window.sessionStorage.setItem("Tuna1", "$"+money[1].I_Price_Tuna);
    window.sessionStorage.setItem("Swordfish1", "$"+money[1].I_Price_Swordfish);
    window.sessionStorage.setItem("Grouper1","$"+ money[1].I_Price_Grouper);
    window.sessionStorage.setItem("Mackerel1", "$"+money[1].I_Price_Mackerel);
    window.sessionStorage.setItem("Mahi_mahi1", "$"+money[1].I_Price_Mahi_mahi);

    //set display price to html for last week
    window.sessionStorage.setItem("Tuna0", "$"+money[0].I_Price_Tuna);
    window.sessionStorage.setItem("Swordfish0", "$"+money[0].I_Price_Swordfish);
    window.sessionStorage.setItem("Grouper0","$"+ money[0].I_Price_Grouper);
    window.sessionStorage.setItem("Mackerel0", "$"+money[0].I_Price_Mackerel);
    window.sessionStorage.setItem("Mahi_mahi0", "$"+money[0].I_Price_Mahi_mahi);

    document.getElementById("last-set-price-box").innerHTML= window.sessionStorage.getItem("Tuna0");
    document.getElementById("set-pricetext-setted").innerHTML= window.sessionStorage.getItem("Tuna1");
    document.getElementById("next-set-pricetext-setted").innerHTML=window.sessionStorage.getItem("Tuna2");

    document.getElementById("Sword-last-set-price-box").innerHTML= window.sessionStorage.getItem("Swordfish0");
    document.getElementById("Sword-set-pricetext-setted").innerHTML= window.sessionStorage.getItem("Swordfish1");
    document.getElementById("Sword-next-set-pricetext-setted").innerHTML= window.sessionStorage.getItem("Swordfish2");

    document.getElementById("Grouper-last-set-price-box").innerHTML= window.sessionStorage.getItem("Grouper0");
    document.getElementById("Grouper-set-pricetext-setted").innerHTML= window.sessionStorage.getItem("Grouper1");
    document.getElementById("Grouper-next-set-pricetext-setted").innerHTML= window.sessionStorage.getItem("Grouper2");

    document.getElementById("Mackerel-last-set-price-box").innerHTML= window.sessionStorage.getItem("Mackerel0");
    document.getElementById("Mackerel-set-pricetext-setted").innerHTML= window.sessionStorage.getItem("Mackerel1");
    document.getElementById("Mackerel-next-set-pricetext-setted").innerHTML= window.sessionStorage.getItem("Mackerel2");

    document.getElementById("Mahi_mahi-last-set-price-box").innerHTML= window.sessionStorage.getItem("Mahi_mahi0");
    document.getElementById("Mahi_mahi-set-pricetext-setted").innerHTML= window.sessionStorage.getItem("Mahi_mahi1");
    document.getElementById("Mahi_mahi-next-set-pricetext-setted").innerHTML= window.sessionStorage.getItem("Mahi_mahi2");
}



  