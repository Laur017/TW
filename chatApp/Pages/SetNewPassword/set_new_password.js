const url = "http://localhost:5000/api/auth/register";
var request = new XMLHttpRequest();

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

    if (password!==confirmPassword)
    document.getElementById("differentPasswords").classList.remove("hidden")
    
    let body = JSON.stringify( {
        "email": localStorage.getItem("email"),
        "password": password,
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
