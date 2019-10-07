var express = require('express');
var router = express.Router();

router.use('/product', require('./product'));
router.use('/search', require('./search'));



module.exports = router;