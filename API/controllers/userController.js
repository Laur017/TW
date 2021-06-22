const { getPostData,getBoundary, getMatching } = require("../utils");
const User = require("../models/userModel");
var uuid = require("uuid");
const path = require("path");
const fs = require("fs");

async function login(req, res) {
  try {
    const body = await getPostData(req);
    const { email, password } = JSON.parse(body);

    const user = {
      email,
      password,
    };

    if (!email || !password) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          message: "Email or password missing from the request body",
        })
      );
    }
    const response = await User.login(user);

    if (!response) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User not found" }));
    } else {
      const user2 = await User.get(email);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user2));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

async function register(req, res) {
  try {
    const body = await getPostData(req);
    let user;
    if (body) {
      const { email, password, type } = JSON.parse(body);
      if (!(email && password && type)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({
            message: "Email or password or type missing from the request body",
          })
        );
      }
      user = {
        email,
        password,
        type,
      };
    } else {
      user = {
        email: uuid.v4(),
        password: "",
        type: 2,
      };
    }

    const response = await User.register(user);

    if (!response) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(user.email);
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

async function updateUser(req, res) {
  
  let fileFullPath = "";
  try {
    let result = {};
    let rawData = await getPostData(req);
    let boundary = getBoundary(req);
    const rawDataArray = rawData.split(boundary);
    for (let item of rawDataArray) {
      // Use non-matching groups to exclude part of the result
      let name = getMatching(item, /(?:name=")(.+?)(?:")/);
      if (!name || !(name = name.trim())) continue;
      let value = getMatching(item, /(?:\r\n\r\n)([\S\s]*)(?:\r\n--$)/);
      if (!value) continue;
      let filename = getMatching(item, /(?:filename=")(.*?)(?:")/);
      if (filename && (filename = filename.trim())) {
        // Add the file information in a files array
        let file = {};
        file[name] = value;
        file["filename"] = filename;
        let contentType = getMatching(item, /(?:Content-Type:)(.*?)(?:\r\n)/);
        if (contentType && (contentType = contentType.trim())) {
          file["Content-Type"] = contentType;
        }
        if (!result.files) {
          result.files = [];
        }
        result.files.push(file);
      } else {
        // Key/Value pair
        result[name] = value;
      }
    }



    const userDb = await User.get(result.email);
    if (!userDb) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Email not found" }));
      return;
    }

    if (result.files) {
      fileFullPath = path.resolve("avatars/" + uuid.v4() + ".jpg");
      const stream = fs.createWriteStream(fileFullPath);
      stream.write(result.files[0].avatar, "binary");
      stream.close();
      result.files[0].picture = "bin";
    }


    const data = {
      email: result.email,
      name: result.name,
      avatar: fileFullPath
    }





    const user = await User.update(data);

    if (!user) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Internal server error" }));
    } else {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

async function sendActivationCode(req, res) {
  try {
    const body = await getPostData(req);
    const { email } = JSON.parse(body);
    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "Email missing from the request body" })
      );
    }

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
      res.end(JSON.stringify({ message: "Activation code sent" }));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

async function sendResetCode(req, res) {
  try {
    const body = await getPostData(req);

    const { email } = JSON.parse(body);
    if (!email) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "Email missing from the request body" })
      );
    }

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
      res.end(JSON.stringify({ message: "Reset password code sent" }));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

async function getUser(req, res, id) {
  let user = await User.get(id);
  if (!user) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "User doesn't exist" }));
    return;
  } else {
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user));
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
    if (!(email && code)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          message: "Email or code missing from the request body",
        })
      );
    }

    if (isNaN(code)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Wrong code" }));
    }
    if (type == "reset") response = await User.checkResetCode(email, code);
    else response = await User.checkActivationCode(email, code);

    if (!response) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Wrong code" }));
    } else {
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Correct code" }));
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
  }
}

module.exports = {
  login,
  register,
  sendActivationCode,
  sendResetCode,
  checkActivationCode,
  checkResetCode,
  getUser,
  updateUser
};
