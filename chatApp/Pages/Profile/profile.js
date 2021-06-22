const url = "http://localhost:5000/api/users";
var request = new XMLHttpRequest();

window.onload = function () {
  imgUpload = document.getElementById("imgUpload")
}



function formSubmit(event) {
  event.preventDefault();
    let email = localStorage.getItem("email");
    let name = event.target.elements.name.value;
    
    
    var dataForm = new FormData();
    dataForm.append("name", name);
    dataForm.append("email", email);
    dataForm.append("avatar", imgUpload.files[0], "avatar" )


    request.open("POST", url);
    request.send(dataForm);

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status == 201) {
        document.location.href = "../Chat/chats.html";
      } else if (this.readyState === 4 && (this.status == 400 || this.status == 404 || this.status == 500)) {
        document.getElementById("accountActive").classList.remove("hidden");
        return;
      }
    };

}