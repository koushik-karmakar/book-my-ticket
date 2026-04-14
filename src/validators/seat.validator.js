import Joi from "joi";

export const bookSeatSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
});
