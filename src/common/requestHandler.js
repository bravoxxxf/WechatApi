/**
 * 请求处理
 * 
 * 
 * 
 * 
 */
var errs = require('restify-errors');

const os = require('os')

let ALLOW_ORIGIN = ['*'];

// 限制跨域域名
// 如果本地运行、可以不限制域名
if ((os.platform() == "win32") || (os.platform() == "darwin")) {
    
} else {
    ALLOW_ORIGIN = [
        'servicewechat.com', 
    ];
}

var ALLOW_HEADERS = [
    'Accept',
    'Accept-Version',
    'Content-Length',
    'Content-MD5',
    'Content-Type',
    'Date',
    'Api-Version',
    'Response-Time',
    'Authorization'
].join(', ');

var ALLOW_METHODS = [
    'GET',
    'POST',
    'OPTIONS',
    'PUT',
    'DELETE'
].join(',');


///  跨域设置
server.pre(function (req, res, next) {

    let origin = req.headers.referer;

    if (req.method === "GET" && !req.headers.origin) { // 直接性的get请求过滤
        console.log('Get: ' + origin + ' url:' + req.url);
        return next();
    }

    if (origin) {
        origin = (origin ? origin.substr(origin.indexOf('//') + 2, origin.lastIndexOf('/') - origin.indexOf('//') - 2) : "")
    } else {
        origin = "null"
    }
    let msg = origin + '  url:' + req.url;
    console.log(msg);

    for (let i = 0; i < ALLOW_ORIGIN.length; i++) {
        if ((req.headers.origin && (req.headers.origin.indexOf(ALLOW_ORIGIN[i]) >= 0)) || ALLOW_ORIGIN[i] === '*' || (origin && origin.indexOf(ALLOW_ORIGIN[i]) >= 0)) {
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || origin);
            res.setHeader('Access-Control-Allow-Headers', ALLOW_HEADERS);
            res.setHeader('Access-Control-Allow-Methods', ALLOW_METHODS);
            res.setHeader('Allow', ALLOW_METHODS);

            if (req.method === "OPTIONS") {
                return res.send();
            } else {
                return next();
            }

        }
    }

    return res.send(new errs.UnauthorizedError());
});
