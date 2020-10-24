const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();

  let S_Fishman_Account = document.getElementById('S_Fishman_Account').value;
  let S_Fishman_Password = document.getElementById('S_Fishman_Password').value;

  //測試使用
  if(S_Fishman_Account == 'rtlab601@gmail.com' && S_Fishman_Password == 'rtlab666'){
    window.location.replace('../After-Login-Ship/Fishermen_center_console/home.html')
  }


  fetch('http://140.118.121.100:5000/Fisherman/Login',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Fisherman_Account:S_Fishman_Account,
      S_Fisherman_Password:S_Fishman_Password,
    })
  }).then(response => {
    return response.json()
  }) 
  .then( (data) =>{
    render(data)
  })
});

function render(data){
  let market = data.S_Fisherman_Login_Status;

    if(market == '0')
    {
      swal("Success", "登入成功!系統將自動跳轉", "success", {timer: 3000,
        showConfirmButton: false});
      setTimeout(function(){
        window.location.replace('../Fishermen_center_console/home.html');
      },3000);
    }
    else if(market == '1'){
      console.log("Please Verify your email account");
      alert('請先驗證您的信箱')
    }
    else if(market == '2'){
      console.log("Incorrect Password");
      alert('帳號或密碼錯誤')
    }
    else if(market == '3'){
      console.log("Account does not exist");
      alert('此帳號不存在')
    }

}


