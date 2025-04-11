require("dotenv").config(); // <-- Load .env before anything else

const cloudinary = require('cloudinary').v2; // Use .v2
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage  = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "profile_pics",
        allowed_formats: ["jpg","jpeg","png"],
    },
});

const upload = multer({storage});
module.exports = upload;