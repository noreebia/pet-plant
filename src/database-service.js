const db = require('./db');
let DTO = require('./dto');

exports.getAllUsers = function (callback) {
    db.connection.query('SELECT * FROM user', (err, rows) => {
        if (err) throw err;
        callback(rows);
    });
};

exports.getUserByEmail = function (userEmail) {
    return new Promise( (resolve, reject) => {
        let query = "SELECT * FROM user WHERE email = \"" + userEmail + "\"";
        db.connection.query(query, (err, rows) => {
            if (err) {
                reject(new Error("Error querying database"));
            }
            resolve(rows);
        })
    })
}

exports.createUser = async function (email, password) {
    let emailAlreadyExists = await isExistingEmail(email);
    if (emailAlreadyExists) {
        return new DTO(false, "Email exists. Please choose a different email.");
    } else {
        let successfulSave = await saveUser(email, password);
        return new DTO(true);
    }
}

saveUser = function (email, password) {
    return new Promise( (resolve, reject) => {
        let query = "INSERT INTO user (id, email, password) VALUES (default , \'" + email + "\',\'" + password + "\')";
        db.connection.query(query, (err, rows) => {
            if (err) {
                reject(new Error("Error querying database"));
            }
            resolve(rows);
        })
    })
}

isExistingEmail = function (username) {
    return new Promise((resolve, reject) => {
        let query = `SELECT EXISTS(SELECT * FROM user WHERE email = '${username}');`;
        db.connection.query(query, (err, rows) => {
            if (err) {
                reject(new Error("Error querying database"));
            }
            let result = rows[0];
            resolve(result[Object.keys(result)[0]]);
        })
    })
}

exports.isValidCredentials = function (email, password) {
    return new Promise((resolve, reject)=>{
        let query = `SELECT EXISTS(SELECT * FROM user WHERE email = '${email}' AND password = '${password}');`;
        db.connection.query(query, (err, rows) => {
            if (err) {
                reject(new Error("Error querying database"));
            }
            console.log(rows);
            let result = rows[0];
            isValid = Boolean(result[Object.keys(result)[0]]);
            resolve(new DTO(isValid));
        })
    })
}

exports.registerKakaotalkId = function (email, kakaotalkId) {
    return new Promise((resolve, reject)=>{
        let query = `UPDATE user SET kakaotalk_id = '${kakaotalkId}' WHERE email = '${email}';`;
        console.log(query);
        db.connection.query(query, (err, rows) => {
            if (err) {
                reject(new Error("Error querying database"));
            }
            console.log(rows);
            resolve(rows);
        })
    })
}

exports.isRegisteredId = function (kakaotalkId) {
    return new Promise((resolve, reject)=>{
        let query = `SELECT count(*) FROM user WHERE email =  (SELECT email FROM user WHERE kakaotalk_id = '${kakaotalkId}' ) AND kakaotalk_id IS NULL;`;
        db.connection.query(query, (err, rows) => {
            if (err) {
                reject(new Error("Error querying database"));
            }
            console.log(rows);
            resolve(rows);
        })
    })
}

exports.registeredList = function (kakaotalkId) {
    return new Promise((resolve, reject)=>{
        let query = `SELECT id FROM plant WHERE owner_email = (SELECT email FROM user WHERE kakaotalk_id = '${kakaotalkId}' );`;
        db.connection.query(query, (err, rows) => {
            if (err) {
                reject(new Error("Error querying database"));
            }
            console.log(rows);
            resolve(rows);
        })
    })
}