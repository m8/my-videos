var mysql = require("mysql2/promise");
var defaults = require("./defaults");
var queries = require('./query');

connectionConfig = {
    host: "localhost",
    user: defaults.db.user,
    password: defaults.db.password,
    "database": "myvideos",
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
};

var connectionPool = mysql.createPool(connectionConfig)

/* con.connect(async function (err) {
    if (err) throw err;
    console.log("Connected!");

    await con.query(queries.create_db, function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });

    await con.changeUser({
        database: "myvideos"
    });
    // await con.query(queries.use_db, function (err, result) {
    //     if (err) throw err;
    // });

    await con.query(queries.create_user
        , function (err, result) {
            if (err) throw err;
            console.log("user table created");
        });

    await con.query(queries.create_video
        , function (err, result) {
            if (err) throw err;
            console.log("video table created");
        });

    await con.query(queries.create_category
        , function (err, result) {
            if (err) throw err;
            console.log("category table created");
        });

    await con.query(queries.create_user_has_video
        , function (err, result) {
            if (err) throw err;
            console.log("create_user_has_video table created");
        });

    await con.query(queries.create_channel
        , function (err, result) {
            if (err) throw err;
            console.log("channel table created");
        });

    await con.query(queries.create_user_follows_channel
        , function (err, result) {
            if (err) throw err;
            console.log("user_follows_channel table created");
        });

    await con.query(queries.create_category_has_channel
        , function (err, result) {
            if (err) throw err;
            console.log("category_has_channel table created");
        });

    await con.query(queries.create_category_has_video
        , function (err, result) {
            if (err) throw err;
            console.log("category_has_video table created");
        });

}); */


module.exports = connectionPool;