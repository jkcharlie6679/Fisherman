const shop = document.getElementById('shop');
shop.addEventListener('click', function change(){
    if(window.sessionStorage.getItem("Username") != null){
        window.location.replace("After-Login/Shopping-Page2/Shopping-Page2.html")
    }
    else{
        window.location.replace("Shopping-Page/Shopping.html")
    }
})