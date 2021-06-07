var express = require('express');
//function handler "app" to supply to the http server
const app = require('express')(); //function handler to supply to the http server
const http = require('http').Server(app);
//pass the http obj to an instance of socket.io
const io = require('socket.io')(http);
//set the port
const port = process.env.PORT || 3000;
let users = []; //will be on a diff file

app.use(express.static('public'));

io.on('connection', (socket) => {

  socket.emit('add user')
    socket.on('sendUser', (username)=>{
        socket.username= username;
      
    // we store the username in the socket session for this client
    
    socket.username = username;
    users.push(username);
  });

  socket.on('chat message', (msg, autor) => {
    autor = socket.username;
    io.emit('chat message', msg ,autor);
    
    console.log(msg);
  });

});



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});


