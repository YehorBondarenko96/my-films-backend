import express from "express";
import controllersFilms from "../controllers/filmsControllers.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const filmsRouter = express.Router();

filmsRouter.use(authenticate);

filmsRouter.get("/", controllersFilms.getAllFilms);

filmsRouter.get("/:id", isValidId, controllersFilms.getOneFilm);

filmsRouter.delete("/:id", isValidId, controllersFilms.deleteFilm);

filmsRouter.post("/", controllersFilms.createFilm);

filmsRouter.put("/:id", isValidId, controllersFilms.updateFilm);

filmsRouter.patch("/:id/favorite", isValidId, controllersFilms.updateStatusFilm);

export default filmsRouter;
