const db = require('./db');

exports.getAllUsers = function (callback) {
    db.connection.query('SELECT * FROM user', function (err, rows) {
        if (err) throw err;
        callback(rows);
    });
};

exports.getUserByEmail = function (userEmail, callback) {
    let query = "SELECT * FROM user WHERE user_email = \"" + userEmail + "\"";
    db.connection.query(query, function (err, rows) {
        if (err) {
            throw err
        }
        callback(rows)
    })
}

exports.getUserByEmailPromiseTest = function (userEmail) {
    return new Promise(function (resolve, reject) {
        let query = "SELECT * FROM user WHERE user_email = \"" + userEmail + "\"";
        db.connection.query(query, function (err, rows) {
            if (err) {
                reject(new Error("Error querying database"));
            }
            resolve(rows);
        })
    })
}

exports.saveUser = function (email, password, callback) {
    let query = "INSERT INTO user (user_id, user_email, user_password) VALUES (default , \'" + email + "\',\'" + password + "\')";
    db.connection.query(query, function (err, rows) {
        if (err) throw err;
        callback(rows);
    });
};