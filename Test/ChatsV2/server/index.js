const socket = require("ws");
const wss = new socket.Server({port: 3000});
var clientslist = [];


const urlMessage = "http://localhost:5000/api/messages";
var lastMsg;

// get

wss.on ("connection", ws =>{ 
    clientslist.push(ws);
    ws.id = 23;
    console.log("Client connected!" + ws.id);
    
   if(lastMsg)
       setInterval( function(){ checkPopupChatMsg(lastMsg);}, 1000);
       
    ws.on("close", () =>{

        console.log("Client disconnected!");
    })

    ws.on("message", data =>{

        let themsg = JSON.parse(data.toString());

        console.log(themsg.username);
        broadcast(themsg.text);
        lastMsg = themsg.text;
        //console.log("LastMsg: " + lastMsg);
    })


});

function broadcast(data) {
    let msgObj = JSON.stringify(formatMessage("noUserForNow",data))

    wss.clients.forEach(client => client.send(msgObj));
    
  };

  function addUser()
  {
      
  }

  function checkPopupChatMsg(msgToCmp)
{
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
    var request = new XMLHttpRequest();
    var apiResp;
    let size = 0;
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {        
          //  console.log(request.responseText);   
            apiResp = JSON.parse( request.responseText);
            apiResp.forEach(element => {
                //console.log("The message: " + element.content);
                size++;
              });
            //console.log("nr of msg:" + size)
            //console.log("ultimul mesaj: " + apiResp[size-1].content);
            if(apiResp[size-1].content != msgToCmp)
            broadcast(lastMsg);
        }
    }

     request.open("GET", urlMessage, true);
    request.send();
}


  function formatMessage(username, text)
  {
    return{
      username,
      text
    }
  }
