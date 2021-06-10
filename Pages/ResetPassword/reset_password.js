const url_code = "http://localhost:5000/api/auth/resetPasswordCode";
const url = "http://localhost:5000/api/auth/resetPassword";
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

function formSubmit(event) {
  event.preventDefault();
  if (event.submitter.id == "submitEmailButton") {
    let email = event.target.elements.email.value;

    let body = JSON.stringify({
      email: email,
    });

    request.open("POST", url_code);
    request.send(body);

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status == 201) {
        let activationCode = document.getElementById(" code");
        activationCode.classList.remove("hidden");
        document.getElementById("submitEmailButton").classList.add("hidden");
        activationCode.children[0].disabled = false;
        document.getElementById("accountNotExists").classList.add("hidden");
      } else if (this.readyState === 4 && this.status == 404) {
        document.getElementById("accountNotExists").classList.remove("hidden");
        return;
      }
    };
  } else {
    document.getElementById("codeInput").textContent = "";
    let email = event.target.elements.email.value;
    let code = event.target.elements.code.value;

    let body = JSON.stringify({
      email,
      code,
    });

    request.open("POST", url);
    request.send(body);

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status == 201) {
        localStorage.setItem("email", email);
        document.location.href = "../SetNewPassword/set_new_password.html";
      } else if (this.readyState === 4 && this.status == 400) {
        document.getElementById("invalidCode").classList.remove("hidden");
      }
    };

  }
}
