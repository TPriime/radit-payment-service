const router = require("express").Router();
const { internalServerError } = require("../utils/response");
const AuthMiddlewares = require("../middlewares/payment");
const PaymentControllers = require("../controllers/payment");

router.get(
  "/customer/:customerId",
  async (req, res) => {
    try {
      await PaymentControllers.getCustomerPayments(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.get(
  "/all",
  async (req, res) => {
    try {
      await PaymentControllers.getAllPayments(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

router.get(
  "/:paymentId",
  async (req, res) => {
    try {
      await PaymentControllers.getPaymentById(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);


router.post("/",
  AuthMiddlewares.validatePaymentFields,
  async (req, res) => {
    try {
      await PaymentControllers.createPayment(req, res);
    } catch (error) {
      internalServerError(res, error);
    }
  }
);

module.exports = router;
