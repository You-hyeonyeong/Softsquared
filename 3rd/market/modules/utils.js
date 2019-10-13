const authUtil = {
    successTrue: (code, message, data) => {
        return {
            isSuccess: true,
            code : code,
            message: message,
            data: data
        }
    },
    successFalse: (code, message) => {

        return {
            isSuccess: false,
            code : code,
            message: message
        }
    },
};

module.exports = authUtil;