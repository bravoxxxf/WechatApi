/**
 * des：jssdk相关,获取sign.
 * by: Xie Xiaofei
 * created: 2017/1/20
 * update: 2017/1/21
 * 
 */
var crypto = require('crypto')
var qs = require('querystring');

var createNonceStr = () => {
    return Math.random().toString(36).substr(2, 15);
};

var createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};

var raw = function (args) {
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

var sign = (ticket, url) => {
    var ret = {
        jsapi_ticket: ticket,
        noncestr: createNonceStr(),
        timestamp: createTimestamp(),
        url: url
    };
    var signStr = raw(ret);
    const signature = crypto.createHash('sha1');
    signature.update(signStr);
    ret.signature = signature.digest('hex');

    return ret;
}


module.exports = sign;