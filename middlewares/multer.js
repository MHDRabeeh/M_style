const multer = require('multer');



const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/NewFolder/image-");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/webp" || file.mimetype == "image/gif" || file.mimetype == "image/jpg") {
        cb(null, true);
    } else {
        return cb(new Error("File not supported"), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
})

const uploadImages = upload.array("image", 4)


module.exports.send = (req, res, next) => {
    return uploadImages(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
          
            console.log(err)
            res.redirect("/admin/product")
        } else if (err) {
            // An unknown error occurred when uploading.
      
            console.log(err)
            res.redirect("/admin/product")
        } else {
            next()
        }
    })
}

module.exports.upload = (req, res, next) => {
    return uploadImages(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
          
            console.log(err)
            res.redirect("/admin/category-manage")
        } else if (err) {
            // An unknown error occurred when uploading.
      
            console.log(err)
            res.redirect("/admin/category-manage")
        } else {
            next()
        }
    })
}
