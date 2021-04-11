//variables
      
      var socket = io();
      socket.autoConnect = false;
      var userID= Math.random() * 1000; console.log(userID);
      userID = userID.toPrecision(3); console.log(userID);
      let username = userID;
      var messages = document.getElementById('tryid');
      var autorUsr;
      var form = document.getElementById('form');
      var input = document.getElementById('amess');
      const chatWind = document.querySelector('.messages');


//functions
   
function MyGetDate(){
  var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
     today= mm + '/' + dd + '/' + yyyy;
     return (today);
        }

function MyGetTime()
{
var today = new Date();
var time = today.getHours() + ":" + today.getMinutes(); // + ":" + today.getSeconds();
return time ;
}

function sendMessage(theMsg,autor)
{
  var item = document.createElement('div');
        item.classList.add("mymessage");
        var textSender = document.createElement('p');
        textSender.classList.add("meta");
        textSender.textContent="USER" + autor ;
        item.appendChild(textSender)
        var MsgDateString = document.createElement('span');
        MsgDateString.textContent =" " + MyGetTime();
        textSender.append(MsgDateString);
        messages.appendChild(item);
        var actualMsg = document.createElement('p');
        item.appendChild(actualMsg);
        actualMsg.textContent = theMsg;
        window.scrollTo(0, Number.MAX_VALUE);
}

function addSidebarUser(username)
{
  var theList = document.getElementById('sidebarList');
  var theRMsg = document.createElement('p');
  var item = document.createElement('li')
  var profilePic = document.createElement('img');
  profilePic.src="ProfilePic.png";
  profilePic.style="display: flex; vertical-align: middle; width: 42px; float: left;  padding-right: 5px;";
  item.textContent = username;
  item.appendChild(profilePic);
  theList.appendChild(item);
  theRMsg.id = "rec-msg";
  theRMsg.textContent="Un mesaj recent";
  item.appendChild(theRMsg);
}

function getMessage(theMsg,autor)
{

  var item = document.createElement('div');
        item.classList.add("hismessage");
        var textSender = document.createElement('p');
        textSender.classList.add("meta");
        textSender.textContent="USER" + autor ;
        item.appendChild(textSender)
        var MsgDateString = document.createElement('span');
        MsgDateString.textContent =" " + MyGetTime();
        textSender.append(MsgDateString);
        messages.appendChild(item);
        var actualMsg = document.createElement('p');
        item.appendChild(actualMsg);
        actualMsg.textContent = theMsg;
}

function onLogin(username)
{
  socket.auth = {username};
  socket.connect();
}



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

//------HTTP events----------------------------------------------------------------
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        onLogin(username);
        if (input.value) {
          socket.emit('chat message', input.value);
          input.value = '';
        }
      });
//-------SOCKET events--------------------------------------------------------------
      socket.on('add user', function(){
          socket.emit('sendUser', username)
          addSidebarUser(username);

      })

      socket.on('chat message', function(msg, autor) {    
        //socket.emit('add user', username);
        autorUsr =autor;
        if(autor ==+ username)
          sendMessage(msg,autor);
          else
          getMessage(msg,autor);
        chatWind.scrollTop = chatWind.scrollHeight;

      });

      socket.on('addUserToList', function(){
        addSidebarUser();
      })



      
