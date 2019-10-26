var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//상품 관심목록 추가
router.post('/:productIdx/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const productIdx = req.params.productIdx;

    const user = await db.query('SELECT userIdx FROM user WHERE userIdx = ?',[userIdx]);
    const product = await db.query('SELECT productIdx FROM product WHERE productIdx = ?',[productIdx]);
    const select = 'SELECT * FROM market.like WHERE userIdx = ? AND productIdx = ?'
    const insertLike = 'INSERT INTO market.like (userIdx, productIdx) VALUES (?, ?)';
    const deleteLike = 'DELETE FROM market.like WHERE userIdx = ? AND productIdx = ?';
    const likeResult = await db.query(select,[userIdx, productIdx]);
    console.log(likeResult)
    //사용자와 상품이 없을때는 어떻게..? 각테이블에 가서 있는 인덱스인지 확인?
        if(likeResult.length === 0){
            const insertResult = await db.query(insertLike,[userIdx, productIdx]);
            res.status(200).send(utils.successTrue(200,"관심목록 추가"));
        } else if (likeResult.length == 1){
            console.log("eeeem")
            const deleteLikeResult = await db.query(deleteLike,[userIdx, productIdx]);
            res.status(200).send(utils.successTrue(200,"관심목록 취소"));
        }
});

module.exports = router;