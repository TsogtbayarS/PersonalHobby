const jsonwebtoken = require('jsonwebtoken');
require("dotenv").config();

module.exports.authenticate = function (req, res, next) {
    const token = req.headers.authorization.split(" ")[1]
    try {
        const returnValue = jsonwebtoken.verify(token, process.env.SECRET_OR_PUBLIC_KEY)
        next();
    }
    catch {
        res.status(401).json({ "message": process.env.NOT_VALID_TOKEN })
    }
}