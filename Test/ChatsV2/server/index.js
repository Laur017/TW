const socket = require("ws");
const wss = new socket.Server({port: 3000});
var clientslist = [];
var popUpClientsList = [];
var oldUsrList = [];


const urlMessage = "http://localhost:5000/api/messages";
var lastMsg;


wss.on ("connection", ws =>{ 
   
    console.log(ws.username + " connected!");

    clientslist.push(ws);
  
getUsersList();
    // client list are doua bucati(vad daca vb intre ei si trimit la toata lumea), sau una(trimit lui)
   //tin cont de usr chat mic si daca mai trimite ceva
       setInterval( function(){ checkPopupChatMsg();}, 1000);
       
    ws.on("close", () =>{

        console.log("Client disconnected!");
    })

    ws.on("message", data =>{

        let themsg = JSON.parse(data.toString());

        console.log("CHECK MY DATA ON MSG: " + themsg.username + ", " + themsg.id + themsg.text + themsg.reciever);
        ws.id = themsg.id;
        ws.username = themsg.username;
        broadcast(ws.id, ws.username, themsg.text, themsg.reciever);
        lastMsg = themsg.text;
        //console.log("MAYBE IT WORKS " + lastMsg);
    })


});

function broadcast(idnu,userPram,data,reciever) {
    let msgObj = JSON.stringify(formatMessage(userPram,data,reciever))

    wss.clients.forEach(client => {
        if (client.id != idnu)
            client.send(msgObj)
        
        }
    );
    
    
    
  };


  function checkPopupChatMsg()
{
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
    var request = new XMLHttpRequest();
    var apiResp;
    let size = 0;
    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
            apiResp = JSON.parse( request.responseText);
            apiResp.forEach(element => {
                
                size++;
              });
              //  console.log("nr of msg:" + size)
              //  console.log("ultimul mesaj: " + apiResp[size-1].content);
            if(!popUpClientsList.some(elem => elem.id === apiResp[size -1].fromUserId)){ // daca nu e din chatul mic(salvat)
                //oldclients
                if(!oldUsrList.some(elem => elem.id === apiResp[size -1].fromUserId ))
                    if(!clientslist.some(elem => elem.id === apiResp[size -1].fromUserId)) // si nu e de pe chatul mare
                    {
                        console.log("mesajul vine de la: " + apiResp[size -1].fromUserId + "si ar trebui sa-l trimit")
                        //broadcast(-1, "[CHAT MIC]" +apiResp[size -1].fromUserId,apiResp[size-1].content,-23);
                        popUpClientsList.push({id: apiResp[size-1].fromUserId, msgId: apiResp[size-1].id, clientName: apiResp[size-1].content});
                    }
            }else{
             if(!popUpClientsList.some(elem => elem.msgId === apiResp[size -1].id))
             {
                 objWithName = popUpClientsList.find(elem => elem.id === apiResp[size-1].fromUserId)
                console.log("mesajul vine de la: " + apiResp[size -1].fromUserId + "si ar trebui sa-l trimit")
                broadcast(-1, "[CHAT MIC]: " +apiResp[size -1].fromUserId + objWithName.clientName,apiResp[size-1].content,-23);
                popUpClientsList.push({id: apiResp[size-1].fromUserId, msgId: apiResp[size-1].id});
                
             }
             popUpClientsList.forEach(element => console.log("POPUPCLIENT: " + element.id))
            }
            
        }
    }

     request.open("GET", urlMessage, true);
    request.send();
}

function getUsersList()
{
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest; 
    var request = new XMLHttpRequest();
    var apiResp;

    request.onreadystatechange = function()
    {
        if(request.readyState == 4)
        {
          
          //  console.log(request.responseText);   
            apiResp = JSON.parse( request.responseText);
            apiResp.forEach(element => {

                if(!oldUsrList.some(elem => elem.id === element.fromUserId)){

                    oldUsrList.push({id : element.fromUserId});
                    //console.log( "unul dintre id uri: " + element.fromUserId)
                
                }

                if(!oldUsrList.some(elem => elem.id === element.toUserId)){

                    oldUsrList.push({id : element.toUserId});
                    //console.log( "unul dintre id uri: " + element.fromUserId)
                
                }

              });
            
        }
        //oldUsrList.forEach(element => console.log("OldList: " + element.id))
    }
    request.open("GET", urlMessage, true);
    request.send();

}

  function formatMessage(username, text, reciever)
  {
    return{
      username,
      text,
      reciever
    }
  }
