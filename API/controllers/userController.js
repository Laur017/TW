const { getPostData } = require("../utils");
const User = require("../models/userModel");

async function login(req, res) {
  try {
    const body = await getPostData(req);
    const { email, password } = JSON.parse(body);

    const user = {
      email,
      password,
    };

    const response = await User.login(user);

    if (!response) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
    } else {
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end("logged in");
    }
  } catch (error) {
    console.log(error);
  }
}

async function register(req, res) {
  try {
    const body = await getPostData(req);
    const { email, password, type } = JSON.parse(body);

    const user = {
      email,
      password,
      type,
    };

    const response = await User.register(user);

    if (!response) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
    } else {
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end("logged in");
    }
  } catch (error) {
    console.log(error);
  }
}

async function sendActivationCode(req, res) {
  try {
    const body = await getPostData(req);
    const { email } = JSON.parse(body);

    let existingUser = await User.get(email);

    if (existingUser) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User already exists" }));
      return;
    }

    const response = await User.sendActivationCode(email);

    if (!response) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end("Code sent");
    }
  } catch (error) {
    console.log(error);
  }
}

async function sendResetCode(req, res) {
  try {
    const body = await getPostData(req);
    const { email } = JSON.parse(body);

    let existingUser = await User.get(email);

    if (!existingUser) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User doesn't exist" }));
      return;
    }

    const response = await User.sendResetCode(email);

    if (!response) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end("Code sent");
    }
  } catch (error) {
    console.log(error);
  }
}

async function checkActivationCode(req, res) {
  checkCode(req, res, "activation");
}

async function checkResetCode(req, res) {
  checkCode(req, res, "reset");
}

async function checkCode(req, res, type) {
  try {
    const body = await getPostData(req);
    const { email, code } = JSON.parse(body);

    if (isNaN(code)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Wrong code" }));
      return;
    }
    let response;
    if (type == "reset") response = await User.checkResetCode(email, code);
    else response = await User.checkActivationCode(email, code);

    if (!response) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Wrong code" }));
    } else {
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end("Activated");
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  login,
  register,
  sendActivationCode,
  sendResetCode,
  checkActivationCode,
  checkResetCode
};
