function onSubmit(){
    // validate form
}

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