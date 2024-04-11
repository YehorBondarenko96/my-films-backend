import { Schema, model } from "mongoose";
import { handelSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../constants/user-const.js";
// import { type } from "express/lib/response.js";


const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: emailRegexp
    },
    token: {
        type: String,
        default: null,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    }
}, { versionKey: false, timestamps: true });

userSchema.post("save", handelSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handelSaveError);

const User = model("user", userSchema);

export default User;