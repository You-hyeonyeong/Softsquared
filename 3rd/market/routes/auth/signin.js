var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//로그인
router.post('/', async (req, res) => {
    const id = req.body.userId;
    const pw = req.body.userPw;

    var selectUser = "SELECT userId, userPw FROM market.user WHERE userId = ? ";
    var selectUserResult = await db.query(selectUser, [id]);
    if (selectUserResult.length ==1 ) {
      console.log ( selectUserResult[0].userPw)
      console.log (pw)
        if (pw == selectUserResult[0].userPw) {
            res.status(200).send(utils.successTrue(200,"로그인 성공"));
        } else {
            res.status(200).send(utils.successTrue(401,"비밀번호가 올바르지 않습니다"));
        }
    } else {
        res.status(200).send(utils.successFalse(400,"존재하지 않는 아이디 입니다"));
    }
});

module.exports = router;