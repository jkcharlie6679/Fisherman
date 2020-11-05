function buy(number)
{
fetch('http://140.118.121.100:5000/Customer/Add/Shop_Cart',{
method: 'POST',
headers: {
    'Accept': 'application/json, text/plain',
    'Content-Type': 'application/json'
},
body: JSON.stringify({
    "S_Customer_Username":window.sessionStorage.getItem("Username"),
    "S_Goods_Number": number.name
})
}).then(response => {
    return response.json()
    })
    .then( (res) =>{
        if(res.S_Cart_Add_Status==0){
            Swal.fire({
                icon: 'success',
                title: 'Add success!',
                text: number.id+' is add to your cart',
                timer: 2000,
              })
              setTimeout(function(){
                window.location.replace('../Purchase/Purchase.html');
              },2000);
        }
        else if(res.S_Cart_Add_Status==1){
            Swal.fire({
                icon: 'error',
                title: 'Add fail!',
                text: number.id+' is already in your cart',
              })
        }
      })
}
function add_cart(number)
{
fetch('http://140.118.121.100:5000/Customer/Add/Shop_Cart',{
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
    return response.json()
    })
    .then( (res) =>{
        if(res.S_Cart_Add_Status==0){
            Swal.fire({
                icon: 'success',
                title: 'Add success!',
                text: number.id+' is add to your cart',
                timer: 2000,
              })
              setTimeout(function(){
                window.location.replace('../Shopping-Page2/Shopping-Page2.html');
              },2000);
        }
        else if(res.S_Cart_Add_Status==1){
            Swal.fire({
                icon: 'error',
                title: 'Add fail!',
                text: number.id+' is already in your cart',
              })
        }
      })
}
if (window.sessionStorage.getItem("Username")==null) {
window.location.replace("../../login/login.html")
}
else{
document.getElementById("Username").innerHTML= window.sessionStorage.getItem("Username");
}
console.log(window.sessionStorage.getItem("fish_detail"))
fetch('http://140.118.121.100:5000/Customer/Goods_detail',{
method: 'POST',
headers: {
    'Accept': 'application/json, text/plain',
    'Content-Type': 'application/json'
},
body: JSON.stringify({
    "S_Goods_Number":window.sessionStorage.getItem("fish_detail")
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
        <div class="fish-detail">
        <a href="../Shopping-Page2/Shopping-Page2.html" class="return"><img class="back_img" src="../../images/back.png"></a>
            <img  class="fish-detail-img" src="${photo}">
            <p class="fish-name"><strong>${money.S_Fish_Name}</strong></p>
            <p class="fish-price"><strong>$${money.S_Goods_Price}</strong></p>
            
            <p class="fishing-location"><strong>Location</strong>
                <div class="fishong-location-box">${money.S_Fish_Location_Y}, ${money.S_Fish_Location_X}</div>
            </p>
            <p class="fishing-weight"><strong>Weight</strong>
                <div class="fishong-weight-box">${money.S_Fish_Weight} kg</div>
            </p>
            <p class="fishing-waterdeep"><strong>Depth</strong>
                <div class="fishong-waterdeep-box">${money.S_Fish_Depth} m</div>
            </p>
            <p class="fishing-temperature"><strong>Temperature</strong>
                <div class="fishong-temperature-box">${money.S_Fish_Temperature}°C</div>
            </p>
            <p class="fishing-ship"><strong>Length</strong>
                <div class="fishong-ship-box">${money.S_Fish_Length} m</div>
            </p>
            <p class="fishing-port"><strong>Capture Time</strong>
                <div class="fishong-port-box">${new Date(money.S_Fish_Datetime).Format("yyyy-MM-dd hh:mm:ss")}</div>
            </p>
            <p class="fishing-hash"><strong>Hash code</strong>
                <div class="fishong-hash-box" style="word-wrap:break-all;">${money.S_Fish_Hash_Code}</div>
            </p>
            <button type="button" id = "purchase" type="click" onclick="buy(this)" name="${money.S_Goods_Number}"><strong>Purchase</strong></button>
                <button type="button" id = "purchase-car" type="click" onclick="add_cart(this)" name="${money.S_Goods_Number}"><strong>Add to cart</strong></button>
        </div>
        `    
;
document.getElementById('output').innerHTML = output;
}

const Logout = document.getElementById('Logout');
Logout.addEventListener('click', function change(){
    window.sessionStorage.clear();
    window.location.replace("../../Shopping-Page/Shopping.html");
})



  Date.prototype.Format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

