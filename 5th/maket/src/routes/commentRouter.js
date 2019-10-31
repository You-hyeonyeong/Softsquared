module.exports = function(app){
    console.log("커멘트 라우트 들어오니?")
    const commentController = require('../controllers/commentController');
    app.get('/comment/:productIdx',commentController.getComment);
    app.route('/comment/:productIdx').post(commentController.postComment);
    app.route('/comment/:commentIdx').delete(commentController.delComment);
};
