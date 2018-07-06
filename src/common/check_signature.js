/**
 * 此路由是验证微信绑定域名有效性的功能，请不要主动请求此路由
 * 
 * Please do not take the initiative to request this route
 */

var path = require('path')
var crypto = require('crypto')
var url = path.basename(__filename, '.js')
server.get({ url: url, name: url }, function (req, res) {
    var body = req.query;
    var signature = body.signature;
    // console.log("正在请求 signature ： " + signature);
    
    var oriArray = new Array();
    oriArray[0] = 'xxx';
    oriArray[1] = body.timestamp;
    oriArray[2] = body.nonce;
    oriArray.sort();
    var original = oriArray.join('');

    const hash = crypto.createHash('sha1');
    hash.update(original)

    if (hash.digest('hex') == body.signature) {
        console.log(body.echostr)
        res.setHeader('Content-Type', 'text/plain');
        return res.end(body.echostr);
    } else {
        return res.end({ error_code: 0 , msg:"验证错误"});
    }
})