const url = "http://localhost:5000/api/auth/login";
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
    password:  event.target.elements.password.value,
  };

  request.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status === 200) {
      localStorage.setItem("email", user.email)
      localStorage.setItem("password", user.password);
      window.location.href = "../ChatsV2/chats.html";
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