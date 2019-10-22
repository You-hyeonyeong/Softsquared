var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//마이페이지 조회
// name vilage id 구매내역 판매내역, 좋아요상품
router.get('/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const getUser = 'SELECT u.userName, u.userId, v.vilage FROM user u, vilage v WHERE u.vilageIdx = v.vilageIdx AND userIdx = ?'
    const getAccount = 'SELECT p.name p.info p.price a.type FROM product p, account a WHERE p.productIdx = a.productIdx AND p.userIdx = ?'
    const getUserResult = await db.queryParam_Arr(getUser,[userIdx]);
    const getAccountResult = await db.queryParam_Arr(getAccount,[userIdx]);

    if(!getUserResult) {
        res.status(200).send(utils.successFalse("마이페이지 조회 실패"));
    } else {
        res.status(200).send(utils.successTrue("마이페이지 조회 성공", getUserResult ,getAccountResult));
    }

});

//판매내역 조회
router.get('/:userIdx/purchase', async (req, res) => {
    const userIdx = req.params.userIdx;
    const account = "PURCHASE";
    const getPurchase = 'SELECT p.name, p.info, p.price, a.type FROM product p, account a WHERE p.productIdx = a.productIdx AND a.userIdx = ? AND a.type = ?'
    const getAccountPurchase = await db.queryParam_Arr(getPurchase,[userIdx,account]);

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
    const getAccountBuy = await db.queryParam_Arr(getBuy,[userIdx,account]);

    if(!getAccountBuy) {
        res.status(200).send(utils.successFalse("구매내역 조회 실패"));
    } else {
        res.status(200).send(utils.successTrue("구매내역 조회 성공", getAccountBuy));
    }

});

//마이페이지 수정
router.put('/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const name = req.body.userName;
    const userInfo = req.body.userInfo;
    const userSelect = 'SELECT * FROM market.user WHERE userIdx = ?'
    const userUpdate = 'UPDATE market.user SET userName = ? , userInfo = ? WHERE userIdx = ?'

    const userSelectResult = await db.queryParam_Parse(userSelect,[userIdx]);
    if(!userSelectResult) {
        res.status(200).send(utils.successFalse("해당 유저가 없습니다"));
    } else{
        const userUpdateResult = await db.queryParam_Parse(userUpdate,[name, userInfo, userIdx]);
        if(!userUpdateResult) {
            res.status(200).send(utils.successFalse("마이페이지 수정 실패"));
        }
        res.status(200).send(utils.successTrue("마이페이지 수정 성공", userSelectResult));
    }

});


module.exports = router;