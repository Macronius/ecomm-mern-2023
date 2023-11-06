// built-in node modules
import path from "path";
// server
import express from "express";
// npm extension
import multer from "multer";

const router = express.Router();

// define storage on the disk/server
const storage = multer.diskStorage({
    // destination function - describes where we want to save this
    destination(req, file, cb) {
        cb(null, 'uploads/');
        // NOTE - parameters: first position is error and there are no errors, second is root folder
    },
    // filename function - describe how to format the file names
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
        // NOTE: will have validation to ensure only image files
    },
});

// check file types for only images
function checkFileType(file, cb) {
    // NOTE: the following file.properties are available on 'file'
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //
    const mimetype = filetypes.test(file.mimetype);
    //
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb("Image files only");
    }
}

// upload
const upload = multer({
    storage
});

// create the actual route, only allow a single file, middleware > upload.single('image') note: 'image' is a chosen fieldname (see line 16) could be anything
router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: "Image Uploaded",
        image: `/${req.file.path}`,
    })
})

export default router;