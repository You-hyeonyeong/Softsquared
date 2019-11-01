module.exports = function(app){
    console.log("마이페이지 라우트 들어오니?")
    const mypageController = require('../controllers/mypageController');
    app.get('/mypage', mypageController.getMypage);
    app.route('/mypage').put(mypageController.updateMypage);
    app.get('/mypage/sale',mypageController.getMypageSale);
    app.get('/mypage/buy',mypageController.getMypageBuy);
    app.get('/mypage/like',mypageController.getMypageLike);
};
