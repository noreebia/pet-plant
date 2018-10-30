var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    PythonShell = require('python-shell'),
    fs = require('fs');

var storage = multer.diskStorage({
    destination: async function (req, file, callback) {
        console.log("file: " + file);

        let dir = './image_classification_module/data/test/'+ file.originalname;

        if (!fs.existsSync(dir)){
            await fs.mkdirSync(dir);
        }

        callback(null, dir);

        // let directory = "";

        // await fs.exists(directory, function(exists) {
        //     let uploadedFileName;
        //     if (exists) {
        //         uploadedFileName = Date.now() + '.' + file.originalname;
        //     } else {
        //         uploadedFileName = file.originalname;
        //     }
        // });

        // callback(null, directory+"/"+uploadedFileName);

        // let a = await fs.mkdirSync('./image_classification_module/data/test/'+"sheeptest" +"/");
        // let b = await fs.mkdirSync('./image_classification_module/data/test/'+ "sheeptest"  +'/upload');
        // callback(null, './image_classification_module/data/test/'+ "sheeptest"  +'/upload');

        // const dir = '../../images/upload';
        // fs.mkdir(dir, err => callback(err, dir));
        // callback(null, './images/upload');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

function checkUploadPath(req, res, next) {
    fs.exists(uploadPath, function(exists) {
       if(exists) {
         next();
       }
       else {
         fs.mkdir(uploadPath, function(err) {
           if(err) {
             console.log('Error in folder creation');
             next(); 
           }  
           next();
         })
       }
    })
}


// var storage = multer.diskStorage(name) {
//     try {
//         // Configuring appropriate storage 
//         var storage = multer.diskStorage({
//             // Absolute path
//             destination: function (req, file, callback) {
//                 callback(null, './uploads/'+name);
//             },
//             // Match the field name in the request body
//             filename: function (req, file, callback) {
//                 callback(null, file.fieldname + '-' + Date.now());
//             }
//         });
//         return storage;
//     } catch (ex) {
//         console.log("Error :\n"+ex);
//     }
// }

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
        PythonShell.run('image_classification_module.py', options, function (err, results){
            if (err) throw err;
            console.log('results: %j', results);
        });
    });
});

module.exports = router;