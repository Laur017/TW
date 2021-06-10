const socket = require("ws");
const wss = new socket.Server({port: 3000});



const urlMessage = "http://localhost:5000/api/messages";

var lastMsg;

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
            console.log(request.responseText);   
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




wss.on ("connection", ws =>{
    console.log("Client connected!");
   setInterval( function(){ checkPopupChatMsg(lastMsg);}, 1000);
    ws.on("close", () =>{

        console.log("Client disconnected!");
    })

    ws.on("message", data =>{
        console.log(data.toString());
        broadcast(data.toString());
        lastMsg = data.toString();
        console.log("LastMsg: " + lastMsg);
    })


});

function broadcast(data) {
    wss.clients.forEach(client => client.send(data));
    
  };