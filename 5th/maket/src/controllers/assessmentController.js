const jwt = require('../../modules/jwt');
const { logger } = require('../../config/winston');
const utils = require('../../modules/resModule')
const db = require('../../modules/pool');

//매너평가하기
// mannertype mannernum useridx 
exports.postManner = async function (req, res) {
    // const tt = jwt.verify(req.headers.token)
    //const token = tt.idx;
    const userIdx = req.body.userIdx
    const mannerType = req.body.mannerType // 1-5 까지만 가능
    const mannerNum = req.body.mannerNum // 1-5 평가가능

    if (mannerType >= 1 && mannerType <= 5 && mannerNum >= 1 && mannerNum <= 5) {
        const addmanner = 'INSERT INTO market.manner(mannerType, mannerNum, userIdx) VALUES (?, ?, ?)'
        const addmannerResult = await db.query(addmanner, [mannerType, mannerNum, userIdx])
        if (!addmannerResult) {
            res.send(utils.successFalse(600, "디비에러"));
        }
        res.send(utils.successTrue(200, "평가가 완료되었습니다"));
    } else res.send(utils.successFalse(404, "범위에 맞는 값을 입력해주세요"));

};
//매너조회하기
//매너
exports.getManner = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;
    
    const userManner = 'SELECT mannerNum as mannerTemperature FROM market.manner '

    res.send(utils.successTrue(200, "관심목록 취소"));
};
//거래 후기 작성하기
exports.postReview = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;

    res.send(utils.successTrue(200, "관심목록 취소"));
};
//거래 후기 조회
exports.getReview = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;

    res.send(utils.successTrue(200, "관심목록 취소"));
};