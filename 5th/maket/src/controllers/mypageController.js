const jwt = require('../../modules/jwt');
const { logger } = require('../../config/winston');
const utils = require('../../modules/resModule')
const db = require('../../modules/pool');

//마이페이지 조회
//매너온도 받은평가
exports.getMypage = async function (req, res) {
	const tt = jwt.verify(req.headers.token)
    const token = tt.idx;
    const getUser = 'SELECT u.userName, u.userId, v.vilage FROM user u, vilage v WHERE u.vilageIdx = v.vilageIdx AND userIdx = ?'
    const getUserResult = await db.query(getUser,[token]);
    
    if(!getUserResult) {
        res.end(utils.successFalse(600,"마이페이지 조회 실패"));
    } else {
        if (getUserResult.length == 0) {
            res.send(utils.successFalse(404,"해당 유저가 없습니다."));
        } else res.send(utils.successTrue(200,"마이페이지 조회 성공", getUserResult));
    }

    
};
//마이페이지 수정
exports.updateMypage = async function (req, res) {
	const tt = jwt.verify(req.headers.token)
    const token = tt.idx;
    const name = req.body.userName;
    const userInfo = req.body.userInfo;
    const userSelect = 'SELECT userIdx, userId, userName, userInfo FROM market.user WHERE userIdx = ?'
    const userUpdate = 'UPDATE market.user SET userName = ? , userInfo = ? WHERE userIdx = ?'

    const userSelectResult = await db.query(userSelect,[token]);
    console.log(userSelectResult)
    if(userSelectResult.length == 0) {
        res.status(200).send(utils.successFalse(404,"해당 유저가 없습니다"));
    } else{
        const userUpdateResult = await db.query(userUpdate,[name, userInfo, token]);
        if(!userUpdateResult) {
            res.status(200).send(utils.successFalse(600,"마이페이지 수정 실패"));
        }
        const userComplete = await db.query(userSelect,[token]);
        res.status(200).send(utils.successTrue(200,"마이페이지 수정 성공", userComplete));
    }

};
//마이페이지 구매내역조회
//ACCOUNT TABLE 에서 조회하면 됨
//상품이름 지역 개월전 댓글수 하트수 
exports.getMypageBuy = async function (req, res) {
	const tt = jwt.verify(req.headers.token)
	const token = tt.idx;

    const getBuy = 'SELECT p.name, p.info, p.price FROM market.product p, market.account a WHERE a.productIdx = p.productIdx AND a.userIdx = ?'
	const getAccountBuy = await db.query(getBuy,[token]);
	
    if(!getAccountBuy) {
        res.status(200).send(utils.successFalse("구매내역 조회 실패"));
    } else {
		console.log(getAccountBuy)
		console.log(getAccountBuy)
        res.status(200).send(utils.successTrue("구매내역 조회 성공", getAccountBuy));
    }
    
    
};
//마이페이지 판매내역조회
// 내가 등록한 상품 보면됨
// 근데 이렇게 주면 문제가 많을거 같은데 아닌가 클라가 힘들어 할 거 같은디..
exports.getMypageSale = async function (req, res) {
	const tt = jwt.verify(req.headers.token)
	const token = tt.idx;

	const getsaleing = await db.query('SELECT name, info, price FROM product WHERE userIdx = ? AND saleStatus = 0',[token])
	const getreservation = await db.query('SELECT name, info, price FROM product WHERE userIdx = ? AND saleStatus = 1',[token])
	const getcomplete = await db.query('SELECT name, info, price FROM product WHERE userIdx = ? AND saleStatus = 2',[token])

	const allResult = {
		"판매중": getsaleing,
		"예약중" : getreservation,
		"거래완료" : getcomplete
	}
    if(!allResult) {
        res.status(200).send(utils.successFalse("판매내역 조회 실패"));
    } else {
        res.status(200).send(utils.successTrue("판매내역 조회 성공", allResult));
    }

    
};

//마이페이지 관심목록조회
exports.getMypageLike = async function (req, res) {
	const tt = jwt.verify(req.headers.token)
	const token = tt.idx;
    const getLike = 
    "SELECT l.useridx, p.name, p.info, p.price, p.saleStatus, v.vilage,\
    (SELECT COUNT(*) FROM market.like l WHERE p.productIdx = l.productIdx) as likeCnt,\
    (SELECT COUNT(*) FROM market.comment c WHERE p.productIdx = c.productIdx) as commentCnt,\
    CASE WHEN TIMESTAMPDIFF(MINUTE, p.createdAt, CURRENT_TIMESTAMP) < 60 \
    then CONCAT('끌올 ',TIMESTAMPDIFF(MINUTE, p.createdAt, CURRENT_TIMESTAMP), ' 분 전') \
    WHEN TIMESTAMPDIFF(HOUR, p.createdAt, CURRENT_TIMESTAMP) < 24 \
            then CONCAT('끌올 ',TIMESTAMPDIFF(HOUR, p.createdAt, CURRENT_TIMESTAMP), ' 시간 전') \
   WHEN TIMESTAMPDIFF(DAY, p.createdAt, CURRENT_TIMESTAMP) < 7 \
            then CONCAT(TIMESTAMPDIFF(DAY, p.createdAt, CURRENT_TIMESTAMP), ' 일 전')\
   WHEN TIMESTAMPDIFF(WEEK, p.createdAt, CURRENT_TIMESTAMP) < 4\
            then CONCAT(TIMESTAMPDIFF(WEEK, p.createdAt, CURRENT_TIMESTAMP), ' 주 전')\
    else CONCAT(TIMESTAMPDIFF(MONTH, p.createdAt, CURRENT_TIMESTAMP), ' 달 전')\
      END as time_stamp \
	  FROM market.product p \
	  	JOIN market.like l ON p.userIdx = l.userIdx \
        JOIN market.user u ON u.userIdx = p.userIdx  \
        JOIN market.vilage v ON v.vilageIdx = u.vilageIdx \
      WHERE l.userIdx = ? ";
    const getLikeResult = await db.query(getLike,[token]);

    if(!getLikeResult) {
        res.send(utils.successFalse("관심목록 조회 실패"));
    } else {
        res.send(utils.successTrue("관심목록 조회 성공", getLikeResult));
    }

    
};