var express = require('express');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
    console.log(msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});


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