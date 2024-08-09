require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const userRouter = require('./routes/usersRouter');
const errHandler = require('./middlewares/errorHandler');
const geminiRouter = require('./routes/geminiRouter');
const midtransRouter = require('./routes/midtransRouter');
const User = require('./models/User');
const PORT = process.env.PORT;
const app = express();

connectDB();

cron.schedule(' 0 0 * * * * ', async() => {
    try {
        const today = new Date();
        await User.updateMany(
            {
                trialActive: true,
                trialExpires: { $lt: today }
            },
            {
                trialActive: false,
                subscriptionPlan: 'Free',
                monthlyRequestCount: 5,
                apiRequestCount: 0
            }
        );
    } catch (error) {
        console.log(error);
    }
});

cron.schedule(' 0 0 1 * * * ', async() => {
    try {
        const today = new Date();
        await User.updateMany(
            {
                subscriptionPlan: 'Free',
                nextBillingDate: { $lt: today }
            },
            {
                monthlyRequestCount: 0,
                apiRequestCount:0
            }
        );
    } catch (error) {
        console.log(error);
    }
});

cron.schedule(' 0 0 1 * * * ', async() => {
    try {
        const today = new Date();
        await User.updateMany(
            {
                subscriptionPlan: 'Basic',
                nextBillingDate: { $lt: today }
            },
            {
                monthlyRequestCount: 0,
                apiRequestCount:0
            }
        );
    } catch (error) {
        console.log(error);
    }
});

cron.schedule(' 0 0 1 * * * ', async() => {
    try {
        const today = new Date();
        await User.updateMany(
            {
                subscriptionPlan: 'Premium',
                nextBillingDate: { $lt: today }
            },
            {
                monthlyRequestCount: 0,
                apiRequestCount:0
            }
        );
    } catch (error) {
        console.log(error);
    }
});

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};

app.use(cors(corsOptions));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/gemini", geminiRouter);
app.use("/api/v1/midtrans", midtransRouter);

app.use(errHandler);

app.listen(PORT, console.log(`Server is running on port ${PORT}`));

