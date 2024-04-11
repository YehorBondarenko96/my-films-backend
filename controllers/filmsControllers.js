import filmsService from "../services/filmsServices.js";
import decForFn from "../decorators/decForFuncs.js";
import HttpError from "../helpers/HttpError.js";
import { createFilmSchema, updateFilmSchema, updateStatusFilmShema } from "../schemas/filmsSchemas.js";

const getAllFilms = async (req, res) => {
    const { _id: owner } = req.user;
    // const { favorite } = req.query;
    const filter = owner;
    const result = await filmsService.listFilms();
    
    res.json(result);
};

const getOneFilm = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await filmsService.getOneFilm({_id: id, owner});
    if (!result) {
        throw HttpError(404);
    }
    res.json(result);
};

const deleteFilm = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const result = await filmsService.removeFilm({_id: id, owner});
    if (!result) {
        throw HttpError(404);
    }
    res.json(result);
};

const createFilm = async (req, res) => {
    const { error } = createFilmSchema.validate(req.body);
    const { _id: owner } = req.user;
    if (error) {
        throw HttpError(400, error.message);
    }
    const result = await filmsService.addFilm({...req.body, owner});
    
    res.status(201).json(result);
};

const updateFilm = async (req, res) => { 
    if (Object.keys(req.body).length < 1) {
        throw HttpError(400, "Body must have at least one field")
    }
    const { error } = updateFilmSchema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const { _id: owner } = req.user;

    const result = await filmsService.updateFilmS({_id: id, owner}, req.body);
    if (!result) {

        throw HttpError(404);
    }
    res.status(200).json(result);
};

const updateStatusFilm = async (req, res) => {
    const { error } = updateStatusFilmShema.validate(req.body);
    if (error) {
        throw HttpError(400, error.message);
    }
    const { id } = req.params;
    console.log('id: ', id);
    console.log(req.body);

    const result = await filmsService.updateFilmS({_id: id}, req.body);
    if (!result) {
        throw HttpError(404);
    }
    res.status(200).json(result);
};

export default {
    getAllFilms: decForFn(getAllFilms),
    getOneFilm: decForFn(getOneFilm),
    deleteFilm: decForFn(deleteFilm),
    createFilm: decForFn(createFilm),
    updateFilm: decForFn(updateFilm),
    updateStatusFilm: decForFn(updateStatusFilm)
}
