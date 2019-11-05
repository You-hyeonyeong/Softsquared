module.exports = function(app){
    console.log("카테고리 라우트 들어오니?")
    
    const categoryController = require('../controllers/categoryController');
    app.get('/category',categoryController.getCategory);
};
