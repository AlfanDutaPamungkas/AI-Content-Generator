const asyncHandler = require('express-async-handler');
const snap = require('../config/snap');
const generateOrderID = require('../utils/generateOrderID');
const calculateNextBillingDate = require('../utils/calculateBillDate');
const shouldRenewSubscriptionPlan = require('../utils/shouldRenewSubs');
const Payment = require('../models/Payment');
const User = require('../models/User');

const handleMidtransPayment = asyncHandler(async(req, res) => {
    const { amount, subscriptionPlan } = req.body;
    const user = req?.user;
    const remainingCredit = user?.monthlyRequestCount - user.apiRequestCount;

    if(user.trialActive && remainingCredit > 0){
        return res.status(403).json({error: 'Your trial is active or your trial credit still available'});
    }

    if (user?.subscriptionPlan == "Premium" && subscriptionPlan == "Basic" && remainingCredit > 0) {
        return res.status(403).json({error: "Your credit hasn't run out yet"});
    }

    if (user?.subscriptionPlan == subscriptionPlan && remainingCredit > 0) {
        return res.status(403).json({error: "Your credit hasn't run out yet"});
    }

    const orderID = generateOrderID();
    let parameter = {
        "transaction_details": {
            "order_id": orderID,
            "gross_amount": amount
        },
        "credit_card":{
            "secure" : true
        },
        "customer_details": {
            "username": user.username,
            "email": user.email,
            "subscription plan":subscriptionPlan
        }
    };

    try {
        let transaction = await snap.createTransaction(parameter);
        res.status(201).json(transaction);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

});

const handleFreeSubscription = asyncHandler(async(req, res) => {
    const user = req?.user;
    const remainingCredit = user?.monthlyRequestCount - user.apiRequestCount;
    try {
        if(user.trialActive || remainingCredit > 0){
            return res.status(403).json({error: 'Your trial is active or your trial credit still available'});
        }

        if (shouldRenewSubscriptionPlan(user)) {
            user.subscriptionPlan = 'Free';
            user.monthlyRequestCount = 5;
            user.apiRequestCount = 0;
            user.nextBillingDate = calculateNextBillingDate();

            const newPayment = await Payment.create({
                user: user?._id,
                subscriptionPlan: 'Free',
                amount: 0,
                status: 'success',
                monthlyRequestCount: 5,
                reference: generateOrderID()
            });

            user.payments.push(newPayment._id);

            await user.save();
            return res.json({
                status: true,
                message: 'Subscription plan updated successfully',
                user
            });
        }else{
            return res.status(403).json({error: 'Subscription renewal not due yet'})
        }
    } catch (error) {
        return res.status(403).json({error})
    }
});

const paymentSuccess = asyncHandler(async (req, res) => {
    const { orderID, plan, amount } = req.body;
    let monthlyAPIReq;
    const user = req?.user;
    const userPlan = user?.subscriptionPlan;
    const remainingCredit = user?.monthlyRequestCount - user.apiRequestCount;

    const payment = await Payment.findOneAndUpdate(
        { reference: orderID },
        {
            $setOnInsert: {
                user: user?._id,
                subscriptionPlan: plan,
                amount: amount,
                status: 'success',
                monthlyRequestCount: userPlan === plan ? user.monthlyRequestCount : (plan === "Basic" ? 50 : 100),
                reference: orderID
            }
        },
        { upsert: true, new: true }
    );

    if (!payment) {
        return res.json({
            status: false,
            message: 'Payment already processed',
        });
    }

    // Tentukan monthlyAPIReq berdasarkan plan
    if (plan === "Basic") {
        monthlyAPIReq = 50;
    } else {
        monthlyAPIReq = 100;
    }

    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
            $set: {
                subscriptionPlan: plan,
                monthlyRequestCount: userPlan !== plan ? monthlyAPIReq + remainingCredit : monthlyAPIReq,
                apiRequestCount: 0,
                nextBillingDate: calculateNextBillingDate()
            },
            $addToSet: { payments: payment._id }
        },
        { new: true, useFindAndModify: false }
    );

    if (!updatedUser) {
        return res.json({
            status: false,
            message: 'User update failed',
        });
    }

    return res.json({
        status: true,
        message: 'Subscription plan updated successfully',
        user: updatedUser
    });
});

const checkPaymentStatus = asyncHandler(async(req, res) => {
    const { order_id } = req.query;

    const payment = await Payment.findOne({ reference: order_id });
    if (payment) {
        return res.json({ status: "failed" , message: "you are cheat!" });
    }

    const response = await fetch(`https://api.sandbox.midtrans.com/v2/${order_id}/status`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`
        }
      });
    const data = await response.json();

    if (data.status_code == 404) {
        return res.json({ status: "not found" , message: "payment not found!" });
    }else if (data.transaction_status == 'settlement') {
        return res.status(200).json({ status: 'paid', detail: data });
    }else if(data.transaction_status == 'pending'){
        return res.status(200).json({ status: 'pending', detail: data });
    }else {
        return res.json({ status: 'failed', message: "payment failed to be made" });
    }
});

module.exports = {
    handleMidtransPayment,
    handleFreeSubscription,
    paymentSuccess,
    checkPaymentStatus
};

