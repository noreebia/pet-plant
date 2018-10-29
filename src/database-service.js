const db = require('./db');
let DTO = require('./dto');
const mysql = require('mysql');


exports.getAllUsers = function (callback) {
    pool.query('SELECT * FROM user', (err, rows) => {
        if (err) throw err;
        callback(rows);
    });
};

exports.getUserByEmail = function (userEmail) {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM user WHERE email = \"" + userEmail + "\"";
        pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            resolve(rows);
        })
    })
}

exports.createUser = async function (email, password) {
    let emailAlreadyExists = await isExistingEmail(email);
    console.log(emailAlreadyExists);
    if (emailAlreadyExists) {
        return new DTO(false, "Email exists. Please choose a different email.");
    } else {
        let successfulSave = await saveUser(email, password);
        return new DTO(true);
    }
}

saveUser = function (email, password) {
    return new Promise((resolve, reject) => {
        let query = "INSERT INTO user (id, email, password) VALUES (default , \'" + email + "\',\'" + password + "\')";
        pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            resolve(rows);
        })
    })
}

isExistingEmail = function (username) {
    return new Promise((resolve, reject) => {
        let query = `SELECT EXISTS(SELECT * FROM user WHERE email = '${username}');`;
        pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            let result = rows[0];
            resolve(result[Object.keys(result)[0]]);
        })
    })
}

exports.isValidCredentials = function (email, password) {
    return new Promise((resolve, reject) => {
        let query = `SELECT EXISTS(SELECT * FROM user WHERE email = '${email}' AND password = '${password}');`;
        pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            let result = rows[0];
            isValid = Boolean(result[Object.keys(result)[0]]);
            resolve(new DTO(isValid));
        })
    })
}

exports.registerKakaotalkId = function (email, kakaotalkId) {
    return new Promise((resolve, reject) => {
        let query = `UPDATE user SET kakaotalk_id = '${kakaotalkId}' WHERE email = '${email}';`;
        console.log(query);
        pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            console.log(rows);
            resolve(rows);
        })
    })
}

exports.isRegisteredId = function (kakaotalkId) {
    return new Promise((resolve, reject) => {
        let query = `SELECT count(*) FROM user WHERE email =  (SELECT email FROM user WHERE kakaotalk_id = '${kakaotalkId}' ) AND kakaotalk_id IS NULL;`;
        pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            console.log(rows);
            let result = rows[0];
            resolve(result[Object.keys(result)[0]]);
        })
    })
}

exports.getPlantsOfKakaotalkUser = function (kakaotalkId) {
    return new Promise((resolve, reject) => {
        let query = `SELECT nickname FROM plant WHERE owner_email LIKE (SELECT email FROM user WHERE kakaotalk_id LIKE '${kakaotalkId}');`;
        pool.query(query, (err, rows) => {
            if (err) {
                reject(new DTO(false, err));
            }
            console.log(rows);
            resolve(new DTO(true, rows));
        })
    })
}

exports.registerPlant = (plantId, userEmail, species, nickname) => {
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO plant (id, owner_email, species, nickname)  
        VALUES ( '${plantId}', '${userEmail}', '${species}', '${nickname}'); `;
        pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            resolve(new DTO(true));
        })
    })
}

exports.saveLog = (plantId, illuminationLevel, temperatureLevel, moistureLevel) => {
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO plant_log (plant_id, illumination_level, temperature_level, moisture_level) VALUES
        ('${plantId}', ${illuminationLevel}, ${temperatureLevel}, ${moistureLevel});`;
        pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            resolve(new DTO(true));
        })
    })
}

exports.getPlantsOfUser = (username) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM plant WHERE owner_email like '${username}';`;
        pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            console.log(rows);
            resolve(new DTO(true, rows));
        })
    })
}

getEmailOfKakaotalkUser = (kakaotalkId) => {
    return new Promise((resolve, reject) => {
        console.log("yomski!" + kakaotalkId);

        let query = `SELECT email from user WHERE kakaotalk_id = '${kakaotalkId}';`;
        pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            console.log(rows);
            resolve(rows[0].email);
        })
    })
}

refreshPlantSelectionOf = (email, plantNickname) => {
    return new Promise((resolve, reject) => {
        let query = `UPDATE plant SET selected = 0 WHERE owner_email = '${email}'`;
        pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            resolve(rows);
        })
    })
}

setSelectedPlant = (email, plantNickname) => {
    return new Promise((resolve, reject) => {
        let query = `UPDATE plant SET selected = 1 WHERE owner_email = '${email}' AND nickname = '${plantNickname}'`;
        pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            resolve(rows);
        })
    })
}

exports.selectPlant = async (plantNickname, email) => {
    try{
        // let email = await getEmailOfKakaotalkUser(kakaotalkId);
        let refreshPlantSelectionOf2 = await refreshPlantSelectionOf(email, plantNickname);
        let setSelectedPlant2 = await setSelectedPlant(email, plantNickname);
        return setSelectedPlant2;
    } catch(err){
        console.log(err);
    }
}

exports.getSelectedPlantOfUser = (userEmail) => {
    return new Promise((resolve, reject)=>{
        let query = `SELECT nickname, species FROM plant WHERE owner_email = '${userEmail}' AND selected = 1;`;
        pool.query(query, (err, rows) => {
            if (err) {
                console.log(err);
                reject(new DTO(false, err));
            }
            resolve(new DTO(true, rows));
        })
    })
}
