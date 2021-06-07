const Message = require("../models/messageModel");

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

async function getMessage(req, res, id) {
  try {
    const mess = await Message.getById(id);

    if (!mess) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Message not found" }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(mess));
    }
  } catch (error) {
    console.log(error);
  }
}

async function createMessage(req, res) {
  try {
    const body = await getPostData(req);

    const { fromUserID, toUserID, content } = JSON.parse(body);

    
    const message = {
      fromUserID,
      toUserID,
      content,
    };

    const newMessage = await Message.create( message);
    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(newMessage));
  } catch (error) {
    console.log(error);
  }
}

async function updateMessage(req, res, id) {
  try {
    const mess = await Message.getById(id);
    console.log(mess);

    if (!mess) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Message not found" }));
    } else {
    }
    const body = await getPostData(req);
    const { fromUserID, toUserID, content } = JSON.parse(body);

    const messageData = {
      fromUserID: fromUserID || mess.fromUserID,
      toUserID: toUserID || mess.toUserID,
      content: content|| mess.content,
    };


    const updatedMessage = await Message.update(id, messageData);
    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(updatedMessage));
  } catch (error) {
    console.log(error);
  }
}


async function deleteMessage(req, res, id) {
  try {
    const mess = await Message.getById(id);

    if (!mess) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Message not found" }));
    } else {
      await Message.remove(id)
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({message: `Message ${id} removed`}));
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getMessages,
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage
};
