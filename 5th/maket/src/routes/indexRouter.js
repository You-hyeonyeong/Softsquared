module.exports = function(app){
    app.get('/user',require('./userRouter'))
    app.get('/product',require('./productRouter'))
    app.get('/like',require('./likeRouter'))
};
    