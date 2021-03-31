const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();

  let S_Customer_Account = document.getElementById('S_Customer_Account').value;
  let S_Customer_Password = document.getElementById('S_Customer_Password').value;

  //測試使用
  
  if(S_Customer_Account == 'rtlab601@gmail.com' && S_Customer_Password == 'rtlab666'){
    window.sessionStorage.setItem("Username",S_Customer_Account);
    window.location.href="../After-Login/HomePage2/HomePage2.html";
  }
  
  //測試結束



  fetch('http://140.118.121.100:5000/Customer/Login',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Customer_Account:S_Customer_Account,
      S_Customer_Password:S_Customer_Password,
    })
  }).then(response => {
    return response.json()
  }) 
  .then( (data) =>{
    render(data)
  })
});

function render(data){
  let market = data.S_Customer_Login_Status;

    if(market == '0')
    {
      swal("Success", "Login Successfully！", "success", {timer: 1000
        ,showConfirmButton: false});
      window.sessionStorage.setItem("Username", data.S_Customer_Username);
      window.sessionStorage.setItem("Account", data.S_Customer_Account);
      setTimeout(function(){
        window.location.replace('../After-Login/Shopping-Page2/Shopping-Page2.html');
      },1000);
    }
    else if(market == '1'){
      console.log("Please Verify your email account");
      swal("Please Verify", "Please verify your account first!", "warning", {timer: 3000,
        showConfirmButton: false});
    }
    else if(market == '2'){
      console.log("Incorrect Password");
      swal("Fail", "Incorrect Password!", "error", {timer: 3000,
        showConfirmButton: false});
    }
    else if(market == '3'){
      console.log("Account does not exist");
      swal("Fail", "Account does not exist!", "error", {timer: 3000,
        showConfirmButton: false});
    }

}


