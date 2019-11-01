module.exports = function(app){
    console.log("평가 라우트 들어오니?")
    const assessmentController = require('../controllers/assessmentController');
    //app.get('/product',productController.postProductSearch);
    app.route('/manner').post(assessmentController.postManner);
    app.get('/manner',assessmentController.getManner);
    app.route('/review').post(assessmentController.postReview);
    app.get('/review',assessmentController.getReview);
};
