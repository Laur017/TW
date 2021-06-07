const mysql = require("mysql2");

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
    let query = `INSERT INTO users(name, email, password, type) VALUES ("${user.name}", "${user.email}", "${user.password}", ${user.type=="admin"? 1 : 2})`;
    con.query(query, function (err, result, fields) {
      if (err) {
        resolve();
        throw err;
      } else resolve(user);
    });
  });
}

module.exports = {
  login,
  register,
  get,
};
