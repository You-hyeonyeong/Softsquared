var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//상품 찜/취소
router.post('/:userIdx/:productIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const productIdx = req.params.productIdx;

    const select = 'SELECT * FROM market.like WHERE userIdx = ? AND productIdx = ?'
    const insertLike = 'INSERT INTO market.like (userIdx, productIdx) VALUES (?, ?)';
    const deleteLike = 'DELETE FROM market.like WHERE userIdx = ? AND productIdx = ?';
    const likeResult = await db.queryParam_Parse(select,[userIdx, productIdx]);
    console.log(likeResult.length )

   
        if(likeResult.length == 0){
            const insertResult = await db.queryParam_Parse(insertLike,[userIdx, productIdx]);
            res.status(200).send(utils.successTrue("찜"),insertResult);
        } else if (likeResult.length == 1){
            console.log("eeeem")
            const deleteLikeResult = await db.queryParam_Parse(deleteLike,[userIdx, productIdx]);
            res.status(200).send(utils.successTrue("찜 취소"));
        } else {
            console.log("eeedddddem")
            res.status(200).send(utils.successFalse("하하 뭔데-"));
        }
    
});




module.exports = router;