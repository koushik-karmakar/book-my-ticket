import Joi from "joi";

export const lockSeatsSchema = Joi.object({
  show_id: Joi.number().integer().required(),
  seat_ids: Joi.array().items(Joi.number().integer()).min(1).max(10).required(),
});

export const createBookingSchema = Joi.object({
  show_id: Joi.number().integer().required(),
  seat_ids: Joi.array().items(Joi.number().integer()).min(1).max(10).required(),
});