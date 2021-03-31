const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();

  let S_Fisherman_Account = document.getElementById('S_Fishman_Account').value;
  let S_Fisherman_Password = document.getElementById('S_Fishman_Password').value;



  fetch('http://140.118.121.100:5000/Admin/Log_in',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Admin_Account:S_Fisherman_Account,
      S_Admin_Password:S_Fisherman_Password,
    })
  }).then(response => {
    return response.json()
  }) 
  .then( (data) =>{
    if(data.S_Admin_Login_Log=="Login success"){
        window.location.replace('../admin_page/admin.html')
        window.sessionStorage.setItem("admin", data.S_Admin_Login_Username);
      }
    else{
        alert('account or password incorrect')
    }
  })
});