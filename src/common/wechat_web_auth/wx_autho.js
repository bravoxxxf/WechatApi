/**
 * des：微信授权,拉取用户数据并建立对应关系.
 * by: Xie Xiaofei
 * created: 2017/2/7
 * update: 
 *
 */

var https = require('https')
// var http = require('http')
var path = require('path')
var crypto = require('crypto')
var qs = require('querystring')
var utils = require('../../../utils/index.js')
var jwt = utils.jwt;
var ip = utils.ip;

var timeNow = () => {
    return parseInt(Date.now() / 1000);
}

var getAccessToken = (options) => {

    var content = {
        appid: options.appid, // url请求传入
        secret: options.secret,   // 服务器获取
        code: options.code, // url请求传入
        grant_type: 'authorization_code'
    };

    var p = new Promise(function (resolve, reject) {

        var httpReq = https.request({
            hostname: 'api.weixin.qq.com',
            port: 443,
            path: '/sns/oauth2/access_token?' + qs.stringify(content),
            method: 'GET'
        }, function (response) {
            response.on('data', function (data) {
                var accessTokenData = JSON.parse(data);
                if (accessTokenData && accessTokenData.errcode) {
                    reject('access_token error : ' + accessTokenData.errcode);
                    return;
                }
                resolve(accessTokenData);
            });
            response.on('error', function (e) {
                reject(e.message);
            });
        });
        httpReq.end();
    })
    return p;
}


/**
 * 
 * 获得微信服务器的用户基本信息
 * @param {string} accessToken 
 * @param {*} req 
 * @param {*} res 
 */
var getUserinfo = (options) => {
    var content = {
        access_token: options.access_token,
        openid: options.openid,
        lang: 'zh_CN'
    };

    var p = new Promise(function (resolve, reject) {
        var httpReq = https.request({
            hostname: 'api.weixin.qq.com',
            port: 443,
            path: '/sns/userinfo?' + qs.stringify(content),
            method: 'GET'
        }, function (response) {
            response.on('data', function (data) {
                var userInfo = JSON.parse(data);
                if (userInfo && userInfo.errcode) {
                    reject('userinfo error : ' + userInfo.errcode)
                    return;
                }

                resolve(userInfo);
            });
            response.on('error', function (e) {
                reject('userinfo error : ' + e.message)
            });
        });
        httpReq.end();
    })

    return p;

}


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

        let accessTokenData = await getAccessToken({ appid: req.body.appid, secret: secretkey, code: req.body.code });
        let userInfo = await getUserinfo(accessTokenData);
        let token = await jwt.encode(userInfo.openid);

        return res.send({ userInfo: userInfo, token: token });

    } catch (error) {
        console.log(error);
        return res.send({ error_code: 1, msg: error });
    }

})
