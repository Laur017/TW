const mysql = require("mysql2");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
  auth: {
    user: 'rescemail01@gmail.com',
    pass: 'proiectTW'
  }
});

var mailOptions = {
  from: 'RESCEmail01@gmail.com',
  to: '',
  subject: 'Code',
  text: ''
};

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "resc",
});

con.connect((err) => {
  if (err) throw err;
});

function getAll() {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM users`;
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      if (result.length !== 0) {
        resolve(result);
      } else resolve();
    });
  });
}

function get(email) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM users where email = "${email}"`;
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      if (result.length !== 0) {
        resolve(result[0]);
      } else resolve();
    });
  });
}

function login(user) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM users where email = "${user.email}" and password = "${user.password}"`;
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      if (result.length !== 0) {
        resolve("found");
      } else resolve();
    });
  });
}

function register(user) {
  return new Promise((resolve, reject) => {
    let selectQuery = `SELECT * FROM users where email = "${user.email}"`;
    con.query(selectQuery, function (err, result, fields) {
      if (err) {
        resolve();
        throw err;
      } else {
        if (result.length == 0) {
          let query = `INSERT INTO users(email, password, type) VALUES("${user.email}", "${user.password}", ${user.type})`;
          con.query(query, function (err, result, fields) {
            if (err) throw err;
            resolve(user);
          });
        } else {
          let query = `UPDATE users set password = "${user.password}" where email = "${user.email}"`;
          con.query(query, function (err, result, fields) {
            if (err) {
              resolve();
              throw err;
            } else resolve("sent");
          });
        }
      }
    });
  });
}

function sendCode(type,email){
return new Promise((resolve, reject) => {
    var code = Math.floor(1000 + Math.random() * 9000);
    
    mailOptions.to = email;
    mailOptions.text = "Your code is " + code; 

    transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 

    let selectQuery = `SELECT * FROM ${type} where email = "${email}"`;
    con.query(selectQuery, function (err, result, fields) {
      if (err) {
        resolve();
        throw err;
      } else {
        if (result.length == 0) {
          let query = `INSERT INTO ${type}(email, code) VALUES ("${email}", ${code})`;
          con.query(query, function (err, result, fields) {
            if (err) {
              resolve();
              throw err;
            } else resolve("sent");
          });
        } else {
          let query = `UPDATE ${type} set code = ${code} where email = "${email}"`;
          con.query(query, function (err, result, fields) {
            if (err) {
              resolve();
              throw err;
            } else resolve("sent");
          });
        }
      }
    });
  });
}

function sendActivationCode(email) {
  return sendCode("users_codes", email)


}


function sendResetCode(email) {
  return sendCode("users_reset_codes", email)
  
}

function checkActivationCode(email, code) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM users_codes WHERE email = "${email}" and code = ${code}`;
    con.query(query, function (err, result, fields) {
      if (err) throw err;

      if (!result.length) resolve();
      else resolve("ok");
    });
  });
}

function checkResetCode(email, code) {
  
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM users_reset_codes WHERE email = "${email}" and code = ${code}`;
    con.query(query, function (err, result, fields) {
      if (err) throw err;

      if (!result.length) resolve();
      else resolve("ok");
    });
  });
}

module.exports = {
  login,
  get,
  sendActivationCode,
  sendResetCode,
  checkActivationCode,
  checkResetCode,
  register,
};
