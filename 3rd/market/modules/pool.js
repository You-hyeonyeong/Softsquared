//dbConfig 에서는 mysql 모듈이 아닌 promise-mysql 모듈을 사용. async/await 문법을 사용하기 위함
const poolPromise = require('../config/dbconfig');

module.exports = { // 두 개의 메소드 module화
    query: async(...args) => {
        const queryText = args[0];
        const data = args[1];
    
        var pool = await poolPromise;
        const connection = await pool.getConnection();
        const result = await connection.query(queryText, data) || null;
        console.log(result);
    
        connection.release();
    
        return result;
    }
};