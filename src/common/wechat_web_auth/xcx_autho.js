/**
 * des：微信小程序授权.
 * by: Xie Xiaofei
 * created: 2018/5/22
 *
 */


var https = require('https')
// var http = require('http')
var path = require('path')
var qs = require('querystring')

var url = path.basename(__filename, '.js')

var serviceCache = {};

server.post({ url: url, name: url }, async function (req, res) {

    // 参数判断
    if (!req.body.appid || !req.body.code) {
        res.send({ error_code: 1, data: '请传入正确的appid和code' });
        return;
    }

    try {
        // 获取对应appid的秘钥
        let secretkey = null;

        if (serviceCache[req.body.appid]) {
            secretkey = serviceCache[req.body.appid];
        } else {
            secretkey = appSecret;
            serviceCache[req.body.appid] = appSecret;
        }

        // 获取openid
        let content = {
            appid: req.body.appid,
            secret: secretkey,
            js_code: req.body.code,
            grant_type: "authorization_code"
        }
        var httpReq = https.request({
            hostname: 'api.weixin.qq.com',
            port: 443,
            path: '/sns/jscode2session?' + qs.stringify(content),
            method: 'GET'
        }, function (response) {
            response.on('data', function (data) {
                var dataJson = JSON.parse(data);
                return res.send({ data: dataJson });
            });
            response.on('error', function (e) {
                console.log('userinfo error : ' + e.message)
            });
        });
        httpReq.end();



    } catch (error) {
        console.log(error);
        return res.send({ error_code: 1, msg: error });
    }

})
