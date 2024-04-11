import { Schema, model } from "mongoose";
import { handelSaveError, setUpdateSettings } from "./hooks.js";
// import { type } from "express/lib/response.js";

const filmSchema = new Schema({
    id: {
        type: Number
    },
    title: {
        type: String,
        required: [true, 'Set title for film'],
    },
    
    description: {
        type: String,
    },
    rating: {
        type: Number,
    },
    release_date: {
        type: Date
    },
    genre: {
        type: [String]
    },
    actors: {
        type: [String]
    },
    director: {
    type: String
    },
    image: {
    type: String
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, { versionKey: false, timestamps: true });

filmSchema.post("save", handelSaveError);

filmSchema.pre("findOneAndUpdate", setUpdateSettings);

filmSchema.post("findOneAndUpdate", handelSaveError);

const Film = model("movies", filmSchema);

export default Film;