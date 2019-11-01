const jwt = require('../../modules/jwt');
const { logger } = require('../../config/winston');
const utils = require('../../modules/resModule')
const db = require('../../modules/pool');

//댓글목록 조회
exports.getComment = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;

    const productIdx = req.params.productIdx;
    const getComments = "SELECT u.userName, c.contents, v.vilage, \
    CASE WHEN TIMESTAMPDIFF(MINUTE, c.createdAt, CURRENT_TIMESTAMP) < 60 \
    then CONCAT(TIMESTAMPDIFF(MINUTE, c.createdAt, CURRENT_TIMESTAMP), ' 분 전') \
    WHEN TIMESTAMPDIFF(HOUR, c.createdAt, CURRENT_TIMESTAMP) < 24 \
            then CONCAT(TIMESTAMPDIFF(HOUR, c.createdAt, CURRENT_TIMESTAMP), ' 시간 전') \
    WHEN TIMESTAMPDIFF(DAY, c.createdAt, CURRENT_TIMESTAMP) < 7 \
            then CONCAT(TIMESTAMPDIFF(DAY, c.createdAt, CURRENT_TIMESTAMP), ' 일 전')\
    WHEN TIMESTAMPDIFF(WEEK, c.createdAt, CURRENT_TIMESTAMP) < 4\
            then CONCAT(TIMESTAMPDIFF(WEEK, c.createdAt, CURRENT_TIMESTAMP), ' 주 전')\
    else CONCAT(TIMESTAMPDIFF(MONTH, c.createdAt, CURRENT_TIMESTAMP), ' 달 전')\
    END as time_stamp \
    FROM market.product p \
        JOIN market.user u ON u.userIdx = p.userIdx \
        JOIN market.vilage v ON v.vilageIdx = u.vilageIdx \
        JOIN market.comment c ON c.productIdx = p.productIdx \
    WHERE c.productIdx = ?";
    const getProductResult = await db.query(getComments,[productIdx])
        if(getProductResult == "") res.status(200).send(utils.successTrue(201,"해당상품이 존재하지 않습니다."));
        else {
            if (!getProductResult) {
                res.status(200).send(utils.successFalse(600,"댓글 조회 실패")); 
            } else {
                res.status(200).send(utils.successTrue(201,"댓글 조회 성공",getProductResult));
            }
        }    
};

//댓글등록
exports.postComment = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;
    const productIdx = req.params.productIdx;
    const contents = req.body.contents;
    const getProductIdx = await db.query('SELECT productIdx FROM product WHERE productIdx = ?',[productIdx])
    console.log(getProductIdx)
        if(getProductIdx == "") res.send(utils.successTrue(201,"해당상품이 존재하지 않습니다."));
        else {
            const writeComment = 'INSERT INTO comment(userIdx, productIdx, contents) VALUES (?,?,?)';
            const writeCommentResult = await db.query(writeComment,[token, productIdx, contents]);
            if (!writeCommentResult) {
                res.send(utils.successFalse(600,"댓글 작성 실패")); 
            } else {
                res.send(utils.successTrue(201,"댓글 작성 성공"));
            }
        }
};
//댓글삭제
exports.delComment = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;

    const commentIdx = req.params.commentIdx;
    const delComment = 'SELECT * FROM market.comment WHERE userIdx = ? AND commentIdx = ?';
    const delCommentResult = await db.query(delComment, [token, commentIdx]);

    if (delCommentResult.length == 1) {
        const deleteComment = 'DELETE FROM market.comment WHERE userIdx = ? AND commentIdx = ?'
        const deleteCommentR = await db.query(deleteComment, [token, commentIdx]);
        res.send(utils.successTrue(200,"댓글 삭제 성공", delCommentResult[0]));
    } else {
        if(!delCommentResult) res.send(utils.successFalse(600,"서버오류"));
        else res.send(utils.successFalse(404,"등록한 댓글이 없습니다."));
    }
};