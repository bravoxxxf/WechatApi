/**
 * 
 * 刷新token函数  (有效期内就可刷新)
 * 
 * created by 谢晓飞
 * Date 2017.2.8
 * 
 */

var path = require('path')
var jwt = require('../../../utils/index.js').jwt

var url = path.basename(__filename, '.js')
var CLIENT_TOKEN = 'Authorization';
var timeNow = () => {
    return parseInt(Date.now() / 1000);
}

server.post({ url: url, name: url }, async function (req, res) {

    try {

        let tokenData = await jwt.decode(req.body.token);
        let tokenStr = await jwt.encode(tokenData.userid)

        return res.send({ token: tokenStr });

    } catch (error) {
        console.log(error)
        return res.send({ error_code: 1, msg: error });

    }

})