import Film from "../models/Film.js";

const listFilms = () => Film.find();
const addFilm = data => Film.create(data);
const getOneFilm = filter => Film.findOne(filter);
const updateFilmS = (filter, data) => Film.findOneAndUpdate(filter, data);
const updateStatusFilm = (filter, fav) => Film.findOneAndUpdate(filter, {favorite: fav});
const removeFilm = filter => Film.findOneAndDelete(filter);

export default {
    listFilms,
    getOneFilm,
    removeFilm,
    addFilm,
    updateFilmS,
    updateStatusFilm
}