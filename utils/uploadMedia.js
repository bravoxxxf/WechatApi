// var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs')
var amrToMp3 = require('./amrToMp3.js')


// path : 当前项目的文件夹

// 参数1：音频二进制文件
// 参数2：url文件地址
var uploadVoice = async (amrBuffer, path) => {
    var root =  "/home/mydisk/xxx/xxx/upload/" + path + '/'; // 此处使用自己的硬盘地址拼接
    var time = new Date();
    var rand = time.getTime() + Math.floor(Math.random() * 100)
    var amrName = rand + '.amr';
    var mp3Name = rand + '.mp3';

    var amrLocalPath = root + amrName;  // 本地amr
    var mp3LocalPath = root + mp3Name;  // 本地mp3

    var state = fs.writeFileSync(amrLocalPath, amrBuffer);

    var result = await amrToMp3(amrLocalPath, mp3LocalPath);

    var mp3UrlPath = "http://xxx.xxx.xxx/upload/" + path + '/' + mp3Name;  // 此处使用自己的域名拼接
    return mp3UrlPath;
}

// 参数1：图片文件
// 参数2：url文件地址
var uploadImg = (imgBuffer, path) => {
    var root =  "/home/mydisk/xxx/xxx/upload/" + path + '/'; // 此处使用自己的域名拼接
    var time = new Date();
    var rand = time.getTime() + Math.floor(Math.random() * 100)
    var imgName = rand + '.png';

    var imgLocalPath = root + imgName;  // 本地amr
    var imgRemotePath = "http://xxx.xxx.xxx/upload/" + path + '/' + imgName;  // 本地mp3 // 此处使用自己的域名拼接

    var state = fs.writeFileSync(imgLocalPath, imgBuffer);

    return imgRemotePath;
}


module.exports = {
    uploadVoice: uploadVoice,
    uploadImg: uploadImg
};