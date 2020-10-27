fetch('http://140.118.121.100:5000/Customer/Trade_list',{
method: 'POST',
headers: {
    'Accept': 'application/json, text/plain',
    'Content-Type': 'application/json'
},
body: JSON.stringify({
    "S_Customer_Username":window.sessionStorage.getItem("Username")
})
}).then(response => {
    return response.json()
    }
)
.then( (money) =>{
    PriceList(money)
})
function PriceList(money){
    let output = ``;
    console.log(money)
    money.forEach(function(money){
        output+= `
        <tr>
            <td>${money.S_Trade_Number}</td>
            <td>${money.S_Goods_Number} </td>
            <td>${money.S_Trade_Address}</td>
            <td>魚貨運送中</td>
            <td>$${money.I_Goods_Total}</td>
        </tr>
        `    
});
document.getElementById('output').innerHTML = output;
}