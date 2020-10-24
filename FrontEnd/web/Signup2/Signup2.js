
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
        alert('註冊成功，驗證碼已寄送至您的信箱，請點擊驗證表格認證您的信箱')
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
          alert('驗證碼錯誤')
        }})
    }
    else if(status == '1'){
      console.log("Account existed");
      alert('帳號已有人使用')
    }
    else if(status == '2'){
      console.log("Username existed");
      alert('暱稱已有人使用')
    }
    else if(status == '3'){
      console.log("Account and Username existed");
      alert('帳號及暱稱皆已有人使用')
    }
  }

  function VerifySuccess(user){
    let VerifyStatus = user.S_Customer_Verify_Status;

    if(VerifyStatus == '0'){
        alert('驗證通過，點擊確認後，5秒後畫面將自動跳轉')
        setTimeout(function(){
          window.location.replace('../login/login.html')
        },3000);
    }
    else if(VerifyStatus == '1'){
      alert('此帳號不存在')
    }
  }