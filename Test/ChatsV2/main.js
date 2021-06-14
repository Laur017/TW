const ws = new WebSocket("ws://localhost:3000");
var form = document.getElementById('form');
var input = document.getElementById('amess');
//var userID= Math.random() * 1000;
//userID = userID.toPrecision(3);
//let username = userID;
var messages = document.getElementById('tryid');
var usernameReg;


var email =  localStorage.getItem("email");

ws.addEventListener("open", () => {
    console.log("We connected!");
    loginMessage();
    getPrevMsg();
    register();
//    console.log(localStorage);
    console.log("THE EMAIL: " + email)


})

ws.addEventListener("message", data =>{
  //console.log(data.data);
    let themsg = JSON.parse(data.data);
    getMessage(themsg.text,themsg.username);
})

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (input.value) {
      let msgObj = JSON.stringify(formatMessage(email,input.value))
      ws.send(msgObj)
      //ws.send(input.value);
      sendMessage(input.value," Me");
      input.value = '';
    }
  });



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
  var request = new XMLHttpRequest();

const urlMessage = "http://localhost:5000/api/messages";

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
        window.scrollTo(0, Number.MAX_VALUE);

        request.onreadystatechange = function()
        {
          if(request.readyState == 4)
          {
            console.log(request.responseText);
          } else if (this.readyState === 4 && this.status === 404) {
          console.log("user not found");
        }
}

        let data = JSON.stringify({
         // id : 232323,
          from : usernameReg,
          to: "ss@ss",
          content: theMsg
        })

        request.open("POST", urlMessage, true);
        request.send(data);

}

function getMessage(theMsg,autor)
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

function register ()
{
  const url = "http://localhost:5000/api/auth/register";
  var request = new XMLHttpRequest();

  request.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status === 201) {
      let resp = request.response
      usernameReg = resp
     console.log(request.responseText)
      // e ok

    } else if (this.readyState === 4 && this.status === 500) {
      //not ok, internal server error
    }
  });

  request.open("POST", url);
  request.send();


}

function getPrevMsg()
{
  const urlMessage1 = "http://localhost:5000/api/messages";
  var request = new XMLHttpRequest();
  

  request.addEventListener("readystatechange", function () {
    var apiResp;
      if(this.readyState == 4 )
      {        
             // console.log(request.responseText); 
            apiResp = JSON.parse( request.response);  
      }

      
    apiResp.forEach(element => {
      //console.log("The message: " + element.content);
      getMessage(element.content,element.fromUserId);
    });
     
  })
   request.open("GET", urlMessage1, true);
    request.send();


  }

  function formatMessage(username, text)
  {
    return{
      username,
      text
    }
  }

  function loginMessage()
  {
     let msgObj = JSON.stringify(formatMessage(email,''));
      ws.send(msgObj)
 
  }
