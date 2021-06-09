
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "resc",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

function getAll() {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM messages", function (err, result, fields) {
      
      if (err) throw err;
      resolve(result);
    });
  });
}

function getForUser(id) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM messages where fromUserID=${id} or toUserID= ${id} `;
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      resolve(result);
    });
  });
}

function getConversation(id1, id2) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM messages where (fromUserID=${id1} AND toUserID=${id2}) or (fromUserID=${id2} AND toUserID= ${id1})`;
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      resolve(result);
    });
  });
}


function create(message) {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO messages (fromUserID, toUserID, content) values(${
      message.fromUserID
    }, ${message.toUserID}, '${message.content}')`;
    
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      resolve(message);
    });
  });
}


module.exports = {
  getAll,
  getForUser,
  create,
  getConversation
};
