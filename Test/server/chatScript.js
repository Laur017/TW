window.onload = function () {
  var faScript = document.createElement("link");
  faScript.href =
    "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
  faScript.rel = "stylesheet";
  document.head.appendChild(faScript);

  faScript = document.createElement("link");
  faScript.href =
    "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
  faScript.rel = "stylesheet";
  document.head.appendChild(faScript);

  var openButton = document.createElement("button");
  openButton.addEventListener("click", openForm);
  openButton.className = "open-button";
  openButton.textContent = "Chat";

  var chat = document.createElement("div");
  chat.className = "chat-popup";
  chat.id = "chat-popup";

  var form = document.createElement("form");
  //form.action="./";
  form.className = "form-container";
  form.id = "myForm";

  chat.appendChild(form);


  form.addEventListener("submit", (e) => {
    e.preventDefault();
    var msgToSend = document.getElementById("msgVal");
    sendMessage(msgToSend.textContent);
    getResponse();
  });

  

  var chatHeader = document.createElement("div");
  chatHeader.className = "chatHeader";

  var h1 = document.createElement("h1");
  h1.appendChild(document.createTextNode("Chat"));

  var closeButton = document.createElement("i");
  closeButton.className = "fa fa-times";
  closeButton.addEventListener("click", closeForm);

  var messagesContainer = document.createElement("div");
  messagesContainer.className = "messagesContainer";
  messagesContainer.id = "test";

  var inputContainer = document.createElement("div");
  inputContainer.className = "inputContainer";

  var input = document.createElement("input");
  input.placeholder = "Your message..";
  input.required = true;
  input.id = "msgVal";

  var sendButton = document.createElement("i");
  sendButton.className = "fa fa-paper-plane";

  chatHeader.appendChild(h1);
  chatHeader.appendChild(closeButton);

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);

  form.appendChild(chatHeader);
  form.appendChild(messagesContainer);
  form.appendChild(inputContainer);

  document.body.appendChild(openButton);
  document.body.appendChild(chat);

  var styles = `
        body {font-family: Arial, Helvetica, sans-serif;}
        * {box-sizing: border-box;}

.open-button {
 
  background-color: #555;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  position: fixed;
  PozVert: 23px;
  PozOriz: 28px;
  border-radius: 5px;
  width: 280px;
  border-radius: 5px;

}

.chat-popup {
  width: 300px;
  display: none;
  position: fixed;
  PozVert: 0;
  PozOriz: 15px;
  border: 3px solid #71926c;;
  border-radius: 10px;
  z-index: 9;
}

.form-container {
  max-width: 300px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;

}

.inputContainer {
    display: flex;
    border-radius: 5px;

}

.chatHeader{
    display:flex;
    justify-content: space-between;
}


.inputContainer input {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
  resize: none;
  min-height: 50px;
  border-radius: 5px;

}

.inputContainer input:focus {
  background-color: #ddd;
  outline: none;
}

.fa{
    padding-top: 20px;
    padding-left: 10px;
}

.messagesContainer{
    background-color: #e6e4e1;
    height: 250px;
    overflow-y: scroll;

}

.form-container .cancel {
  background-color: red;
}

#testMsgStyle {
  color: black;
  width: 60%;
  float: left;
  position: relative;
  left: 15px;
padding: 10px;
margin-bottom: 15px;
background-color: VarColor;
border-radius: 5px;
}

#testMsgStyleServer {
  color: white;
  width: 60%;
  float: right;
  position: relative;
  right: 15px;
padding: 10px;
margin-bottom: 15px;
background-color: #71926c;
border-radius: 5px;
}

.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}
`;


  const url = "http://localhost:5000/api/auth/register";
  var request = new XMLHttpRequest();
  
  register() //not ok, ar trebui cand se trimite mesajul

  function register() {
    
    request.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && this.status === 201) {
        let resp = request.response
        localStorage.setItem("name", resp)
        console.log(localStorage.getItem("name"))
        // e ok

      } else if (this.readyState === 4 && this.status === 500) {
        //not ok, internal server error
      }
    });

    request.open("POST", url);
    request.send();

  }

  var styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
};

var username;
var count = 0;

function openForm() {
  console.log("ok");
  document.getElementById("chat-popup").style.display = "block";

  askName();
}

function closeForm() {
  document.getElementById("chat-popup").style.display = "none";
}

function sendMessage(theMsg) {
  var item = document.getElementById("test");
  var inputVal = document.getElementById("msgVal");
  var textBox = document.createElement("div");
  textBox.textContent = inputVal.value;
  textBox.id = "testMsgStyle";
  if (count === 0) username = inputVal;

  item.appendChild(textBox);
  item.scrollTo(0, 10000);

  
  const urlMessage = "http://localhost:5000/api/messages";
  var request = new XMLHttpRequest();

   request.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && this.status === 201) {
        console.log(request.response)
      
        // e ok

      } else if (this.readyState === 4 && this.status === 404) {
        //nu a gasit userul
      }
    });

    let data = JSON.stringify({
      from : localStorage.getItem("name"),
      to: "ss@ss",
      content: theMsg
    })

    request.open("POST", urlMessage);
    request.send(data);



}

function getResponse() {
  var response = "Hello from ChatBot, " + username.value + "!";

  var item = document.getElementById("test");
  var textBox = document.createElement("div");
  textBox.textContent = response;
  textBox.id = "testMsgStyleServer";

  item.appendChild(textBox);
  item.scrollTo(0, 10000);
}

function askName() {
  var response = "Hello from ChatBot! Tell us your name!";

  var item = document.getElementById("test");
  var textBox = document.createElement("div");
  textBox.textContent = response;
  textBox.id = "testMsgStyleServer";

  item.appendChild(textBox);
  item.scrollTo(0, 10000);
}
