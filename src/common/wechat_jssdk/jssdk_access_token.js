/**
 * des：jssdk相关,获取微信服务器的access_token.
 * by: Xie Xiaofei
 * created: 2017/1/20
 * update: 2017/1/21
 * 
 */
var https = require('https')
var qs = require('querystring');

var GRANT_TYPE = 'client_credential'; // 固定

var tokenMap = new Map();

var timeNow = () => {
    return parseInt(Date.now() / 1000);
}

var request = (options) => {
    var p = new Promise(function (resolve, reject) {
        var httpReq = https.request({
            hostname: options.hostname,
            port: 443,
            path: options.path,
            method: options.method
        }, function (hRes) {
            hRes.on('data', function (res) {
                var obj = JSON.parse(res);
                var token_exp = timeNow() + obj.expires_in; // 全局缓存 (7200)

                resolve({ tks: obj.access_token, exp: token_exp });
            });
            hRes.on('error', function (e) {
                reject('problem with request: ' + e.message);
            });
        });
        httpReq.end();
    })
    return p;
}

var token = async (req) => {


    var tokenItem = tokenMap.get(req.body.appid);

    if (tokenItem && tokenItem.tks && tokenItem.exp && tokenItem.exp > timeNow()) {

        return (tokenItem.tks);

    } else {

        var content = {
            grant_type: GRANT_TYPE,
            appid: req.body.appid,
            secret: appSecret
        };
        var bodyStr = qs.stringify(content);

        var result2 = await request({
            hostname: 'api.weixin.qq.com',
            path: '/cgi-bin/token?' + bodyStr,
            method: 'GET'
        })

        tokenMap.set(req.body.appid, result2);
        console.log("result2.tks :" + result2.tks)
        return result2.tks;
    }
}

module.exports = token;