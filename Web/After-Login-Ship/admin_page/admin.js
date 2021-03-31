//Fetch Api 
const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
  e.preventDefault();
  let S_Fishman_Account = document.getElementById('S_Fishman_Account').value;
  let S_Fishman_Password = document.getElementById('S_Fishman_Password').value;
  let S_Fishman_Username = document.getElementById('S_Fishman_Username').value;
  let S_FishMan_Owner = document.getElementById('S_FishMan_Owner').value;
  let S_Fishman_Company = document.getElementById('S_Fishman_Company').value;
  let S_Fishman_Company_Serial = document.getElementById('S_Fishman_Company_Serial').value;
  let S_Fishman_Serial = document.getElementById('S_Fishman_Serial').value;
  let S_Fishman_Phone = document.getElementById('S_Fishman_Phone').value;
  let S_Fishman_Tele = document.getElementById('S_Fishman_Tele').value;
  let S_Fishman_Blkchain_passwd= document.getElementById('S_Fishman_Blkchain_passwd').value;
  let S_Fishman_Company_Address = document.getElementById('S_Fishman_Company_Address').value;
  let S_Fishman_Port = document.getElementById('S_Fishman_Port').value;


  fetch('http://192.168.31.230:5000/Fishman/Sign_up',{
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      S_Fishman_Account:S_Fishman_Account,
      S_Fishman_Password:S_Fishman_Password,
      S_Fishman_Username:S_Fishman_Username,
      S_FishMan_Owner:S_FishMan_Owner,
      S_Fishman_Company:S_Fishman_Company,
      S_Fishman_Company_Serial:S_Fishman_Company_Serial,
      S_Fishman_Serial:S_Fishman_Serial,
      S_Fishman_Phone:S_Fishman_Phone,
      S_Fishman_Tele:S_Fishman_Tele,
      S_Fishman_Blkchain_passwd:S_Fishman_Blkchain_passwd,
      S_Fishman_Company_Address:S_Fishman_Company_Address,
      S_Fishman_Port:S_Fishman_Port,
      I_Fishman_Role:"0"
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

let status = data.S_Fishman_Status;

  if(status == '0')
  { 
    myVerify.addEventListener('submit',function Verify(e){
    e.preventDefault();
    alert('帳號註冊成功')
    })
  }
  else if(S_Fishman_Status == '1'){
    console.log("Account existed");
    alert('帳號已有人使用')
  }
}