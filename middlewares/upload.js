import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js"

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const unicPref = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileName = `${unicPref}_${file.originalname}`;
        cb(null, fileName);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, cb) => {
    const extension = file.originalname.split(".").pop();
    if (extension === "exe") {
        return cb(HttpError(400, ".exe not valid extension format"))
    }
    cb(null, true);
};

const upload = multer({
    storage,
    limits,
    fileFilter
});

export default upload;