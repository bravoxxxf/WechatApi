/**
 * type: 微信活动
 * des：用户报名.
 * by: Xie Xiaofei
 * created: 2017/2/14
 * lastupdate: 2017/7/7 
 * 
 * url: /checkin
 */


var routerApi = require('../../utils/routeString.js')(__filename, __dirname);
var utils = require('../../utils/index.js')

server.post({ path: routerApi, name: routerApi }, function (req, res, next) {
    var body = req.body;

    return res.send("ok");

})
