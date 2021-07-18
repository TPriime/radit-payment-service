const Validators = require("../utils/validators");
const Errors = require("../utils/constants").errors;

function _sendError(message, error, res) {
  return res.status(400).json({
    status: Errors.FAILED,
    message: message,
    error: error,
  });
}


module.exports.validatePaymentFields = (req, res, next) => {
  const { error } = Validators.paymentValidation(req.body);
  if (error) return _sendError(error.details[0].message, error, res);
  next();
};