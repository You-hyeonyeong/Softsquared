var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//마이페이지 조회
router.get('/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const getUser = 'SELECT * FROM user WHERE userIdx = ?'
    const getUserResult = await db.queryParam_Arr(getUser,[userIdx]);

    if(!getUserResult) {
        res.status(200).send(utils.successFalse("마이페이지 조회 실패"));
    } else {
        res.status(200).send(utils.successTrue("마이페이지 조회 성공", getUserResult));
    }

});

//마이페이지 수정
router.put('/{userIdx}', async (req, res) => {
    

});


module.exports = router;