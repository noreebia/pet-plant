var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    pythonShell = require('python-shell'),
    fs = require('fs'),
    path = require('path');

var storage = multer.diskStorage({
    destination: async function (req, file, callback) {
        console.log("file: " + file);

        let dir = './image_classification_module/data/test/'+ file.originalname;

        if (!fs.existsSync(dir)){
            await fs.mkdirSync(dir);
        }

        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).single('image', 2);

router.post('/',function(req,res){

    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        console.log(req.file);
        fileName = req.file.filename;
    
        res.end("File is uploaded");
        var options = {
            mode: 'text',
            pythonPath: '',
            pythonOptions: ['-u'],
            scriptPath: '',
            args: [fileName]
        };
        let reqPath = path.join(__dirname, '../../image_classification_module');
        console.log("dirname:" + reqPath);
        pythonShell.PythonShell.run(reqPath +'/image_classification_module.py', options, function (err, results){
            if (err) {
                console.log("Error running python script: " + err);
                throw err;
            }
            // fs.rmdir('../../image_classification_module/data/test/'+ fileName +'/upload', function(err){
            //     if (err) {
            //         return console.error(err);
            //     }
            // });
            // fs.rmdir('../../image_classification_module/data/test/'+ fileName, function(err){
            //     if (err) {
            //         return console.error(err);
            //     }
            // });
            console.log('results: %j', results);
        });
    });
});

module.exports = router;