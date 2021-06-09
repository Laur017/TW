const socket = require("ws");
const wss = new socket.Server({port: 8882});

const fs = require("fs");
const { stringify } = require("querystring");

var scriptContent ;
var scriptVariables = new Array();
wss.on ("connection", ws =>{
    console.log("Client connected!");
    
        
    ws.on("close", () =>{

        console.log("Client disconnected!");
    })

    ws.on("message", data => {

        if(data == "sendScript")
        {
            changeScript(scriptVariables[0], scriptVariables[1]);
            ws.send(scriptContent);
        }
        
        else{
            console.log(data.toString());
            scriptVariables.push(data.toString());
        }
        
    })
});

function changeScript(oriz,vert)
{
    fs.readFile(__dirname + "\\chatScript.js", function (err, data){

        if(err){
            console.log(err);
        }
        scriptContent = data.toString();
       
        scriptContent = scriptContent.replace("PozOriz", oriz);
        scriptContent = scriptContent.replace("PozOriz", oriz);
        scriptContent = scriptContent.replace("PozVert", vert);
        scriptContent = scriptContent.replace("PozVert", vert);
        scriptContent = scriptContent.replace("VarColor", "green");
        console.log(scriptContent);

    
    });
}