const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuth = asyncHandler(async(req, res, next) => {
    if (req.cookies.token) {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        req.user = await User.findById(decoded?.id).select('-password');
        return next();
    }else{
        return res.status(401).json({
            status: false,
            message:'Not authorize, no token'
        });
    }
});

module.exports = isAuth;

