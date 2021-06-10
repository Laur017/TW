const http = require("http");
const {
  getMessages,
  createMessage,
  getForUser, 
  getConversation
} = require("./controllers/messageController");

const {
  login,
  sendActivationCode,
  sendResetCode,
  checkActivationCode,
  checkResetCode,
  register,
  getUser
} = require("./controllers/userController");


const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.url === "/api/auth/login"&& req.method==="POST") {
    login(req, res)
  } else if (req.url === "/api/auth/register" && req.method==="POST") {
    register(req, res)
  } else if (req.url.split("?")[0]==="/api/auth/activateCode" && req.method=="POST" ){
    sendActivationCode(req, res)
  } else if (req.url.split("?")[0]==="/api/auth/resetPasswordCode" && req.method=="POST" ){
    sendResetCode(req, res)
  }else if (req.url.split("?")[0]==="/api/auth/activate" && req.method=="POST"){
    checkActivationCode(req, res)
  } else if (req.url.split("?")[0]==="/api/auth/resetPassword" && req.method=="POST" ){
    checkResetCode(req, res)
  }else if (req.url.split("?")[0]==="/api/users" && req.method=="GET" ){
    const email = req.url.split("?email=")[1];
    getUser(req, res, email)
  }

  else if (req.url === "/api/messages") {
    switch (req.method) {
      case "GET":
        getMessages(req, res);
        break;
      case "POST":
        createMessage(req, res);
        break;
      default:
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Not found" }));

        break;
    }
  } else if (req.url.split("?")[0]==="/api/messages" && req.method=="GET" && req.url.split("&").length == 1) {
    const email = req.url.split("?email=")[1];
    getForUser(req, res, email);

  } else if (req.url.split("?")[0]==="/api/messages" && req.method=="GET" && req.url.split("&").length == 2)
  {
      let email1 = req.url.split("?from=")[1];
      email1=email1.split("&")[0]
      const email2 = req.url.split("&to=")[1];
      getConversation(req, res, email1, email2)
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not found" }));
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
