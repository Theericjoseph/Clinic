const jwt = require('jsonwebtoken');
require("dotenv").config();


function verifyAccessToken(req, res, next) {

    let token;

    let cookieStr = req.headers.cookie;
    token = cookieStr?.split('=')[1];
    jwt.verify(
        token,
        'secret',
        (err, decoded) => {

            if (err) return res.sendStatus(403);
            next();
        }
    );

}

module.exports = verifyAccessToken