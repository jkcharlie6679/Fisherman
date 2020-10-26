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
      swal("Success", "Login Successfully！", "success", {timer: 1500,
        showConfirmButton: false});
      setTimeout(function(){
        window.location.replace('../Fishermen_center_console/home.html');
      },1500);
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


