module.exports = function(app){
    const index = require('../controllers/indexController');
    app.get('/test', index.getTest);
    app.route('/test').post(index.postTest);
};
