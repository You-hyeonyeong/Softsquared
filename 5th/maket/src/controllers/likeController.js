const jwt = require('../../modules/jwt');
const { logger } = require('../../config/winston');
const utils = require('../../modules/resModule')
const db = require('../../modules/pool');

//관심목록추가
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
    //사용자와 상품이 없을때는 어떻게..? 각테이블에 가서 있는 인덱스인지 확인?
        if(likeResult.length === 0){
            const insertResult = await db.query(insertLike,[token, productIdx]);
            res.send(utils.successTrue(200,"관심목록 추가"));
        } else if (likeResult.length == 1){
            const deleteLikeResult = await db.query(deleteLike,[token, productIdx]);
            res.send(utils.successTrue(200,"관심목록 취소"));
        }
    
};