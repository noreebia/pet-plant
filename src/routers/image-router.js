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
    fileName = req.files[0].filename;
    try{
        fs.mkdirSync('../../image_classification_module/data/test/'+ fileName);
        fs.mkdirSync('../../image_classification_module/data/test/'+ fileName +'/upload');
    }
    catch(e){
        if ( e.code != 'EEXIST' ) throw e;
    }

    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: '',
            args: [fileName]
        };
        PythonShell.run('image_classification_module.py', options, function (err, results){
            if (err) throw err;

            fs.rmdir('../../image_classification_module/data/test/'+ fileName +'/upload', function(err){
                if (err) {
                    return console.error(err);
                }
            });
            fs.rmdir('../../image_classification_module/data/test/'+ fileName, function(err){
                if (err) {
                    return console.error(err);
                }
            });
            console.log('results: %j', results);
        });
    });
});

module.exports = router;