const http = require("http");
const {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("./controllers/messageController");

const server = http.createServer((req, res) => {
  if (req.url === "/api/auth/login"&& req.method==="POST") {
  } else if (req.url === "/api/auth/register" && req.method==="POST") {
  } else if (req.url === "/api/messages") {
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
  } else if (req.url.match(/\/api\/messages\/([0-9 a-z A-Z]+)/)) {
    const id = req.url.split("/")[3];

    switch (req.method) {
      case "GET":
        getMessage(req, res, id);
        break;
      case "PUT":
        updateMessage(req, res, id);
        break;
      case "DELETE":
        deleteMessage(req, res, id);
        break;
      default:
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Not found" }));

        break;
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Not found" }));
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
