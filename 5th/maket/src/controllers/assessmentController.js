const jwt = require('../../modules/jwt');
const { logger } = require('../../config/winston');
const utils = require('../../modules/resModule')
const db = require('../../modules/pool');
var cron = require('node-cron');



//매너평가하기
//mannertype mannernum useridx 
//manner_one : 응답이 빨라요 1도상승
//manner_two : 시간약속을 잘지켜요 2도 상승
//manner_three : 친절하고 매너가 좋아요 3도 상승
exports.postManner = async function (req, res) {
    // const tt = jwt.verify(req.headers.token)
    //const token = tt.idx;
    const userIdx = req.body.userIdx
    const mannerType = req.body.mannerType 

    if (mannerType >= 1 && mannerType <= 3) {
        const addmanner = 'INSERT INTO market.manner(mannerType, userIdx) VALUES (?, ?, ?)'
        const addmannerResult = await db.query(addmanner, [mannerType, userIdx])
        if (!addmannerResult) {
            res.send(utils.successFalse(600, "디비에러"));
        }
        res.send(utils.successTrue(200, "평가가 완료되었습니다"));
    } else res.send(utils.successFalse(404, "범위에 맞는 값을 입력해주세요"));

};
//매너온도조회하기
//매너얼굴
exports.getManner = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;
    
    const userManner = await db.query('SELECT userIdx,\
        sum(CASE WHEN mannerType = 1 then 1 \
        WHEN mannerType = 2 then 2 \
        WHEN mannerType = 3 then 3 \
        WHEN mannerType = 4 then -1 \
        WHEN mannerType = 5 then 1 \
        WHEN mannerType = 6 then 3 \
        else 0 END) +36 \
    as mannerTemperature\
    FROM market.manner\
    WHERE userIdx = ?',[token])
    if(!userManner) res.send(utils.successFalse(200, "매너온도 조회 실패"));
    else res.send(utils.successTrue(200, "매너온도 조회 완료", userManner));
};
//거래 후기 작성하기
//review_four : 별로에요 1도 하락
//review_five : 좋아요 1도 상승
//review_six : 최고에요 3도 상승
exports.postReview = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;

    const userIdx = req.body.userIdx
    const mannerType = req.body.mannerType 

    if (mannerType >= 4 && mannerType <= 6) {
        const addmanner = 'INSERT INTO market.manner(mannerType, userIdx) VALUES (?, ?, ?)'
        const addmannerResult = await db.query(addmanner, [mannerType, userIdx])
        if (!addmannerResult) {
            res.send(utils.successFalse(600, "디비에러"));
        }
        res.send(utils.successTrue(200, "거래후기 작성이 완료되었습니다"));
    } else res.send(utils.successFalse(404, "범위에 맞는 값을 입력해주세요"));
};
//매너평가 조회
exports.getReview = async function (req, res) {
    const tt = jwt.verify(req.headers.token)
    const token = tt.idx;
     
    const manner = 'SELECT \
    CASE WHEN mannerType = 1 then "응답이 빨라요" \
    CASE WHEN mannerType = 1 then "시간약속을 잘 지켜요" \
    CASE WHEN mannerType = 1 then "친절하고 매너가 좋아요" \
    AS mannerType, count(*) AS count \
    FROM market.manner WHERE userIdx = ?'
    const mannerResult = await db.query(manner,[token])

    res.send(utils.successTrue(200, "관심목록 취소"));
};

// 한시간에 한번씩 온도 올린거 적용하고 얼굴 변경시키기
// second minute hour day-of-month month day-of-week
cron.schedule('*/5 * * * *', function(){
    console.log('5분 마다 바뀌는 node-cron 실행 테스트');
    //오분마다 업데이트 진행한 시간 이후꺼 조회해서 업데이트 해주면 됨
    const updateManner = 'UPDATE market.manner SET mannerTemperature = ? WHERE userIdx = ?'
  });