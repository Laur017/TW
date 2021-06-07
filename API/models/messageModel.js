const { v4: uuidv4 } = require("uuid");
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

function getById(id) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM messages where id = "${id}" `;
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      resolve(result[0]);
    });
  });
}

function create(message) {
  return new Promise((resolve, reject) => {
    let id = uuidv4();
    let query = `INSERT INTO messages values( '${id}', '${
      message.fromUserID
    }', '${message.toUserID}', '${message.content}')`;
    let newMessage = {'id': id, ...message};
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      resolve(newMessage);
    });
  });
}

function update(id, message) {
  return new Promise(async (resolve, reject) => {
    
    let query = `UPDATE messages set fromUserID = '${message.fromUserID}',
                                     toUserID = '${message.toUserID}',
                                     content = '${message.content}'
                                     where id ='${id}'`;

    
    con.query(query, function (err, result, fields) {
      if (err) throw err;
      dbMessage = getById(id);
      resolve(dbMessage);
    });
                                     
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
     let query = `DELETE FROM messages where id = "${id}" `;
     con.query(query, function (err, result, fields) {
      if (err) throw err;
      resolve();
    });
  });
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
