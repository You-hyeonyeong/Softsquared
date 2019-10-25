var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//마이페이지 조회
// name vilage id 구매내역 판매내역, 좋아요상품
router.get('/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const getUser = 'SELECT u.userName, u.userId, v.vilage FROM user u, vilage v WHERE u.vilageIdx = v.vilageIdx AND userIdx = ?'
    const getUserResult = await db.query(getUser,[userIdx]);
    
    if(!getUserResult) {
        res.status(200).send(utils.successFalse(600,"마이페이지 조회 실패"));
    } else {
        if (getUserResult.length == 0) {
            res.status(200).send(utils.successFalse(404,"해당 유저가 없습니다."));
        } else res.status(200).send(utils.successTrue(200,"마이페이지 조회 성공", getUserResult));
    }

});

//판매내역 조회
router.get('/:userIdx/purchase', async (req, res) => {
    const userIdx = req.params.userIdx;
    const account = "PURCHASE";
    const getPurchase = 'SELECT p.name, p.info, p.price, a.type FROM product p, account a WHERE p.productIdx = a.productIdx AND a.userIdx = ? AND a.type = ?'
    const getAccountPurchase = await db.query(getPurchase,[userIdx,account]);

    if(!getAccountPurchase) {
        res.status(200).send(utils.successFalse("판매내역 조회 실패"));
    } else {
        res.status(200).send(utils.successTrue("판매내역 조회 성공", getAccountPurchase));
    }

});
//구매내역 조회
router.get('/:userIdx/buy', async (req, res) => {
    const userIdx = req.params.userIdx;
    const account = "BUY";
    const getBuy = 'SELECT p.name, p.info, p.price, a.type FROM market.product p, market.account a WHERE p.productIdx = a.productIdx AND a.userIdx = ? AND a.type = ?'
    const getAccountBuy = await db.query(getBuy,[userIdx,account]);

    if(!getAccountBuy) {
        res.status(200).send(utils.successFalse("구매내역 조회 실패"));
    } else {
        res.status(200).send(utils.successTrue("구매내역 조회 성공", getAccountBuy));
    }

});

//관심 목록 조회
router.get('/:userIdx/like', async (req, res) => {
    const userIdx = req.params.userIdx;
    const getLike = 
    "SELECT l.useridx, p.name, p.info, p.price, p.isSold, v.vilage,\
    (SELECT COUNT(*) FROM market.like l WHERE p.productIdx = l.productIdx) as likeCnt,\
    (SELECT COUNT(*) FROM market.comment c WHERE p.productIdx = c.productIdx) as commentCnt,\
    CASE WHEN TIMESTAMPDIFF(MINUTE, p.createdAt, CURRENT_TIMESTAMP) < 60 \
    then CONCAT('끌올 ',TIMESTAMPDIFF(MINUTE, p.createdAt, CURRENT_TIMESTAMP), ' 분 전') \
    WHEN TIMESTAMPDIFF(HOUR, p.createdAt, CURRENT_TIMESTAMP) < 24 \
            then CONCAT('끌올 ',TIMESTAMPDIFF(HOUR, p.createdAt, CURRENT_TIMESTAMP), ' 시간 전') \
   WHEN TIMESTAMPDIFF(DAY, p.createdAt, CURRENT_TIMESTAMP) < 7 \
            then CONCAT(TIMESTAMPDIFF(DAY, p.createdAt, CURRENT_TIMESTAMP), ' 일 전')\
   WHEN TIMESTAMPDIFF(WEEK, p.createdAt, CURRENT_TIMESTAMP) < 4\
            then CONCAT(TIMESTAMPDIFF(WEEK, p.createdAt, CURRENT_TIMESTAMP), ' 주 전')\
    else CONCAT(TIMESTAMPDIFF(MONTH, p.createdAt, CURRENT_TIMESTAMP), ' 달 전')\
      END as time_stamp \
      FROM market.product p, market.vilage v, market.like l \
      WHERE p.vilageIdx = v.vilageIdx AND l.productIdx = p.productIdx AND l.userIdx = ? ";
// 'SELECT p.name, p.info, l.userIdx FROM market.like l, market.product p WHERE l.productIdx = p.productIdx AND l.userIdx = ?'
    const getLikeResult = await db.query(getLike,[userIdx]);

    if(!getLikeResult) {
        res.status(200).send(utils.successFalse("관심목록 조회 실패"));
    } else {
        res.status(200).send(utils.successTrue("관심목록 조회 성공", getLikeResult));
    }

});

//마이페이지 수정
router.put('/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const name = req.body.userName;
    const userInfo = req.body.userInfo;
    const userSelect = 'SELECT userIdx, userId, userName, userInfo FROM market.user WHERE userIdx = ?'
    const userUpdate = 'UPDATE market.user SET userName = ? , userInfo = ? WHERE userIdx = ?'

    const userSelectResult = await db.query(userSelect,[userIdx]);
    console.log(userSelectResult)
    if(userSelectResult.length == 0) {
        res.status(200).send(utils.successFalse(404,"해당 유저가 없습니다"));
    } else{
        const userUpdateResult = await db.query(userUpdate,[name, userInfo, userIdx]);
        if(!userUpdateResult) {
            res.status(200).send(utils.successFalse(600,"마이페이지 수정 실패"));
        }
        const userComplete = await db.query(userSelect,[userIdx]);
        res.status(200).send(utils.successTrue(200,"마이페이지 수정 성공", userComplete));
    }

});


module.exports = router;