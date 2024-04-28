import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("Files", file);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()?.toLocaleString()}.${file.originalname.split(".").pop()}`)
    }
})

export const upload = multer({
    storage
});    