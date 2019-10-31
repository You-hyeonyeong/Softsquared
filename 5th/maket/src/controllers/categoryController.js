const jwt = require('../../modules/jwt');
const { logger } = require('../../config/winston');
const utils = require('../../modules/resModule')
const db = require('../../modules/pool');
var urlencode = require('urlencode');

//카테고리 조회
exports.getCategory = async function (req, res) {
    const getAllCategoryQuery = 'SELECT * FROM market.category';
    const getAllCategoryResult = await db.query(getAllCategoryQuery);

	if (!getAllCategoryResult) {
		res.send(utils.successFalse(600,"카테고리 조회 실패")); 
	} else {
		res.send(utils.successTrue(200,"카테고리 조회 성공",getAllCategoryResult));
	}
    
};