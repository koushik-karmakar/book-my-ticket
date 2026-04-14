import Joi from "joi";

export const confirmPaymentSchema = Joi.object({
  booking_id: Joi.number().integer().required(),
  transaction_id: Joi.string().required(),
  payment_method: Joi.string().valid("card", "upi", "netbanking").required(),
});
