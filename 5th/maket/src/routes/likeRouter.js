module.exports = function(app){
    console.log("라이크 라우트 들어오니?")
    const likeController = require('../controllers/likeController');
    //app.get('/product',productController.postProductSearch);
    app.route('/like/:productIdx').post(likeController.postLike);
};
