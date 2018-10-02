class DatabaseService {

    constructor(connection) {
        this.connection = connection;
    }

    getAllUsers(callback) {
        this.connection.query('SELECT * FROM user', function (err, rows) {
            if(err) throw err;
            callback(rows);
        });
    }
}

module.exports = DatabaseService;