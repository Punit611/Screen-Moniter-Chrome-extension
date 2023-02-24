const path = require("path")
const express = require("express");
const { route } = require("express/lib/application");
const req = require("express/lib/request");
const ImageSchema = require("../model/imageSchema")
const multer = require("multer");
const console = require("console");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads') // specify the folder where you want to store the files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)) 
    }
})

const upload = multer({ storage: storage })
const router = express.Router();


router.post('/storeImageData', upload.fields([{ name: 'user_image', maxCount: 1 }, { name: 'screen_image', maxCount: 1 }]),async  (req, res) => {
    try {
      // Extract form data from request body
      const { name, email, test } = req.body;
  
      // Handle user_image file
      const userImageFile = req.files['user_image'][0];
      console.log('Received user image file:', userImageFile);
  
      // Handle screen_image file
      const screenImageFile = req.files['screen_image'][0];
      console.log('Received screen image file:', screenImageFile);
        // const { user_image, screen_image, name, email, test } = req.body;
        const now = new Date();
        data_object = {
                "name":name,
                "email":email,
                "time":now,
                "test":test,
                "screen_image":screenImageFile,
                "user_image":userImageFile,
        }
        const imageschema = await ImageSchema.create(data_object);
        console.log("ImageSchema :-",imageschema);
        res.status(200).send(imageschema);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving images");
    }
});





module.exports = router;