module.exports = function(app){
    console.log("유저 라우트 들어오니?")
    const index = require('../controllers/userController');
    app.get('/signin', index.postSignin);
    app.post('/signup',index.postSignup);
};
