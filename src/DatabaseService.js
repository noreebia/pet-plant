const db = require('./db');

exports.getAllUsers = function(callback) {
    db.connection.query('SELECT * FROM user', function (err, rows) {
        if(err) throw err;
        callback(rows);
    });
};