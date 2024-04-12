import HttpError from "../helpers/HttpError.js";
import decForFn from "../decorators/decForFuncs.js";
import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const avatarPath = path.resolve("public", "avatars");

dotenv.config();

const {JWT_SECRET, BASE_URL, BASE_URL_FRONT} = process.env;

const signup = async (req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({email});
    if (user) {
        throw HttpError(409, "Email is use");
    }

    const verificationToken = nanoid();
    
    const newUser = await authServices.signup({...req.body, verificationToken});

    const verifyEmailData = {
        to: email,
        subject: "Please, verify your email",
        html: `<a href="${BASE_URL}/api/users/verify/${verificationToken}" turget="_blank">
        <button 
        style="border-radius: 10px; border: 1px solid transparent; background-color: #474746; color: #ffffff;"
        >Press to continue using MyFilms</button>
        </a>`
    };

    sendEmail(verifyEmailData);

    res.status(201).json({
        user: {
            id: newUser._id,
            email: newUser.email
        }
    })
};

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await authServices.findUser({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found")
    };

    const { _id: id } = user;

    const payload = { id };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await authServices.updateUser({ _id: user._id }, { verify: true, verificationToken: null, token });

    res.redirect(`${BASE_URL_FRONT}/films?token=${token}`)
};

const updatePlayed = async (req, res) => {
    const { id } = req.params;
    const newPlayed = req.body;
    const result = await authServices.updateUser({ _id: id }, { played: newPlayed });
    if (!result) {
        throw HttpError(404, "User not found")
    }

    res.status(201).json({
        user: {
            id: result._id,
            played: result.played
        }
    })
};

const updateSelected = async (req, res) => {
    const { id } = req.params;
    const newSelected = req.body;
    const result = await authServices.updateUser({ _id: id }, { selected: newSelected });
    if (!result) {
        throw HttpError(404, "User not found")
    }

    res.status(201).json({
        user: {
            id: result._id,
            selected: result.selected
        }
    })
};

const updateFavorite = async (req, res) => {
    const { id } = req.params;
    const newFavorite = req.body;
    const result = await authServices.updateUser({ _id: id }, { favorite: newFavorite });
    if (!result) {
        throw HttpError(404, "User not found")
    }

    res.status(201).json({
        user: {
            id: result._id,
            favorite: result.favorite
        }
    })
};

const resendVerify = async (req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(404, "Email not found")
    };
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed")
    };

    const verifyEmailData = {
        to: email,
        subject: "Please, verify your email",
        html: `<a href="${BASE_URL}/api/users/verify/${user.verificationToken}" turget="_blank">Please, verify your email</a>`
    };

    sendEmail(verifyEmailData);

    res.json({
        message: "Verification email sent"
    })
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if (!user) { 
        throw HttpError(401, "Email or password not wrong");
    };
    const isValidPass = await authServices.validPass(password, user.password);
    if (!isValidPass) { 
        throw HttpError(401, "Email or password not wrong");
    };
    if (!user.verify) {
        throw HttpError(401, "Email not verify")
    };

    const { _id: id } = user;

    const payload = { id };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await authServices.updateUser({ _id: id }, { token });

    res.json({
        token,
        user: {
            id: user._id,
            email: user.email,
            subscription: user.subscription
        }
    })
};

const signout = async (req, res) => { 
    const { _id } = req.user;

    await authServices.updateUser({ _id }, { token: null });

    res.status(204).json({
        message: "No Content"
    })
};

const findUser = async (req, res) => {
    const { id } = req.params;
    const result = await authServices.findUser({ _id: id });
    if (!result) {
        throw HttpError(404);
    }
    res.status(201).json({
        user: {
            id: result._id,
            email: result.email,
            name: result.name,
            played: result.played,
            selected: result.selected,
            favorite: result.favorite
        }
    });
};

const delUser = async (req, res) => {
    const { id } = req.params;
    const result = await authServices.removeUser({ _id: id });
    if (!result) {
        throw HttpError(404);
    }
    res.json(result);
};

export default {
    signup: decForFn(signup),
    verify: decForFn(verify),
    resendVerify: decForFn(resendVerify),
    signin: decForFn(signin),
    signout: decForFn(signout),
    delUser: decForFn(delUser),
    findUser: decForFn(findUser),
    updatePlayed: decForFn(updatePlayed),
    updateSelected: decForFn(updateSelected),
    updateFavorite: decForFn(updateFavorite)
}