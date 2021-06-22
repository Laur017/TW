const ws = new WebSocket("ws://localhost:3000");
var sendTo;
var form = document.getElementById('form');
var input = document.getElementById('amess');
var emailInput = document.getElementById("emailTextInput");
emailInput.onclick =() => {console.log(emailInput.value); sendTo = emailInput.value;}
var messages = document.getElementById('tryid');
var usernameReg;

var language = "es";


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
  username:'not set',
  userId:'',
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

  if (themsg.reciever === clientData.userID || themsg.reciever === -23)
  getMessage(themsg.text, themsg.username);
  console.log("test cu id prin mesaj:" + themsg.userId)
  // in plus, cand primesc mesaj, daca nu e, sa-l adaug in bara aia din stanga-----------------------------------------------> TODO
  
    if(!sideBarUsers.some(elem => elem.userId === themsg.userId)){
      addSidebarUser({
        username: themsg.username,
        userId: themsg.userId,
        lastMsg: themsg.text
      })
  }

  
})

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (input.value) {
    let msgObj = JSON.stringify(formatMessage(clientData.username, input.value,clientData.userID, sendTo)) 
    ws.send(msgObj)
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
  textSender.textContent = autor;
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
  textSender.textContent =  autor;
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
  
  removeMessages();

  request.addEventListener("readystatechange", function () {
    var apiResp;
    if (this.readyState == 4) {
      // console.log(request.responseText); 
      apiResp = JSON.parse(request.response);
    }

    apiResp.forEach(element => {
      //console.log("The message: " + element.content);
      if(element.fromUserId != clientData.userID){
        
        sideBarUserObj.userId = element.fromUserId;//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //sideBarUserObj.username =??
        getUsername(element.fromUserId);
        
        
        sideBarUserObj.lastMsg = element.content;
        if(element.fromUserId == someUserId)
        getMessage(element.content, sideBarUserObj.username);
          setTimeout(()=>{
        if(!sideBarUsers.some(elem => elem.userId === element.fromUserId)){
          
            sideBarUsers.push(sideBarUserObj);
          addSidebarUser(sideBarUserObj);
        
          
        }
      },1000)
      }
    });

  })
  request.open("GET", urlMessage1, true);
  request.send();

 

}

function getUsername(Id)
{
  const urlMessage2 = "http://localhost:5000/api/users?id="+Id;
  var request2 = new XMLHttpRequest();
  //var toReturn
  var apiResp2;
  request2.addEventListener("readystatechange", function (){
    
    if (this.readyState == 4) {
       apiResp2 = JSON.parse(request2.response);
       console.log( "user name in getUsrname: " + apiResp2.name); 
      sideBarUserObj.username = apiResp2.name
      console.log("in get user name: " + sideBarUserObj.username);
       
     
    }
  })
  
  request2.open("GET",urlMessage2, true)
  request2.send();

}

function formatMessage(username, text,id, reciever) {
  return {
    username,
    text,
    id,
    reciever
  }
}

function addSidebarUser(user)
{
  var theList = document.getElementById('sidebarList');
  var theRMsg = document.createElement('p');
  var item = document.createElement('li');
  var userParagraph = document.createElement('p');
  userParagraph.id = user.userId;
  userParagraph.textContent = user.username;
  var profilePic = document.createElement('img');
  profilePic.src="../../Assets/ProfilePic.png";
  profilePic.style="display: flex; vertical-align: middle; width: 42px; float: left;  padding-right: 5px;";
  //item.textContent = username;
  item.appendChild(profilePic);
  theList.appendChild(item);
  theRMsg.id = "rec-msg";
  theRMsg.textContent=user.lastMsg;
  item.appendChild(userParagraph);
  item.appendChild(theRMsg);
  item.onclick = ()=>{console.log("am apasat pe " + user.userId); sendTo = user.userId; getPrevMsg(user.userId)}
 /* sideBarUserObj = {
    username: username,
    lastMsg: theRMsg
  }*/

}

function removeMessages()
{
  console.log("in remove msg")
  var childNodes = messages.childNodes;
  for(var i = childNodes.length-1 ; i>=0 ;i--)
  {
    var node = childNodes[i];
    node.parentNode.removeChild(node);
  }
}
