var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//상품검색
router.post('/', async (req, res) => { //쿼리로 검색어 넘기려고 했는데 postman에서 넘기는데 인코딩 해결 못함 -> body로 진행
    const keyword = req.body.keyword;
    const searchWord = "SELECT name, info, price, isSold FROM product WHERE name LIKE ? ";
    const searchWordResult = await db.queryParam_Arr(searchWord, ['%'+keyword+'%']);

    console.log(keyword)

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