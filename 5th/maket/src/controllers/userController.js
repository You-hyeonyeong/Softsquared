const {pool} = require('../../config/database');
const jwt = require('../../modules/jwt');
const { logger } = require('../../config/winston');
const utils = require('../../modules/resModule')
const db = require('../../modules/pool');
const myserverkey = 'hyeongkey'
//회원가입
exports.postSignup = async function (req, res) {
    console.log("회원가입 들어왔지롱")
    const id = req.body.userId;
    const pw = req.body.userPw;
    const name = req.body.userName;
    
    var insertUser = "INSERT INTO user (userId, userPw, userName) VALUES (?,?,?)";
    var selectUser = "SELECT userId FROM market.user WHERE userId = ?";

    if (!id || !pw || !name) {
        res.send(utils.successFalse(404,"아이디, 비밀번호, 이름 미입력"));
    } else {
        const selectUserResult = await db.query(selectUser,[id]);
        console.log(selectUserResult)
        console.log(selectUserResult.length)
        if (selectUserResult.length == 1) {
            res.send(utils.successFalse(403,"이미 존재하는 아이디 입니다"));
        } else {
            //가입시키기
            const insertUserResult = await db.query(insertUser, [id, pw, name]);
            const selectUserIdx = await db.query('SELECT userIdx FROM market.user ORDER BY userIdx DESC LIMIT 1;')
            res.send(utils.successTrue(201,"가입완료", selectUserIdx));
        }
    }
};

//로그인
exports.postSignin = async function (req, res) {
    console.log("로그인 들어왔지롱")
    // const {name} = req.body;
    const id = req.body.userId
    const pw = req.body.userPw;

    var selectUser = "SELECT userIdx, userId, userPw FROM market.user WHERE userId = ? ";
    var selectUserResult = await db.query(selectUser, [id]);
    if (selectUserResult.length ==1 ) {
        if (pw == selectUserResult[0].userPw) {
            console.log(selectUserResult[0].userIdx)
            const token = await jwt.sign(selectUserResult[0].userIdx);
            res.status(200).send(utils.successTrue(200,"로그인 성공",token));
        } else {
            res.status(200).send(utils.successTrue(401,"비밀번호가 올바르지 않습니다"));
        }
    } else {
        res.status(200).send(utils.successFalse(400,"존재하지 않는 아이디 입니다"));
    }

    // if (!name) return res.json({isSuccess: false, code: 201, message: "이름을 적어주세요."});

    // const tokenValue = jwt.sign(
    //     {
    //         name: name
    //     },
    //     'developmentTokenSecret',
    //     {
    //         expiresIn: '365d',
    //         subject: 'test'
    //     }
    // );

    //  return res.json({isSuccess: true, code: 200, jwt: tokenValue});
};