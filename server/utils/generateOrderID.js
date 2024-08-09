const { v4: uuidv4 } = require('uuid');

const generateOrderID = () => {
    const uuid = uuidv4().replace(/-/g, '').slice(0, 12);
    return `TRX-${uuid}`;
};

module.exports = generateOrderID;

