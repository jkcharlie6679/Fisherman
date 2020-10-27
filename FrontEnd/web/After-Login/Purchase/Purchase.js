fetch('http://140.118.121.100:5000/Customer/Cart_list',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "S_Customer_Username": window.sessionStorage.getItem("Username")
      })
    }).then(response => {
          return response.json()
        }
      )
      .then( (money) =>{
        PriceList(money)
      })
var S_Goods_Number_list=[];
function PriceList(money){
    var photo;
    let output = ``;
    let total_price=0;
    let fish_price=0;
    console.log(money)
    money.forEach(function(money){
        fish_price=parseInt(money.S_Goods_Price)+fish_price
        total_price=parseInt(fish_price)+60
        console.log(money.S_Goods_Price)
        S_Goods_Number_list.push({"S_Goods_Number":money.S_Goods_Number})
        console.log(S_Goods_Number_list)
        switch(money.S_Fish_Name){
            case 'Mackerel':
                photo='../../images/mackerel.png';
                break;
            case 'Grouper':
                photo='../../images/grouper.png';
                break;
            case 'Swordfish':
                photo='../../images/swordfish.png';
                break;
            case 'Mahi_mahi':
                photo='../../images/Θ«¬Θ¡Ü2.png';
                break;
            case 'Tuna':
                photo='../../images/tuna.png';
                break;
        }
        output+= ` 
        <tr>
            <td>
                <div class="cart-info">
                    <img src=${photo}>
                    <div>
                        <p><strong>${money.S_Fish_Name}</strong></p>
                        <small>價格: $${money.S_Goods_Price}</small>
                        <small>商品編號: ${money.S_Goods_Number}</small>
                        <br>
                        <button type="button" type="click" onclick="delete_cart(this)" name="${money.S_Goods_Number}"><strong>移除</strong></button>
                    </div>
                </div>

            </td>
            <td>$${money.S_Goods_Price}</td>
        <tr>
        `
        
});
   document.getElementById('output').innerHTML = output;
   document.getElementById('total_price').innerHTML = total_price;
   document.getElementById('fish_price').innerHTML = fish_price;
}
function delete_cart(number)
{
fetch('http://140.118.121.100:5000/Customer/Delete/Shop_Cart',{
method: 'POST',
headers: {
    'Accept': 'application/json, text/plain',
    'Content-Type': 'application/json'
},
body: JSON.stringify({
    "S_Customer_Username":"Charlie",
    "S_Goods_Number": number.name
})
}).then(response => {
    console.log(number.name)
    return response.json()
    })
    .then( (res) =>{
        if(res.S_Cart_Delete_Status==0){
            Swal.fire({
                icon: 'success',
                title: '移除成功!',
                text: number.id+' 已經成功移除',
                timer: 2000,
              })
              setTimeout(function(){
                window.location.replace('../Purchase/Purchase.html');
              },2000);
        }
        else if(res.S_Cart_Delete_Status==1){
            Swal.fire({
                icon: 'error',
                title: 'Add fail!',
                text: number.id+' is already in your cart',
              })
        }
      })
}
const myForm = document.getElementById('myForm');
myForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let S_Trade_Tax_ID = document.getElementById('S_Trade_Tax_ID').value;
    let S_Trade_Receiver = document.getElementById('S_Trade_Receiver').value;
    let S_Receiver_Phone = document.getElementById('S_Receiver_Phone').value;
    let I_Trade_Post_Number = document.getElementById('I_Trade_Post_Number').value;
    let S_Trade_Address = document.getElementById('S_Trade_Address').value;

    // let S_Customer_Last_Name = document.getElementById('S_Customer_Last_Name').value;
    // let S_Customer_Account = document.getElementById('S_Customer_Account').value;
    // let S_Customer_Username = document.getElementById('S_Customer_Username').value;
    // let S_Customer_Password = document.getElementById('S_Customer_Password').value;
    // let D_Customer_Birthday = document.getElementById('D_Customer_Birthday').value;
    // let S_Customer_Phone = document.getElementById('S_Customer_Phone').value;
    // let S_Customer_Post_Number = document.getElementById('S_Customer_Post_Number').value;
    // let S_Customer_City = document.getElementById('S_Customer_City').value;
    // let S_Customer_Town = document.getElementById('S_Customer_Town').value;
    // let S_Customer_Other = document.getElementById('S_Customer_Other').value;
  
    fetch('http://140.118.121.100:5000/Customer/Trade',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{
        "S_Customer_Account": window.sessionStorage.getItem("Account"),
        "S_Customer_Username": window.sessionStorage.getItem("Username"),
        "I_Trade_Pay": "1",
        "S_Trade_Tax_ID": S_Trade_Tax_ID,
        "S_Trade_Logistics": "black cat",
        "S_Trade_Receiver": S_Trade_Receiver,
        "S_Receiver_Phone": S_Receiver_Phone,
        "I_Trade_Post_Number": I_Trade_Post_Number,
        "S_Trade_Address": S_Trade_Address
      },S_Goods_Number_list]
      )
    }).then(response => {
          return response.json()
        }
      )
      .then( (res) =>{
        if(res.S_Trade_Status=="Add success"){
            Swal.fire({
                icon: 'success',
                title: 'you have buy a commodity',
                text:'see trade list have more information!',
                timer: 2000,
              })
              setTimeout(function(){
                window.location.replace('../Orders/Orders.html');
              },2000);
        }
        else if(res.S_Cart_Delete_Status==1){
            Swal.fire({
                icon: 'error',
                title: 'Add fail!',
                text: number.id+' is already in your cart',
              })
        }
      })
      
  });