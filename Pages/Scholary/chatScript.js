
window.onload = function() {

        var faScript = document.createElement('link');
        faScript.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" ;
        faScript.rel="stylesheet";
        document.head.appendChild(faScript);

        faScript=document.createElement('link');
        faScript.href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";
        faScript.rel="stylesheet";
        document.head.appendChild(faScript);


        var openButton=document.createElement("button");
        openButton.addEventListener("click", openForm);
        openButton.className="open-button";
        openButton.textContent="Chat";

        var chat = document.createElement("div");
        chat.className="chat-popup";
        chat.id="chat-popup";
        
        var form = document.createElement("form");
        form.action="./";
        form.className="form-container";
        form.id="myForm"
        
        chat.appendChild(form);

        var chatHeader = document.createElement("div");
        chatHeader.className="chatHeader";
        


        var h1=document.createElement("h1");
        h1.appendChild(document.createTextNode("Chat"));

        var closeButton = document.createElement("i");
        closeButton.className="fa fa-times";
        closeButton.addEventListener("click", closeForm);



        var messagesContainer = document.createElement("div");
        messagesContainer.className="messagesContainer";

        
        var inputContainer = document.createElement("div");
        inputContainer.className="inputContainer";
        
        var input=document.createElement("input");
        input.placeholder="Your message..";
        input.required=true;

        var sendButton = document.createElement("i");
        sendButton.className="fa fa-paper-plane";
        
        
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
  bottom: 23px;
  right: 28px;
  width: 280px;
}

.chat-popup {
  width: 300px;
  display: none;
  position: fixed;
  bottom: 0;
  right: 15px;
  border: 3px solid #f1f1f1;
  z-index: 9;
}

.form-container {
  max-width: 300px;
  padding: 10px;
  background-color: white;
}

.inputContainer {
    display: flex;
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
}

.form-container .cancel {
  background-color: red;
}

.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}
`;

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)
}

function openForm() {
    console.log("ok");
  document.getElementById("chat-popup").style.display = "block";
}

function closeForm() {
  document.getElementById("chat-popup").style.display = "none";
} 
