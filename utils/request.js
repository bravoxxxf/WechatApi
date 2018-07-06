/**
 * 
 * 同步请求封装
 * 
 */

var https = require('https')
var qs = require('querystring');

const request = (options) => {

    var p = new Promise(function (resolve, reject) {

        var httpReq = https.request({
            hostname: options.hostname,
            port: options.port,
            path: options.path,
            method: options.method,
            headers: options.headers
        }, function (res) {
            res.on('data', function (res) {
                console.log(`BODY: ${res}`);
                resolve(res);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });

        });

        httpReq.on('error', function (e) {
            console.error(`problem with request: ${e.message}`);
        });

        if (options.data) {
            httpReq.end(options.data);
        } else {
            httpReq.end();
        }
        
    })

    return p;

}

module.exports = request;