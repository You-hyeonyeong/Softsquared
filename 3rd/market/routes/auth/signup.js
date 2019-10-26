var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//회원가입
router.post('/', async (req, res) => {
    const id = req.body.userId;
    const pw = req.body.userPw;
    const name = req.body.userName;

    var jwt      = require('jsonwebtoken');
    var tokenKey = "TEST_KEY11"; //토큰키 서버에서 보관 중요
    var payLoad  = {'uid':14554};
    var token = jwt.sign(payLoad,tokenKey,{
        algorithm : 'HS256', //"HS256", "HS384", "HS512", "RS256", "RS384", "RS512" default SHA256
        expiresInMinutes : 1440 //expires in 24 hours
    });
    console.log("token : ", token);
    
    var insertUser = "INSERT INTO user (userId, userPw, userName) VALUES (?,?,?)";
    var selectUser = "SELECT userId FROM market.user WHERE userId = ?";

    if (!id || !pw || !name) {
        res.status(200).send(utils.successFalse("아이디, 비밀번호, 이름 미입력"));
    } else {
        const selectUserResult = await db.query(selectUser,[id]);
        if (selectUserResult.length >= 1) {
            res.status(200).send(utils.successFalse("이미 존재하는 아이디 입니다"));
        } else {
            //가입시키기
            const insertUserResult = await db.query(insertUser, [id, pw, name]);
            const selectUserIdx = await db.query('SELECT userIdx FROM market.user ORDER BY userIdx DESC LIMIT 1;')
            res.status(200).send(utils.successTrue("가입완료",selectUserIdx));
        }
    }
});
module.exports = router;