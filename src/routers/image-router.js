var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    PythonShell = require('python-shell'),
    fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '../../image_classification_module/data/test/'+ file.originalname +'/upload');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).array('image', 2);

router.post('/',function(req,res){
    fs.mkdirSync('../../image_classification_module/data/test/'+ file.originalname);
    fs.mkdirSync('../../image_classification_module/data/test/'+ file.originalname +'/upload');

    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        console.log(req)
        res.end("File is uploaded");
        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: '',
            args: [str()]
        };
        PythonShell.run('image_classification_module.py', options, function (err, results){
            if (err) throw err;

            console.log('results: %j', results);
        });
    });
});

module.exports = router;