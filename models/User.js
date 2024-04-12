import { Schema, model } from "mongoose";
import { handelSaveError, setUpdateSettings } from "./hooks.js";
import { emailRegexp } from "../constants/user-const.js";


const userSchema = new Schema({
    name: {
        type: String
    },
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
    },
    played: {
        type: Array,
        required: []
    },
    selected: {
        type: Array,
        required: []
    },
}, { versionKey: false, timestamps: true });

userSchema.post("save", handelSaveError);

userSchema.pre("findOneAndUpdate", setUpdateSettings);

userSchema.post("findOneAndUpdate", handelSaveError);

const User = model("user", userSchema);

export default User;