const port = process.env.PORT || 3001;
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const fs = require('fs');

  
//set storage engine
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads');
        console.log("Inside Destination");
      },
      filename: (req, file, cb) => {
        //const newFilename = `image_`+Date.now()+`${(path.extname(file.originalname))}`;
        const newFilename = file.originalname;
        console.log("FileName : "+newFilename);
        cb(null, newFilename);
        
      },
    });
  
    //Init Upload for multiple images
    const upload = multer({ storage : storage }).array('selectedFile',5);

    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      next();
    });

    app.post('/',upload, (req, res,next)=>{
      console.log("Inside UploadFiles");
      console.log("uploadFiles : ",req.files);
    });

    app.post('/download',(req, res) => {
      console.log("Inside download file");
    //get file name required from DB
    var file=["android_mountains-3840x2160.jpg","beach_4k-3840x2160.jpg"];
    var base64img = [];
      file.forEach(element=>{
        var fileLocation = path.join(__dirname + '/uploads',element);
        var img = fs.readFileSync(fileLocation);
        base64img.push(new Buffer(img).toString('base64'));
      })
    res.writeHead(200, {'Content-Type': 'image/jpg' });
     res.end(JSON.stringify(base64img));
     console.log("Download Completed, response sent");    
    });

    app.listen(port, () => console.log(`Server listening on port ${port}`));