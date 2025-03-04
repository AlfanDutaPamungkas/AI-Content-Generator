const errHandler = async(error, req, res, next) => {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack: {}
    });
};

module.exports = errHandler;

