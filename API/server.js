const http = require("http");
const {
  getMessages,
  createMessage,
  getUsersMessages,
  getConversation,
} = require("./controllers/messageController");

const {
  login,
  sendActivationCode,
  sendResetCode,
  checkActivationCode,
  checkResetCode,
  register,
  getUser,
} = require("./controllers/userController");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.url.startsWith("/api/auth/") && req.method === "POST") {
    //AUTH
    let route = req.url.split("/api/auth/")[1];
    if (route === "login") login(req, res);
    else if (route === "register") register(req, res);
    else {
      let route = route.split("?")[0];
      if (route === "activateCode") sendActivationCode(req, res);
      else if (route === "resetPasswordCode") sendResetCode(req, res);
      else if (route === "activate") checkActivationCode(req, res);
      else if (route === "resetPassword") checkResetCode(req, res);
      else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Not found" }));
      }
    }
  } else if (req.url.split("?")[0] === "/api/users" && req.method == "GET" && req.url.split("?email=").length==2) {
    //USERS
    const email = req.url.split("?email=")[1];
    getUser(req, res, email);
  } else {
    //MESSAGES

    if (req.url === "/api/messages") {
      switch (req.method) {
        case "GET":
          getMessages(req, res);
          break;
        case "POST":
          createMessage(req, res);
          break;
        /*  case "PUT": idk if needed, maybe to mark messages as read
        updateMessage(req, res);
        break; */
        default:
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Not found" }));
          break;
      }
    } else if (
      req.url.split("?")[0] === "/api/messages" &&
      req.method === "GET"
    ) {
      if (req.url.split("&").length == 1) {
        const email = req.url.split("?email=")[1];
        getUsersMessages(req, res, email);
      } else if (req.url.split("&").length == 2) {
        let email1 = req.url.split("?from=")[1];
        email1 = email1.split("&")[0];
        const email2 = req.url.split("&to=")[1];
        getConversation(req, res, email1, email2);
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Not found" }));
    }
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
