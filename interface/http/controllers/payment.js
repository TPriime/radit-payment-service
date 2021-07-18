const Payment = require("../models/payment");
const Errors = require("../utils/constants").errors;
const Success = require("../utils/constants").successMessages;
const { publishPayment } = require("../../amqp/publisher");

module.exports.createPayment = async (req, res) => {
  var payment = new Payment({
    customerId: req.body.customerId,
    orderId: req.body.orderId,
    productIds: req.body.productIds,
    amount: req.body.amount || 1,
  });
  try {
    // await payment.save();

    // TODO check if exists before posting
    // publish payment to amqp
    publishPayment(payment)

    return res.status(200).json({
      status: Success.SUCCESS,
      message: Success.CREATED_PAYMENT,
      payment: payment,
    });
  }
  catch (err) {
    console.log(err)
    return res.status(403).json({
      status: Errors.FAILED,
      message: Errors.DUPLICATE_PAYMENT,
    });
  }
};


module.exports.getPaymentById = async (req, res) => {
  await Payment.findOne(
    {
      _id: req.params.paymentId
    },
    {
      updatedAt: 0,
      __v: 0,
    },
    (error, payment) => {
      if (error || !payment) {
        return res.status(403).json({
          status: Errors.FAILED,
          message: Errors.PAYMENT_NOT_EXISTS,
        });
      }
      return res.status(200).json({
        status: Success.SUCCESS,
        message: Success.FETCHED_PAYMENT_DATA,
        payment: payment,
      });
    }
  );
};


module.exports.getCustomerPayments = async (req, res) => {
  await Payment.find(
    {
      customerId: req.params.customerId
    },
    {
      // _id: 1,
      // createdAt: 1,
      updatedAt: 0,
      __v: 0,
    },
    (error, payments) => {
      if (error || !payments) {
        return res.status(403).json({
          status: Errors.FAILED,
          message: Errors.PAYMENT_NOT_EXISTS,
        });
      }
      return res.status(200).json({
        status: Success.SUCCESS,
        message: Success.FETCHED_PAYMENT_DATA,
        payments: payments,
      });
    }
  );
};


module.exports.getAllPayments = async (req, res) => {
  await Payment.find(
    {},
    (error, payments) => {
      if (error || !payments) {
        return res.status(403).json({
          status: Errors.FAILED,
          message: Errors.PAYMENT_NOT_EXISTS,
        });
      }
      return res.status(200).json({
        status: Success.SUCCESS,
        message: Success.FETCHED_PAYMENT_DATA,
        payments: payments,
      });
    }
  );
};