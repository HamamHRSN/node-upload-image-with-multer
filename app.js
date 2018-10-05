const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, callback) {
        checkFileType(file, callback);
    }
}).single('myImage');

// Check File Type Function

function checkFileType(file, callback) {
    // Allowed Extension
    const filetypes = /jpeg|jpg|png|gif/;
    // Check Extension 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback('Error: Images Only!');
    }
}

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));



app.get('/', (req, res) => {
    //  console.log('Hello to uploades image app');
    res.render('index');
});

app.post('/upload', (req, res) => {
    // res.send('test');
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            // console.log(req.file);
            // res.send('test');

            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                res.render('index', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                });
            }
        }
    });
});



app.listen(port, () => {
     console.log(`Server started on port: ${port}`);
});