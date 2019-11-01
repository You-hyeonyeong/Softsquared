module.exports = function(app){
    console.log("프로덕트 라우트 들어오니?")
    const productController = require('../controllers/productController');
    app.get('/product',productController.postProductSearch);
    app.get('/product', productController.getProduct);
    app.get('/product/:productIdx',productController.postProductDetail);
    app.route('/product/:categoryIdx').post(productController.postProduct);
    app.route('/product/:productIdx').delete(productController.delProduct);
    app.route('/product/sale/:productIdx').put(productController.putProduct);
};
