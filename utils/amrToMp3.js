var ffmpeg = require('fluent-ffmpeg');
var fs = require('fs')

// path : 当前项目的文件夹
// return: 音频文件
var amrToMp3 = (amrName, mp3Name) => {

    var p = new Promise(function (resolve, reject) {
        var command = ffmpeg(amrName)
            .on('end', function () {
                resolve(mp3Name);
            })
            .on('error', function (err) {
                reject(err.message);
            })
            .save(mp3Name);
    })

    return p;
}

module.exports = amrToMp3;