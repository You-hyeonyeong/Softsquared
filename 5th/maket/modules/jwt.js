const { logger } = require('../config/winston');
const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "marketserverkey";
const options = {
    expiresIn: '365d',
    subject: 'test'
};
module.exports = {
    sign: (userIdx) => {
        const payload = { 
            idx: userIdx 
        };
        const result = {
            token: jwt.sign(payload, secretOrPrivateKey, options),
        };
        return result;
    },
    verify: (token) => { //해독 모듈 
        let decoded;
        try {
            decoded = jwt.verify(token, secretOrPrivateKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                logger.info('expired token');
                return -3;
            } else if (err.message === 'invalid token') {
                logger.info('invalid token');
                return -2;
            } else {
                logger.info("invalid token");
                return -2;
            }
        }
        return decoded;
    }
};