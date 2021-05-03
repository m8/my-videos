var mysql = require("mysql");
var defaults = require("./defaults");

var con = mysql.createConnection({
  host: "localhost",
  user: defaults.db.user,
  password: defaults.db.password,
  database: "myvideos",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

con.connect();

module.exports = con;

