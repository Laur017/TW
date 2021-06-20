const Message = require("../models/messageModel");
const User = require("../models/userModel");

const { getPostData } = require("../utils");

async function getMessages(req, res) {
  try {
    const messages = await Message.getAll();
    

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(messages));
  } catch (error) {
    console.log(error);
  }
}

async function getUsersMessages(req, res, email) {
  try {
    const user = await User.get(email)


    if (!user) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
    } else {

      const messages = await Message.getUsersMessages(user.id)
      if (!messages){
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Messages not found" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(messages));
    }
  } catch (error) {
    console.log(error);
  }
}

async function getConversation(req, res, email1, email2) {
  try {
    const user1 = await User.get(email1)
    const user2 = await User.get(email2)



    if (!user1 || !user2) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Users not found" }));
    } else {
      const messages = await Message.getConversation(user1.id, user2.id)
      if (!messages){
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Messages not found" }));
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(messages));
    }
  } catch (error) {
    console.log(error);
  }
}

async function createMessage(req, res) {
  try {
    const body = await getPostData(req);

    const { from, to, content } = JSON.parse(body);

    if (!(to && from && content)){
       res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
        JSON.stringify({
          message: "Incomplete request body",
        })
      );
    }

    let fromUserID;
    let toUserID;
    
    if (isNaN(from)){
      const user= await User.get(from);
      fromUserID=user.id;
     } else
      fromUserID = from;
    if (isNaN(to)){
      const user= await User.get(to);
      toUserID=user.id;
     } else
      toUserID = to;

    if (!fromUserID || !toUserID){
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Users not found" }));
    }
    
    const message = {
      fromUserID,
      toUserID,
      content,
    };

    const newMessage = await Message.create( message);
    if (!newMessage){
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Users not found" }));
      
    }
    
    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(newMessage));
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  getMessages,
  getUsersMessages,
  createMessage,
  getConversation
};
