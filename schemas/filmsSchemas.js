import Joi from "joi";

export const createFilmSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)).required(),
    phone: Joi.string().pattern(/^[+\-\d()]+$/).required(),
    owner: Joi.string(),
})

export const updateFilmSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().pattern(new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)),
    phone: Joi.string().pattern(/^[+\-\d()]+$/),
    owner: Joi.string(),
})