var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');
var urlencode = require('urlencode');

//상품검색
//name, info, price, isSold, createdAt, likeCnt, vilage
router.get('/', async (req, res) => { 
    const keyword = req.query.keyword;
    const searchWord = "SELECT p.name, p.info, p.price, p.isSold, v.vilage, c.commentIdx,\
    (SELECT COUNT(*) FROM market.like l WHERE p.productIdx = l.productIdx) as likeCnt,\
    CASE WHEN TIMESTAMPDIFF(MINUTE, createdAt, CURRENT_TIMESTAMP) < 60 \
    then CONCAT('끌올 ',TIMESTAMPDIFF(MINUTE, createdAt, CURRENT_TIMESTAMP), ' 분 전') \
    WHEN TIMESTAMPDIFF(HOUR, createdAt, CURRENT_TIMESTAMP) < 24 \
            then CONCAT('끌올 ',TIMESTAMPDIFF(HOUR, createdAt, CURRENT_TIMESTAMP), ' 시간 전') \
   WHEN TIMESTAMPDIFF(DAY, createdAt, CURRENT_TIMESTAMP) < 7 \
            then CONCAT(TIMESTAMPDIFF(DAY, createdAt, CURRENT_TIMESTAMP), ' 일 전')\
   WHEN TIMESTAMPDIFF(WEEK, createdAt, CURRENT_TIMESTAMP) < 4\
            then CONCAT(TIMESTAMPDIFF(WEEK, createdAt, CURRENT_TIMESTAMP), ' 주 전')\
    else CONCAT(TIMESTAMPDIFF(MONTH, createdAt, CURRENT_TIMESTAMP), ' 달 전')\
      END as time_stamp \
      FROM market.product p, market.vilage v, market.comment c \
      WHERE p.vilageIdx = v.vilageIdx AND c.productIdx = p.productIdx AND p.name LIKE ? ";
    console.log(urlencode.decode(keyword))
    const decodeKeyword = urlencode.decode(keyword)

    const searchWordResult = await db.queryParam_Arr(searchWord, ['%'+decodeKeyword+'%']);

    if(!searchWordResult) {
        res.status(200).send(utils.successFalse("검색실패"));
    } else if(searchWordResult.length >= 1){
        res.status(200).send(utils.successTrue("검색성공", searchWordResult));
    }
    else{
        res.status(200).send(utils.successFalse("해당 상품이 존재하지 않습니다."));
    }

});

module.exports = router;