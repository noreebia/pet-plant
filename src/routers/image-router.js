// var multer = require('multer'),
//     upload = multer({ dest: '/images' }),
var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    fs = require('fs');

// var upload = multer({ storage: storage });

// var storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         if (!fs.existsSync('./images')) {
//             fs.mkdir('./images', function (err) {
//                 if (err) {
//                     console.log(err.stack)
//                 } else {
//                     callback(null, './images');
//                 }
//             })
//         }
//     },
//     filename: function (req, file, callback) {
//         callback(null, file.fieldname + '-' + Date.now());
//     }
// });

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './images');
    },
    filename: function (req, file, callback) {
        // callback(null, file.fieldname + '-' + Date.now());
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).array('image', 2);

router.post('/',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

module.exports = router;