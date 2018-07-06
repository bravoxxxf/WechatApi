/**
 * des：第三放授权
 * by: Xie Xiaofei
 * created: 2017/8/24
 * update: 
 * 
 *
 */

var path = require('path')


// body : code & appid
var url = path.basename(__filename, '.js')
server.get({ url: url, name: url }, function (req, res, next) {

    var body = req.query;

    if (!body.code || !body.reuri) {
        return res.send({ error_code: 1, data: '请传入正确的reuri和code' });
    }

    // 传值参数链接处理
    var newUri;
    if (body.reuri.indexOf('?') >= 0) {
        newUri = body.reuri + '&code=' + body.code;
    } else {
        newUri = body.reuri + '?code=' + body.code;
    }

    res.redirect(newUri, next)
})
