// validation
const Joi = require("@hapi/joi");

const paymentValidation = (data) => {
  const schema = Joi.object({
    customerId: Joi.string().max(256).required(),
    orderId: Joi.string().required(),
    amount: Joi.number().required(),
    productIds: Joi.array().min(1).required()
  });

  return schema.validate(data);
};

module.exports.paymentValidation = paymentValidation;