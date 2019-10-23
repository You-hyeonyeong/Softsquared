var express = require('express');
var router = express.Router();
var utils = require('../../modules/utils');
const db = require('../../modules/pool');


// 댓글작성
router.post('/:productIdx/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const productIdx = req.params.productIdx;
    const contents = req.body.contents;
    const getProductIdx = await db.queryParam_Arr('SELECT productIdx FROM product WHERE productIdx = ?',[productIdx])
    console.log(getProductIdx)
        if(getProductIdx == "") res.status(200).send(utils.successTrue(201,"해당상품이 존재하지 않습니다."));
        else {
            const writeComment = 'INSERT INTO comment(userIdx, productIdx, contents) VALUES (?,?,?)';
            const writeCommentResult = await db.queryParam_Arr(writeComment,[userIdx, productIdx, contents]);
            if (!writeCommentResult) {
                res.status(200).send(utils.successFalse(600,"댓글 작성 실패")); 
            } else {
                res.status(200).send(utils.successTrue(201,"댓글 작성 성공"));
            }
        }
});
//댓글삭제
router.delete('/:commentIdx/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const commentIdx = req.params.commentIdx;

    const delComment = 'SELECT * FROM market.comment WHERE userIdx = ? AND commentIdx = ?';
    const delCommentResult = await db.queryParam_Parse(delComment, [userIdx, commentIdx]);

    if (delCommentResult.length == 1) {
        const deleteComment = 'DELETE FROM market.comment WHERE userIdx = ? AND commentIdx = ?'
        const deleteCommentR = await db.queryParam_Parse(deleteComment, [userIdx, commentIdx]);
        res.status(200).send(utils.successTrue(200,"댓글 삭제 성공", delCommentResult));
    } else {
        if(!delCommentResult) res.status(200).send(utils.successFalse(600,"서버오류"));
        else res.status(200).send(utils.successFalse(404,"등록한 댓글이 없습니다."));
    }
});
module.exports = router;