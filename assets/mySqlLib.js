const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "database_weekly4",
});

connection.connect();

module.exports = connection;