/** 
 * token授权
 * token根据微信用户的uid生成，每一次授权只有30分钟有效期，过期将不再有效，除非再次使用微信授权流程
 * 
 */

var jwt = require('json-web-token');
var ValidTime = 1800; // 30分钟的Token有效期

var timeNow = () => {
    return parseInt(Date.now() / 1000);
}

var jsonWebToken = {};
var secretkey = "secretKey";  // 自定义秘钥


jsonWebToken.encode = function (userid) {
    var p = new Promise(function (resolve, reject) {
        jwt.encode(secretkey, { 'userid': userid, 'exp': timeNow() + ValidTime }, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    })
    return p;
}

jsonWebToken.decode = (tokenString) => {
    var p = new Promise(function (resolve, reject) {
        jwt.decode(secretkey, tokenString, function (err, data) {
            if (!err && timeNow() <= parseInt(data.exp)) {
                resolve(data);
            } else {
                reject('token时长失效');
            }
        });
    })
    return p;
}



module.exports = jsonWebToken;