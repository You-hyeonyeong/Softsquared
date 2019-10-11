var express = require('express');
var router = express.Router();
const db = require('../../modules/pool');
var utils = require('../../modules/utils');

//name info price isSold category


//상품리스트 조회
router.get('/', async (req, res) => {
    const getProductQuery = 'SELECT * FROM market.product';
    const getAllCategoryResult = await db.queryParam_None(getProductQuery);

    if (!getAllCategoryResult) {
        res.status(200).send(utils.successFalse("상품 조회 실패"));
    } else {
        res.status(200).send(utils.successTrue("상품 조회 성공", getAllCategoryResult));
    }
});

//상품등록
router.post('/:categoryIdx', async (req, res) => {
    const name = req.body.name;
    const info = req.body.info;
    const price = req.body.price;
    const userIdx = req.body.userIdx;
    const categoryIdx = req.params.categoryIdx;

    const insertProduct = 'INSERT INTO product (name, info, price, categoryIdx, userIdx) VALUES (?,?,?,?,?)'

    if (!name || !info || !price || !categoryIdx) {
        res.status(200).send(utils.successFalse("필수값을 입력하세요"));
    } else {
        const insertProductResult = await db.queryParam_Parse(insertProduct, [name, info, price, categoryIdx, userIdx]);
        res.status(200).send(utils.successTrue("상품등록 되었습니다."));
        if (!insertProductResult) {
            res.status(200).send(utils.successFalse("상품 등록 실패"));
        }
    }  

});

//상품삭제
router.delete('/:productIdx/:userIdx', async (req, res) => {
    const userIdx = req.params.userIdx;
    const productIdx = req.params.productIdx;

    const getProductQuery = 'SELECT * FROM market.product WHERE userIdx = ? AND productIdx = ?';
    const getAllCategoryResult = await db.queryParam_Parse(getProductQuery,[userIdx, productIdx]);

    if (getAllCategoryResult.length == 1) {
        const deletProduct = 'DELETE FROM market.product WHERE userIdx = ? AND productIdx = ?'
        const deletProductResult = await db.queryParam_Parse(deletProduct,[userIdx, productIdx]);
        res.status(200).send(utils.successTrue("상품삭제 성공", getAllCategoryResult));
    } else {
        res.status(200).send(utils.successFalse("등록한 상품이 없습니다."));
    }
});




module.exports = router;