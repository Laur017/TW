const url = "http://localhost:5000/api/auth/register";
var request = new XMLHttpRequest();

const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

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

function submitForm(event){
    event.preventDefault()

    const password = event.target.elements.password.value;
    const confirmPassword =  event.target.elements.confirmPassword.value;

    if (password!==confirmPassword){
    document.getElementById("differentPasswords").classList.remove("hidden")
    return;
    }
    
    let body = JSON.stringify( {
        "email": localStorage.getItem("email"),
        "password": cyrb53(password),
        "type": 2
    })


    request.open("POST", url);
    request.send(body);

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status == 201) {
        document.location.href = "../Login/login.html"
      } else if (this.readyState === 4 && this.status == 400) {
        document.getElementById("serverError").classList.remove("hidden")
        return
      }
    };
}
