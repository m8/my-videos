var mysql = require("mysql");
var defaults = require("./defaults");

var con = mysql.createConnection({
  host: "localhost",
  user: defaults.db.user,
  password: defaults.db.password,
  database: "myvideos"
});

con.connect();

module.exports = con;

