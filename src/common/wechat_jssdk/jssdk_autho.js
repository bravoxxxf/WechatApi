
/**
 * des：jssdk的授权请求,用于配置wx.config.
 * by: Xie Xiaofei
 * created: 2017/1/20
 * update: 2017/1/20
 * 
 */

var path = require('path')
var moduleUrl = path.basename(__filename, '.js');

var token = require('./jssdk_access_token');
var ticket = require('./jssdk_ticket');
var sign = require('./jssdk_sign');


// req.params.appid
server.post({ path: moduleUrl, name: moduleUrl }, async function (req, res, next) {
    var tokenStr = await token(req)
    ticket(tokenStr, req, (ticketStr) => {
        var ret = sign(ticketStr, req.header('Referer'));
        return res.send(ret);
    })

})
