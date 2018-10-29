var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './images/upload');
    },
    filename: function (req, file, callback) {
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