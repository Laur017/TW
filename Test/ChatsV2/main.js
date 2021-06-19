const ws = new WebSocket("ws://localhost:3000");
var sendTo;
var form = document.getElementById('form');
var input = document.getElementById('amess');
var emailInput = document.getElementById("emailTextInput");
emailInput.onclick =() => {console.log(emailInput.value); sendTo = emailInput.value;}
var messages = document.getElementById('tryid');
var usernameReg;


var email = localStorage.getItem("email");
var password = localStorage.getItem("password")

var clientData={
  username : '',
  email: email,
  password: password,
  userID: -1
}

let sideBarUsers = [];
sideBarUserObj = {
  username:'',
  lastMsg:''
}


ws.addEventListener("open", () => {
  console.log("We connected!");
 
  login();
  getPrevMsg();
  //console.log("USERNAME: "+clientData.username +"ID: "+ clientData.userID + "MAIL: " + clientData.email )
 
})

ws.addEventListener("message", data => {
  let themsg = JSON.parse(data.data);
  //if themsg.reciever = eu
  getMessage(themsg.text, themsg.username);
  
})

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (input.value) {
    let msgObj = JSON.stringify(formatMessage(clientData.username, input.value,clientData.userID)) // + id ul aluia 
   // console.log("ClientData Test: " + clientData.username + clientData.userID)
    ws.send(msgObj)
    //ws.send(input.value);
    sendMessage(input.value, " Me");
    input.value = '';
  }

  console.log("DESTINATAR SETAT" + sendTo);

});



//functions

function MyGetDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  return (today);
}

function MyGetTime() {
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes(); // + ":" + today.getSeconds();
  return time;
}

function sendMessage(theMsg, autor) {
  var request = new XMLHttpRequest();

  const urlMessage = "http://localhost:5000/api/messages";

  var item = document.createElement('div');
  item.classList.add("hismessage");
  var textSender = document.createElement('p');
  textSender.classList.add("meta");
  textSender.textContent = "USER" + autor;
  item.appendChild(textSender)
  var MsgDateString = document.createElement('span');
  MsgDateString.textContent = " " + MyGetTime();
  textSender.append(MsgDateString);
  messages.appendChild(item);
  var actualMsg = document.createElement('p');
  item.appendChild(actualMsg);
  actualMsg.textContent = theMsg;
  window.scrollTo(0, Number.MAX_VALUE);

  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      console.log(request.responseText);
    } else if (this.readyState === 4 && this.status === 404) {
      console.log("user not found");
    }
  }

  let data = JSON.stringify({
    
    from: clientData.email,
    to: sendTo,
    content: theMsg
  })

  request.open("POST", urlMessage, true);
  request.send(data);

}

function getMessage(theMsg, autor) {

  var item = document.createElement('div');
  item.classList.add("mymessage");
  var textSender = document.createElement('p');
  textSender.classList.add("meta");
  textSender.textContent = "USER" + autor;
  item.appendChild(textSender)
  var MsgDateString = document.createElement('span');
  MsgDateString.textContent = " " + MyGetTime();
  textSender.append(MsgDateString);
  messages.appendChild(item);
  var actualMsg = document.createElement('p');
  item.appendChild(actualMsg);
  actualMsg.textContent = theMsg;
  window.scrollTo(0, Number.MAX_VALUE);

}

function login() {
  const url = "http://localhost:5000/api/auth/login";
  var request = new XMLHttpRequest();
  let msg = {
    email: email,
    password: password
  }

  request.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status === 200) {
      let resp = request.response
      usernameReg = JSON.parse(resp).name;
      clientData.userID = JSON.parse(resp).id;
      clientData.username = JSON.parse(resp).name;
     // console.log("Just got  the user id" + clientData.userID)
      // e ok

    } else if (this.readyState === 4 && this.status === 500) {
      //not ok, internal server error
    }
  });
  //loginMessage();

  request.open("POST", url);
  request.send(JSON.stringify(msg));

return 0;
}

function getPrevMsg(someUserId) { // + data din bd 
  
  const urlMessage1 = "http://localhost:5000/api/messages?email="+email;
  var request = new XMLHttpRequest();


  request.addEventListener("readystatechange", function () {
    var apiResp;
    if (this.readyState == 4) {
      // console.log(request.responseText); 
      apiResp = JSON.parse(request.response);
    }


    apiResp.forEach(element => {
      //console.log("The message: " + element.content);
      if(element.fromUserId != clientData.userID){
        
        sideBarUserObj.username = element.fromUserId;
        sideBarUserObj.lastMsg = element.content;
        if(element.fromUserId == someUserId)
          getMessage(element.content, element.fromUserId);

        if(!sideBarUsers.some(elem => elem.username === element.fromUserId)){
          sideBarUsers.push(sideBarUserObj);
          addSidebarUser(sideBarUserObj);
        }

      }

    });

  })
  request.open("GET", urlMessage1, true);
  request.send();


}

function formatMessage(username, text,id) {
  return {
    username,
    text,
    id
  }
}

function addSidebarUser(user)
{
  var theList = document.getElementById('sidebarList');
  var theRMsg = document.createElement('p');
  var item = document.createElement('li');
  var userParagraph = document.createElement('p');
  userParagraph.id = user.username;
  userParagraph.textContent = user.username;
  var profilePic = document.createElement('img');
  profilePic.src="ProfilePic.png";
  profilePic.style="display: flex; vertical-align: middle; width: 42px; float: left;  padding-right: 5px;";
  //item.textContent = username;
  item.appendChild(profilePic);
  theList.appendChild(item);
  theRMsg.id = "rec-msg";
  theRMsg.textContent=user.lastMsg;
  item.appendChild(userParagraph);
  item.appendChild(theRMsg);
  item.onclick = ()=>{console.log("am apasat pe " + user.username); sendTo = user.username; getPrevMsg(user.username)}
 /* sideBarUserObj = {
    username: username,
    lastMsg: theRMsg
  }*/

}
