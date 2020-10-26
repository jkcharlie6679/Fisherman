
  //Fetch Api
  const myForm = document.getElementById('myForm');
  const myVerify = document.getElementById('myVerify');
  myForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let S_Customer_First_Name = document.getElementById('S_Customer_First_Name').value;
    let S_Customer_Last_Name = document.getElementById('S_Customer_Last_Name').value;
    let S_Customer_Account = document.getElementById('S_Customer_Account').value;
    let S_Customer_Username = document.getElementById('S_Customer_Username').value;
    let S_Customer_Password = document.getElementById('S_Customer_Password').value;
    let D_Customer_Birthday = document.getElementById('D_Customer_Birthday').value;
    let S_Customer_Phone = document.getElementById('S_Customer_Phone').value;
    let S_Customer_Post_Number = document.getElementById('S_Customer_Post_Number').value;
    let S_Customer_City = document.getElementById('S_Customer_City').value;
    let S_Customer_Town = document.getElementById('S_Customer_Town').value;
    let S_Customer_Other = document.getElementById('S_Customer_Other').value;
  
    fetch('http://140.118.121.100:5000/Customer/Sign_up',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        S_Customer_First_Name:S_Customer_First_Name,
        S_Customer_Last_Name:S_Customer_Last_Name,
        S_Customer_Account:S_Customer_Account,
        S_Customer_Username:S_Customer_Username,
        S_Customer_Password:S_Customer_Password,
        D_Customer_Birthday:D_Customer_Birthday,
        S_Customer_Phone:S_Customer_Phone,
        S_Customer_Post_Number:S_Customer_Post_Number,
        S_Customer_City:S_Customer_City,
        S_Customer_Town:S_Customer_Town,
        S_Customer_Other:S_Customer_Other
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
    let market = data.S_Customer_Verify_Code;
    let status = data.S_Customer_Signup_Status;
    let Account = data.S_Customer_Account;

    if(status == '0')
    { 
        swal("Success", "Sign up successfully", "success", {timer: 2000,
        showConfirmButton: false});
        myVerify.addEventListener('submit',function Verify(e){
        e.preventDefault();
    
        let Verify_Code = document.getElementById('Verify_Code').value;
        if(Verify_Code == market)
        {  
          //Fetch API
          fetch('http://140.118.121.100:5000/Customer/Verify',{
          method: 'POST',
          headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            S_Customer_Account : Account,
            S_Customer_Verifiy_Status : "1"
          })
          }).then(res => {
            return res.json()
            }
            )
            .then( (user) =>{
              VerifySuccess(user)
            })
        }
        else{
          swal("Failed", "Verify Code is wrong", "error", {timer: 2000,
            showConfirmButton: false});
        }})
    }
    else if(status == '1'){
      console.log("Account existed");
      swal("Warning", "Email has been used", "error", {timer: 2000,
        showConfirmButton: false});
    }
    else if(status == '2'){
      console.log("Username existed");
      swal("Warning", "Username has been used", "error", {timer: 2000,
        showConfirmButton: false});
    }
    else if(status == '3'){
      console.log("Account and Username existed");
      swal("Warning", "Email and username have been used", "error", {timer: 2000,
        showConfirmButton: false});
    }
  }

  function VerifySuccess(user){
    let VerifyStatus = user.S_Customer_Verify_Status;

    if(VerifyStatus == '0'){
        swal("Success", "Verify successfully", "success", {timer: 3000,
        showConfirmButton: false});
        setTimeout(function(){
          window.location.replace('../login/login.html')
        },3000);
    }
    else if(VerifyStatus == '1'){
      swal("Warning", "The email doesn't exist", "error", {timer: 2000,
        showConfirmButton: false});
    }
  }