const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const checkAPIReqLimit = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req?.user?.id);
    let requestLimit = 0;
    requestLimit = user?.monthlyRequestCount;

    if (user?.apiRequestCount >= requestLimit) {
        throw new Error('API Request Limit Reached');
    }
    next();
});

module.exports = checkAPIReqLimit;

