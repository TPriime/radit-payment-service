process.env.NODE_ENV = 'test';

// let mongoose = require("mongoose");
let Payment = require('../interface/http/models/payment');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index').server;
let should = chai.should();


chai.use(chaiHttp);

describe('payments', () => {
    var preventDelete = false;

    beforeEach((done) => {
        if(!preventDelete) {
            Payment.remove({}, (err) => {
                done();
            });
        }
        else {
            preventDelete = false;
            done();
        }
    });

    /*
     * Test the /GET/all route
     */
    describe('/GET payment', () => {
        it('it should GET all the payments', (done) => {
            chai.request(server)
                .get('/all')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.payments.should.be.a('array');
                    res.body.payments.length.should.be.eql(0);
                    done();
                });
        });
    });

    /*
     * Test the /POST/ route
     */
    /* describe('/POST payment', () => {
        let payment = {
            "customerId": "c220a2db2",
            "orderId": "a2344bfscc",
            "productIds": ["23ac443c", "1a2af2b88"],
            "amount": "100000"
          }

        it('it should PUT a payment', (done) => {
            chai.request(server)
                .put('/')
                .send(payment)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Created payment data');
                    res.body.should.have.property('payment');
                    res.body.payment.should.have.property('orderId').eql(payment.orderId);
                    preventDelete = true
                    done();
                });
        });
        it('it should not PUT a payment with the same orderId', (done) => {
            let duplicatePayment = payment
            chai.request(server)
                .put('/')
                .send(duplicatePayment)
                .end((err, res) => {
                    res.should.not.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql("failed");
                    preventDelete = true
                    done();
                });
        });
        it('it should not PUT a payment with incomplete data', (done) => {
            let incompletePaymentData = {
                "orderId": "a2344bf887cc",
                "amount": "100000"
              }
            chai.request(server)
                .put('/')
                .send(incompletePaymentData)
                .end((err, res) => {
                    res.should.not.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql("failed");
                    done();
                });
        });
    }); */

    /*
     * Test the /GET/:paymentId route
     */
    describe('/GET/:paymentId payment', () => {
        it('it should GET a payment by the given payment id', (done) => {
            let payment = new Payment({
                "customerId": "c220a2db2",
                "orderId": "a23445fs87c",
                "productIds": ["23ac443c", "1a2af2b88"],
                "amount": "5000"
              });
            payment.save((err, payment) => {
                console.log(payment)
                chai.request(server)
                    .get('/' + payment._id)
                    .send(payment)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.payment.should.have.property('_id').eql(payment._id.toString());
                        done();
                    });
            });

        });
    });

    /*
     * Test the /GET/customer/:customerId route
     */
    describe('/GET/customer/:customerId payment', () => {
        it('it should GET all payments of the give customer id', (done) => {
            let payment = new Payment({
                "customerId": "c220a2db2",
                "orderId": "a23445fs87c",
                "productIds": ["23ac443c", "1a2af2b88"],
                "amount": "5000"
              });
            payment.save((err, payment) => {
                console.log(payment)
                chai.request(server)
                    .get('/customer/' + payment.customerId)
                    .send(payment)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.payments.should.be.a('array');
                        res.body.payments[0].should.have.property('_id').eql(payment._id.toString());
                        done();
                    });
            });

        });
    });
});