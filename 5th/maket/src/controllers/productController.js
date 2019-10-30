const jwt = require('../../modules/jwt');
const { logger } = require('../../config/winston');
const utils = require('../../modules/resModule')
const db = require('../../modules/pool');
var urlencode = require('urlencode');

//전체상품조회 
// 해당 유저가 좋아요했는지 여부
exports.getProduct = async function (req, res) {
    //const token = req.headers.token
    const tt = jwt.verify(req.headers.token)
    console.log(tt.idx) //idx 값출력
    const getProductQuery =
    "SELECT p.productIdx, p.name, p.price, p.saleStatus, v.vilage,\
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
    FROM market.product p \
        JOIN market.category c ON c.categoryIdx = p.categoryIdx \
        JOIN market.user u ON u.userIdx = p.userIdx  \
        JOIN market.vilage v ON v.vilageIdx = u.vilageIdx \
    WHERE p.saleStatus = 0 \
    ORDER BY p.createdAt DESC";

    const getAllCategoryResult = await db.query(getProductQuery,[tt.idx]);

    if (!getAllCategoryResult) {
        res.send(utils.successFalse(600, "상품 조회 실패"));
    } else {
        res.send(utils.successTrue(200, "상품 조회 성공", getAllCategoryResult));
    }
};

//상품상세조회
// 해당 유저가 좋아요했는지 여부
exports.postProductDetail = async function (req, res) {
    const productIdx = req.params.productIdx;
    const getProduct = 'SELECT p.productIdx, p.name, p.info, c.title, v.vilage, \
    (SELECT COUNT(*) FROM market.like l WHERE p.productIdx = l.productIdx) as likeCnt,\
    (SELECT COUNT(*) FROM market.comment c WHERE p.productIdx = c.productIdx) as commentCnt\
    FROM market.product p \
        JOIN market.category c ON c.categoryIdx = p.categoryIdx \
        JOIN market.user u ON u.userIdx = p.userIdx  \
        JOIN market.vilage v ON v.vilageIdx = u.vilageIdx \
    WHERE p.productIdx = ?'

    const getProductResult = await db.query(getProduct, [productIdx]);
    console.log(getProductResult)
    if (!getProductResult) {
        res.send(utils.successFalse(600, "상품 상세조회 실패"));
    } else {
        if (getProductResult.length == 0) res.send(utils.successFalse(400, "해당상품 없음"));
        res.send(utils.successTrue(200, "상품 상세조회 성공", getProductResult[0]));
    }
};

//상품등록
exports.postProduct = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;
    const name = req.body.name;
    const info = req.body.info;
    const price = req.body.price;
    const categoryIdx = req.params.categoryIdx;
    const insertProduct = 'INSERT INTO product (name, info, price, categoryIdx, userIdx) VALUES (?,?,?,?,?)'

    if (!name || !info || !price || !categoryIdx) {
        res.status(200).send(utils.successFalse("필수값을 입력하세요"));
    } else {
        if (categoryIdx < 7) {
            const insertProductResult = await db.query(insertProduct, [name, info, price, categoryIdx, token]);
            res.status(200).send(utils.successTrue(201,"상품등록 되었습니다.","productIdx : "+insertProductResult.insertId));
            if (!insertProductResult) {
                res.status(200).send(utils.successFalse(600,"상품 등록 실패"));
            }
        } else res.status(200).send(utils.successFalse(404,"유효하지 않은 카테고리 입니다."));
    }
};

//상품삭제
exports.delProduct = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;
    const productIdx = req.params.productIdx;

    const getProductQuery = 'SELECT * FROM market.product WHERE userIdx = ? AND productIdx = ?';
    const getAllCategoryResult = await db.query(getProductQuery, [token, productIdx]);

    if (getAllCategoryResult.length == 1) {
        const deletProduct = 'DELETE FROM market.product WHERE userIdx = ? AND productIdx = ?'
        const deletProductResult = await db.query(deletProduct, [token, productIdx]);
        res.send(utils.successTrue(200,"상품삭제 성공"));
    } else {
        res.send(utils.successFalse(404,"등록한 상품이 없거나 권한이 없습니다."));
    }
};

//상품검색
// 해당 유저가 좋아요했는지 여부
exports.postProductSearch = async function (req, res) {
    const keyword = req.query.keyword;
    const searchWord = "SELECT p.productIdx, p.name, p.info, p.price, p.saleStatus, v.vilage,\
    (SELECT COUNT(*) FROM market.like l WHERE p.productIdx = l.productIdx) as likeCnt,\
    (SELECT COUNT(*) FROM market.comment c WHERE p.productIdx = c.productIdx) as commentCnt,\
    CASE WHEN TIMESTAMPDIFF(MINUTE, p.createdAt, CURRENT_TIMESTAMP) < 60 \
    then CONCAT('끌올 ',TIMESTAMPDIFF(MINUTE, p.createdAt, CURRENT_TIMESTAMP), ' 분 전') \
    WHEN TIMESTAMPDIFF(HOUR, p.createdAt, CURRENT_TIMESTAMP) < 24 \
            then CONCAT('끌올 ',TIMESTAMPDIFF(HOUR, p.createdAt, CURRENT_TIMESTAMP), ' 시간 전') \
    WHEN TIMESTAMPDIFF(DAY, p.createdAt, CURRENT_TIMESTAMP) < 7 \
            then CONCAT(TIMESTAMPDIFF(DAY, p.createdAt, CURRENT_TIMESTAMP), ' 일 전')\
    WHEN TIMESTAMPDIFF(WEEK, p.createdAt, CURRENT_TIMESTAMP) < 4\
            then CONCAT(TIMESTAMPDIFF(WEEK, p.createdAt, CURRENT_TIMESTAMP), ' 주 전')\
    else CONCAT(TIMESTAMPDIFF(MONTH, p.createdAt, CURRENT_TIMESTAMP), ' 달 전')\
      END as time_stamp \
      FROM market.product p \
        JOIN market.category c ON c.categoryIdx = p.categoryIdx \
        JOIN market.user u ON u.userIdx = p.userIdx  \
        JOIN market.vilage v ON v.vilageIdx = u.vilageIdx \
      WHERE p.name LIKE ? ";
    console.log(urlencode.decode(keyword))
    const decodeKeyword = urlencode.decode(keyword)
    const searchWordResult = await db.query(searchWord, ['%'+decodeKeyword+'%']);
    if(!searchWordResult) {
        res.status(200).send(utils.successFalse(600,"검색실패"));
    } else if(searchWordResult.length >= 1){
        res.status(200).send(utils.successTrue(200,"검색성공", searchWordResult));
    }
    else{
        res.status(200).send(utils.successFalse(404,"해당 상품이 존재하지 않습니다."));
    }

    
};