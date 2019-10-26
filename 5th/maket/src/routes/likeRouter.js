const index = require('../controllers/likeController');

module.exports = function(app){ 
    console.log("라이크 라우트 들어오니?")
    app.post('/like', index.postSignin);
};
