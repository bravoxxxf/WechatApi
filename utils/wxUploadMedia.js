
// 根据微信资源ID下载图片到指定路径



// 上传图片/音频操作方式：

// wxUploadMedia.uploadImg(appid, 微信资源ID, 文件夹名字)
// wxUploadMedia.uploadImgWithFile(图片数据流, 文件夹名字)
// 返回值：资源url路径


var fs = require('fs')
var http = require('http')
var uploadMedia = require('./uploadMedia.js')
var getToken = require('../src/common/wechat_jssdk/jssdk_access_token.js')


// 根据id请求文件数据

var request = (accessToken, mediaId) => {

    const options = {
        hostname: "file.api.weixin.qq.com",
        port: 80,
        path: "/cgi-bin/media/get?access_token=" + accessToken + "&media_id=" + mediaId,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var p = new Promise(function (resolve, reject) {
        var bufferList = [];
        var httpReq = http.request(options, function (hRes) {
            hRes.on('data', function (res) {
                bufferList.push(res);
            });
            hRes.on('end', function (res) {
                resolve(Buffer.concat(bufferList));
            });
            hRes.on('error', function (e) {
                console.log('problem with request: ' + e.message);
                reject('problem with request: ' + e.message);
            });
        });
        httpReq.end();
    })
    return p;
}



var uploadVoice = async (appid, mediaId, path) => {

    var accessToken = await getToken({ body: { appid: appid } }) // 获得accesstoken

    var amrBuffer = await request(accessToken, mediaId); // 获得文件数据流

    var mp3UrlPath = uploadMedia.uploadVoice(amrBuffer, path);

    return mp3UrlPath;
}

var uploadImg = async (appid, mediaId, path) => {

    var accessToken = await getToken({ body: { appid: appid } }) // 获得accesstoken

    var imgBuffer = await request(accessToken, mediaId); // 获得文件数据流

    var path = uploadMedia.uploadImg(imgBuffer, path);

    return path;
}

// var uploadImgWithFile = (imgBuffer, path) => {

//     var path = uploadMedia.uploadImg(imgBuffer, path);

//     return path;
// }


module.exports = {
    uploadVoice: uploadVoice,
    uploadImg: uploadImg

};