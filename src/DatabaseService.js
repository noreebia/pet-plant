const db = require('./db');

exports.getAllUsers = function (callback) {
    db.connection.query('SELECT * FROM user', function (err, rows) {
        if (err) throw err;
        callback(rows);
    });
};

exports.saveUser = function (email, password, callback) {
    let query = "INSERT INTO user (user_id, user_email, user_password) VALUES (default , \'" + email + "\',\'" + password + "\')";
    db.connection.query(query, function (err, rows) {
        if (err) throw err;
        callback(rows);
    });
};