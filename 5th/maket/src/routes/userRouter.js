module.exports = function(app){
    console.log("유저 라우트 들어오니?")
    const userController = require('../controllers/userController');
    app.route('/signin').post(userController.postSignin);
    app.route('/signup').post(userController.postSignup);
};
