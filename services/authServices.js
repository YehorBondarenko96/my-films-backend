import User from "../models/User.js";
import bcryptjs from "bcryptjs";

export const signup = async (data) => {
    const hashPass = await bcryptjs.hash(data.password, 10);
    return User.create({ ...data, password: hashPass })
};

export const findUser = filter => User.findOne(filter);

export const validPass = (password, hashPass) => bcryptjs.compare(password, hashPass);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);

export const removeUser = filter => User.findOneAndDelete(filter);