/** 
 * IP相关操作
 */


// 获取用户真是IP
var getClientIp = (req) => {
    return req.headers['X-Real-IP'] ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress
};

module.exports = {
    getClientIp: getClientIp
};