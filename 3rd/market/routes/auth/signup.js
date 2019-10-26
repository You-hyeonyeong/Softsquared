var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//회원가입
router.post('/', async (req, res) => {
    const id = req.body.userId;
    const pw = req.body.userPw;
    const name = req.body.userName;
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