const mysql = require('mysql');

let connection;

exports.connect = (host, user, password, database) => {
    connection = mysql.createConnection(
        {
            host: host,
            user: user,
            password: password,
            database: database
        }
    );
}