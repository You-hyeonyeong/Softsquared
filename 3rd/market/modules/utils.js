const authUtil = {
    successTrue: (message, data) => {
        return {
            isSuccess: true,
            message: message,
            data: data
        }
    },
    successFalse: (message) => {

        return {
            isSuccess: false,
            message: message
        }
    },
};

module.exports = authUtil;