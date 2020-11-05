fetch('http://140.118.121.100:5000/Customer/Cart_list',{
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "S_Customer_Username": "Charlie"
      })
    }).then(response => {
          return response.json()
        }
      )
      .then( (money) =>{
        PriceList(money)
      })

function PriceList(money){
    var photo;
    let output = ``;
    console.log(money)
    money.forEach(function(money){
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
                        <small>Price: $${money.S_Goods_Price}</small>
                        <small>Product ID: ${money.S_Goods_Number}</small>
                        <br>
                        <button type="button" type="click" onclick="delete_cart(this)" name="${money.S_Goods_Number}"><strong>Remove</strong></button>
                    </div>
                </div>

            </td>
            <td>$${money.S_Goods_Price}</td>
        <tr>
        `
        
});
   document.getElementById('output').innerHTML = output;
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
                title: 'success',
                text: number.id+'Remove successfully! ',
                timer: 2000,
              })
              setTimeout(function(){
                window.location.replace('../Shopping_cart/shopping_cart.html');
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