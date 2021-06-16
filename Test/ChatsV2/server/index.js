const socket = require("ws");
const wss = new socket.Server({port: 3000});
var clientslist = [];
var chatMicIds = [];

//

const urlMessage = "http://localhost:5000/api/messages";
var lastMsg;

wss.on ("connection", ws =>{ 
   
    console.log(ws.username + " connected!");
    clientslist.push(ws);
  
   if(lastMsg) // client list are doua bucati(vad daca vb intre ei si trimit la toata lumea), sau una(trimit lui)
   //tin cont de usr chat mic si daca mai trimite ceva
       setInterval( function(){ checkPopupChatMsg(ws);}, 1000);
       
    ws.on("close", () =>{

        console.log("Client disconnected!");
    })

    ws.on("message", data =>{

        let themsg = JSON.parse(data.toString());

        console.log("CHECK MY DATA ON MSG: " + themsg.username + ", " + themsg.id + themsg.text);
        ws.id = themsg.id;
        ws.username = themsg.username;
        broadcast(ws.id, ws.username, themsg.text);
        lastMsg = themsg.text;
        console.log("MAYBE IT WORKS " + lastMsg);
    })


});

function broadcast(idnu,userPram,data) {
    let msgObj = JSON.stringify(formatMessage(userPram,data))

    wss.clients.forEach(client => {
        if (client.id != idnu)
            client.send(msgObj)
        
        }
    );
    
    
    
  };

  function addUser(ws)
  {
  }

  function checkPopupChatMsg(ws)
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
              //  console.log("nr of msg:" + size)
              //  console.log("ultimul mesaj: " + apiResp[size-1].content);
            if(!clientslist.some(elem => elem.id === apiResp[size -1].fromUserId))
            {
                console.log("mesajul vine de la: " + apiResp[size -1].fromUserId + "si ar trebui sa-l trimit")
                broadcast(-1, "[CHAT MIC]" +apiResp[size -1].fromUserId,apiResp[size-1].content);
                clientslist.push({id: apiResp[size-1].fromUserId});
            }
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
