/**
 * des：jssdk相关,获取微信服务器的ticket.
 * by: Xie Xiaofei
 * created: 2017/1/20
 * update: 2017/1/21
 * 
 */

// var crypto = require('crypto')
var qs = require('querystring');
var https = require('https')

var ticketMap = new Map();


var timeNow = () => {
    return parseInt(Date.now() / 1000);
}

var ticket = (access_token, req, cb) => {

    var ticketItem = ticketMap.get(req.body.appid);

    // 从缓存中拿到ticket
    if (ticketItem && ticketItem.ticketStr && ticketItem.ticketExp && ticketItem.ticketExp > timeNow()) {

        cb(ticketItem.ticketStr);

    } else {
        // 申请新的ticket并写入map缓存
        var content = {
            access_token: access_token,
            type: 'jsapi'
        };
        content = qs.stringify(content);

        var httpReq = https.request({
            hostname: 'api.weixin.qq.com',
            port: 443,
            path: '/cgi-bin/ticket/getticket?' + content,
            method: 'GET'
        }, function (hRes) {
            hRes.on('data', function (res) {
                var obj = JSON.parse(res);
                var ticket_str = obj.ticket;
                var ticket_exp = timeNow() + obj.expires_in; // 全局缓存
                ticketMap.set(req.body.appid, { ticketStr: ticket_str, ticketExp: ticket_exp });
                cb(ticket_str);
            });
            hRes.on('error', function (e) {
            });
        });
        httpReq.end();
    }

}


module.exports = ticket;