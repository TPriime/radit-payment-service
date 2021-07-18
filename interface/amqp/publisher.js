const { publishMessage} = require("../../core/mq");

// Publish payment to rabbit mq workers
module.exports.publishPayment = (payment) => {
    publishMessage(JSON.stringify({
        paymentId: payment._id,
        customerId: payment.customerId,
        orderId: payment.orderId, 
        productIds: payment.productIds, 
        amount: payment.amount
    }))
}