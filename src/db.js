const mysql = require('mysql');

let connection = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
);

connection.connect(function (err) {
    if (!err) {
        console.log("Database connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});

exports.connection = connection;
