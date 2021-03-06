var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//상품리스트 조회 (최신 업로드 순)
//name price isSold 업로드 시각
router.get('/', async (req, res) => {
    const getProductQuery =
        "SELECT p.productIdx, p.name, p.price, p.isSold, v.vilage,\
    (SELECT COUNT(*) FROM market.like l WHERE p.productIdx = l.productIdx) as likeCnt,\
    (SELECT COUNT(*) FROM market.comment c WHERE p.productIdx = c.productIdx) as commentCnt,\
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
    FROM market.product p ,market.category c, market.vilage v \
    WHERE c.categoryIdx = p.categoryIdx AND p.vilageIdx = v.vilageIdx \
    AND p.isSold = 0\
    ORDER BY p.createdAt DESC";

    const getAllCategoryResult = await db.query(getProductQuery);

    if (!getAllCategoryResult) {
        res.status(200).send(utils.successFalse(600, "상품 조회 실패"));
    } else {
        res.status(200).send(utils.successTrue(200, "상품 조회 성공", getAllCategoryResult));
    }
});
//상품 상세 조회 
//name info price isSold category 댓글 이회원의 상품
router.get('/:productIdx', async (req, res) => {
    const productIdx = req.params.productIdx;
    const getProduct = 'SELECT p.name, p.info, c.title, v.vilage, \
    (SELECT COUNT(*) FROM market.like l WHERE p.productIdx = l.productIdx) as likeCnt,\
    (SELECT COUNT(*) FROM market.comment c WHERE p.productIdx = c.productIdx) as commentCnt\
    FROM market.product p, market.vilage v, market.category c \
    WHERE p.vilageIdx = v.vilageIdx AND c.categoryIdx = p.categoryIdx AND p.productIdx = ?'

    const getProductResult = await db.query(getProduct, [productIdx]);
    console.log(getProductResult)
    if (!getProductResult) {
        res.status(200).send(utils.successFalse(600, "상품 상세조회 실패"));
    } else {
        if (getProductResult.length == 0) res.status(200).send(utils.successFalse(400, "해당상품 없음"));
        res.status(200).send(utils.successTrue(200, "상품 상세조회 성공", getProductResult[0]));
    }
});


//상품등록
router.post('/:categoryIdx', async (req, res) => {
    const name = req.body.name;
    const info = req.body.info;
    const price = req.body.price;
    const userIdx = req.body.userIdx;
    const categoryIdx = req.params.categoryIdx;
    const vilageIdx = await db.query('SELECT v.vilageIdx FROM market.vilage v, market.user u WHERE v.vilageIdx = u.vilageIdx AND u.userIdx = ?',[userIdx]);
    const insertProduct = 'INSERT INTO product (name, info, price, categoryIdx, userIdx, vilageIdx) VALUES (?,?,?,?,?,?)'

    if (!name || !info || !price || !categoryIdx) {
        res.status(200).send(utils.successFalse("필수값을 입력하세요"));
    } else {
        if (categoryIdx < 7) {
            const insertProductResult = await db.query(insertProduct, [name, info, price, categoryIdx, userIdx, vilageIdx[0].vilageIdx]);
            res.status(200).send(utils.successTrue(201,"상품등록 되었습니다."));
            if (!insertProductResult) {
                res.status(200).send(utils.successFalse(600,"상품 등록 실패"));
            }
        } else res.status(200).send(utils.successFalse(404,"유효하지 않은 카테고리 입니다."));
    }

});

//상품삭제
router.delete('/:productIdx/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const productIdx = req.params.productIdx;

    const getProductQuery = 'SELECT * FROM market.product WHERE userIdx = ? AND productIdx = ?';
    const getAllCategoryResult = await db.query(getProductQuery, [userIdx, productIdx]);

    if (getAllCategoryResult.length == 1) {
        const deletProduct = 'DELETE FROM market.product WHERE userIdx = ? AND productIdx = ?'
        const deletProductResult = await db.query(deletProduct, [userIdx, productIdx]);
        res.status(200).send(utils.successTrue("상품삭제 성공", getAllCategoryResult));
    } else {
        res.status(200).send(utils.successFalse("등록한 상품이 없습니다."));
    }
});




module.exports = router;