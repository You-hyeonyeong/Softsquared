//const {pool} = require('../../config/database');
const jwt = require('jsonwebtoken');
const {logger} = require('../../config/winston');

exports.postSignin = function (req, res) {
    // const token = req.headers["x-access-token"];
    // if (!token) return res.json({isSuccess: false, code: 201, message: "토큰 불일치1."});
    // try {
    //     const value = jwt.verify(token, 'developmentTokenSecret');
    //     return res.json(value.name);
    // } catch (err) {
    //     return res.json({isSuccess: false, code: 201, message: "토큰 불일치2."});
    // }

    /*try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query("SELECT id, title FROM test");
            connection.release();
            return res.json(rows);
        } catch(err) {
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch(err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }*/
    console.log("getSingin 들어왔지롱")
};

exports.postSignup = function (req, res) {
    console.log("getSingup 들어왔지롱")
    // const {name} = req.body;

    // if (!name) return res.json({isSuccess: false, code: 201, message: "이름을 적어주세요."});

    // const tokenValue = jwt.sign(
    //     {
    //         name: name
    //     },
    //     'developmentTokenSecret',
    //     {
    //         expiresIn: '365d',
    //         subject: 'test'
    //     }
    // );

    // return res.json({isSuccess: true, code: 200, jwt: tokenValue});
};