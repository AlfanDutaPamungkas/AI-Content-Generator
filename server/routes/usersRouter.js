const express = require('express');
const { register, login, logout, profile, checkAuth, setActiveOrderID, getActiveOrderID, deleteActiveOrderID, fetchSingleHistory } = require('../controllers/usersController');
const isAuth = require('../middlewares/isAuth');
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/profile", isAuth ,profile);
userRouter.get("/auth/check", isAuth ,checkAuth);
userRouter.post("/set-orderid", isAuth ,setActiveOrderID);
userRouter.get("/get-orderid", isAuth ,getActiveOrderID);
userRouter.get("/delete-orderid", isAuth ,deleteActiveOrderID);
userRouter.get("/fetch-history/:id", isAuth, fetchSingleHistory);

module.exports = userRouter;

