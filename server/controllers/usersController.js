const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ContentHistory = require('../models/ContentHistory');

const register = asyncHandler(async(req,res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please all fields are required');
    }

    const userExist = await User.findOne({email});
    if (userExist) {
        res.status(400);
        throw new Error('User already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        password: hashedPassword,
        email
    });

    newUser.trialExpires = new Date(
        new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
    );

    await newUser.save();

    res.json({
        status:true,
        message:'Registration was successfull',
        user: {
            username,
            email
        }
    });
});

const login = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    if ( !email || !password) {
        res.status(400);
        throw new Error('Please all fields are required');
    }

    const user = await User.findOne({email});
    if (!user) {
        res.status(401)
        throw new Error('Invalid credentials');
    }
    
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
        res.status(401)
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        {id: user?._id},
        process.env.JWT_KEY,
        {expiresIn: '1d'},
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
        status:'success',
        message:'Login success',
        _id: user?._id,
        username: user?.username,
        email: user?.email,
    });
});

const logout = asyncHandler(async(req, res) => {
    res.cookie('token', '', {maxAge: 1})
    res.status(200).json({
        staus:true,
        message:'Logged out succesfully'
    });
});

const profile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user.id).select('-password').populate('payments').populate('history');
    if (user) {
        res.json({
            status: true,
            message: 'User found',
            user
        });
    } else {
        res.status(400);
        throw new Error('User not found');
    }
});

const checkAuth = asyncHandler(async(req, res) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    if (decoded) {
        res.json({
            isAuthenticated: true
        });
    }else{
        res.json({
            isAuthenticated: false
        });
    }
});

const setActiveOrderID = asyncHandler(async(req, res) => {
    const {orderID, plan} = req.body;

    if (orderID, plan) {
        const newOrderID = `${orderID} ${plan}`;
        const user = await User.findByIdAndUpdate(
            req.user.id, 
            {activeOrderID:newOrderID}, 
            {new:true}
        );

        res.json({
            status: true,
            orderid : user.activeOrderID
        })
    }
});

const getActiveOrderID = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    if (user.activeOrderID) {
        res.json({
            status: true,
            orderID: user.activeOrderID
        });
    }else{
        res.json({
            status: false,
        });
    }
});

const deleteActiveOrderID = asyncHandler(async(req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user.id, 
        { $unset: { activeOrderID:""}}, 
        {new:true}
    );

    res.json({
        status: true,
        user
    })
});

const fetchSingleHistory = asyncHandler(async(req, res) => {
    const {id} = req.params;
    const history = await ContentHistory.findById(id);
    if(!history){
        res.status(404)
        throw new Error('History Not Found!');
    }
    res.json({
        status: true,
        history
    });
})

module.exports = {
    register,
    login,
    logout,
    profile,
    checkAuth,
    setActiveOrderID,
    getActiveOrderID,
    deleteActiveOrderID,
    fetchSingleHistory
}

