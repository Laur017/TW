const url = "http://localhost:5000/api/auth/login";
var request = new XMLHttpRequest();

function showDropdown() {
  var main = document.getElementById("header");
  if (main.className === "header nav") {
    main.className = "header nav-minimized";
    var navList = document.getElementById("links");
    main.appendChild(navList);
  } else {
    main.className = "header nav";
    var navigation = document.getElementById("navigation");
    var navList = document.getElementById("links");
    navigation.appendChild(navList);
  }
}

function onLogin(event) {
  event.preventDefault();

  let user = {
    email: event.target.elements.email.value,
    password: event.target.elements.password.value,
  };

  request.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status === 201) {
      window.location.href = "../Chat/chat.html";
    } else if (this.readyState === 4 && this.status === 404) {
      if (document.getElementById("not-found") == null) {
        let login = document.getElementsByClassName("login")[0];
        let notFound = document.createElement("div");
        notFound.textContent = " Wrong username/password ";
        notFound.id="not-found"
        login.insertBefore(notFound, document.getElementById("activateButton"));
      }
    }
  });

  request.open("POST", url);
  request.send(JSON.stringify(user));
}
