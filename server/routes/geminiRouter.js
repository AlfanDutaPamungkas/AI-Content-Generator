const express = require('express');
const isAuth = require('../middlewares/isAuth');
const { generateContent } = require('../controllers/geminiController');
const checkAPIReqLimit = require('../middlewares/checkAPIReqLimit');
const geminiRouter = express.Router();

geminiRouter.post(
    "/generate",
    isAuth,
    checkAPIReqLimit,
    generateContent
);

module.exports = geminiRouter;

