const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { handleMidtransPayment, handleFreeSubscription, paymentSuccess, checkPaymentStatus } = require('../controllers/midtransController');
const midtransRouter = express.Router();

midtransRouter.post("/checkout", isAuth, handleMidtransPayment);
midtransRouter.post("/free-plan", isAuth, handleFreeSubscription);
midtransRouter.post("/payment-success", isAuth, paymentSuccess);
midtransRouter.get("/check-payment-status", isAuth, checkPaymentStatus);

module.exports = midtransRouter;

