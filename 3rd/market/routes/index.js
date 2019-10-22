var express = require('express');
var router = express.Router();

router.use('/auth', require('./auth/index'));
router.use('/category', require('./category/index'));
router.use('/mypage', require('./mypage/index'));
router.use('/product', require('./product/index'));
router.use('/like', require('./like/index'));
router.use('/search', require('./search/index'));

module.exports = router;