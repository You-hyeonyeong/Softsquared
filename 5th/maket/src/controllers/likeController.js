const jwt = require('../../modules/jwt');
const { logger } = require('../../config/winston');
const utils = require('../../modules/resModule')
const db = require('../../modules/pool');

//관심목록추가/취소
exports.postLike = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;
    const productIdx = req.params.productIdx;

    const user = await db.query('SELECT userIdx FROM user WHERE userIdx = ?',[token]);
    const product = await db.query('SELECT productIdx FROM product WHERE productIdx = ?',[productIdx]);
    const select = 'SELECT * FROM market.like WHERE userIdx = ? AND productIdx = ?'
    const insertLike = 'INSERT INTO market.like (userIdx, productIdx) VALUES (?, ?)';
    const deleteLike = 'DELETE FROM market.like WHERE userIdx = ? AND productIdx = ?';
    const likeResult = await db.query(select,[token, productIdx]);
        if(likeResult.lengthㄴ === 0){
            const insertResult = await db.query(insertLike,[token, productIdx]);
            res.send(utils.successTrue(200,"관심목록 추가"));
        } else if (likeResult.length == 1){
            const deleteLikeResult = await db.query(deleteLike,[token, productIdx]);
            res.send(utils.successTrue(200,"관심목록 취소"));
        }
    
};