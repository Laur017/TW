function showDropdown(){
    var main = document.getElementById("header");
    if (main.className === "header nav"){
        main.className="header nav-minimized";
        var navList= document.getElementById("links");
        main.appendChild(navList);
    } else{
        main.className="header nav";
        var navigation = document.getElementById("navigation");
        var navList= document.getElementById("links");
        navigation.appendChild(navList);
    }
}

function onLogin(){
    // to do : validate
   
    //window.location.assign("file:///D:/facultate%202/SEM4/Web/TW/Pages/Chat/chats.html?");
    //dc nu merge??
}