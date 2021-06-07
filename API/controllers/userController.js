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
    const { name, email, password, type } = JSON.parse(body);

    let existingUser = await User.get(email);

    if (existingUser){
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "User already exists" }));
        return
    }


    const user = {
      name,
      email,
      password,
      type
    };


    const response = await User.register(user);

    if (!response) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end("Account created");
    }
  } catch (error) {
    console.log(error);
  }
}


module.exports={
    login,
    register
}