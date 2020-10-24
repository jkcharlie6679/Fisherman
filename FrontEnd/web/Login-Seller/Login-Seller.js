const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();

  let S_Seller_Account = document.getElementById('S_Seller_Account').value;
  let S_Seller_Password = document.getElementById('S_Seller_Password').value;

  //測試使用
  
  if(S_Seller_Account == 'rtlab601@gmail.com' && S_Seller_Password == 'rtlab666'){
    window.sessionStorage.setItem("Fisherman",S_Seller_Account);
    window.location.href="../After-Login-Seller/Seller-HomePage/SellerHome.html";
  }
  
  //測試結束



  fetch('http://140.118.121.100:5000/Seller/Login',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Seller_Account:S_Seller_Account,
      S_Seller_Password:S_Seller_Password,
    })
  }).then(response => {
    return response.json()
  }) 
  .then( (data) =>{
    render(data)
  })
});

function render(data){
  let market = data.S_Seller_Login_Status;

    if(market == '0')
    {
      window.sessionStorage.setItem("Fisherman_account",data.S_Seller_Account);
      swal("Success", "登入成功!系統將自動跳轉", "success", {timer: 3000,
        showConfirmButton: false});
      window.sessionStorage.setItem("Fisherman", data.S_Seller_Username);
      setTimeout(function(){
        window.location.replace('../After-Login-Seller/Seller-HomePage/SellerHome.html');
      },3000);
      
    }
    else if(market == '1'){
      console.log("Incorrect Password");
      swal("Fail", "密碼錯誤!", "error", {timer: 2000,
        showConfirmButton: false});
    }
    else if(market == '2'){
      console.log("Account does not exist");
      swal("Fail", "此帳號不存在!", "error", {timer: 2000,
        showConfirmButton: false});
    }

}


