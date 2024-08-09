const marked = require("marked");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require('express-async-handler');
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateContent = asyncHandler(async(req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        res.status(400);
        throw new Error('Please all fields are required');
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const markdownText = response.text();
    const text = marked.parse(markdownText);

    const history = await ContentHistory.create({
        user: req?.user?._id,
        content: text,
        prompt
    });

    const userFound = await User.findById(req?.user?._id);
    userFound.history.push(history._id);
    userFound.apiRequestCount += 1;
    await userFound.save();

    res.json(text);
});

module.exports = {
    generateContent
};

