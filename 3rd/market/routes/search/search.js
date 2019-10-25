var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');
var urlencode = require('urlencode');

//상품검색
//name, info, price, isSold, createdAt, likeCnt, vilage
router.get('/', async (req, res) => { 
    const keyword = req.query.keyword;
    const searchWord = "SELECT p.productIdx, p.name, p.info, p.price, p.isSold, v.vilage,\
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
      FROM market.product p, market.vilage v\
      WHERE p.vilageIdx = v.vilageIdx AND p.name LIKE ? ";
    console.log(urlencode.decode(keyword))
    const decodeKeyword = urlencode.decode(keyword)

    const searchWordResult = await db.query(searchWord, ['%'+decodeKeyword+'%']);

    if(!searchWordResult) {
        res.status(200).send(utils.successFalse(600,"검색실패"));
    } else if(searchWordResult.length >= 1){
        res.status(200).send(utils.successTrue(200,"검색성공", searchWordResult));
    }
    else{
        res.status(200).send(utils.successFalse(404,"해당 상품이 존재하지 않습니다."));
    }

});

module.exports = router;