var express = require('express');
var router = express.Router();
var utils = require('../../modules/utils');
const db = require('../../modules/pool');


//카테고리별 조회
router.get('/', async (req, res) => {
    const getAllCategoryQuery = 'SELECT * FROM market.category';
    const getAllCategoryResult = await db.queryParam_None(getAllCategoryQuery);

	if (!getAllCategoryResult) {
		res.status(200).send(utils.successFalse("카테고리 조회 실패")); 
	} else {
		res.status(200).send(utils.successTrue("카테고리 조회 성공",getAllCategoryResult));
	}
});
module.exports = router;



    // const getCategory = 'SELECT * FROM category';
    // let pool = await poolPromise
    // const connection = await pool.getConnection(async conn => conn);
    // console.log("했어?");
    // const getCategoryResult = await connection.query(getCategory);
    // console.log(getCategoryResult);
    // await connection.commit(); // COMMIT
    // connection.release();
    // res.status(200).send(utils.successTrue(200,"카테고리 조회 성공했지라",getCategoryResult));