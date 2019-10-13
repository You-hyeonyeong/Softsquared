var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');
var urlencode = require('urlencode');

//상품검색
router.get('/', async (req, res) => { 
    const keyword = req.query.keyword;
    const searchWord = "SELECT name, info, price, isSold FROM product WHERE name LIKE ? ";
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