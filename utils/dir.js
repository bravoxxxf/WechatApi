var path = require('path');
var fs = require('fs');
var watch = require('watch');
var dateHelper = require('./date.js');
var isDir = (baseName) => {
    var ext = path.extname(baseName);
    if (ext === '') {
        return true;
    } else {
        return false;
    }
}


var requireDir = (dir) => {
    var files = fs.readdirSync(dir);
    files.forEach((dirOrFile) => {
        if (path.extname(dirOrFile) === '') { // dir
            var abPath = path.format({
                dir: dir,
                base: dirOrFile
            })
            ///loadFileWithDir(abPath) 不遍历子节点了，手动，比较安全
        } else { // file
            var url = path.format({ dir: dir, base: dirOrFile })
            try {
                require(url)
                console.log("'" + dirOrFile + "'" + ' module is mounted !')
            } catch (e) {
                console.error(e);
            }
        }
    })
};

var requireDirRecursive = (dir) => {
    var files = fs.readdirSync(dir);
    files.forEach((dirOrFile) => {
        if (path.extname(dirOrFile) === '') { // dir
            var abPath = path.format({
                dir: dir,
                base: dirOrFile
            })
            requireDirRecursive(abPath)
        } else { // file
            var url = path.format({ dir: dir, base: dirOrFile })
            try {
                require(url)
                // console.log("'" + url + "'" + ' module is mounted !')
            } catch (e) {
                console.error(e);
            }
        }
    })
};

/**
 * 监听文件变化，增加路由或更新路由 (热更新只监听业务逻辑)
 */

var hotUpdate = function (server, dirname) {
    watch.createMonitor(dirname, function (monitor) {
        // monitor.files['./test/watch/floor/t2.js'] // Stat object for my zshrc.
        monitor.on("created", function (f, stat) {
            var baseName = path.basename(f);
            if (isDir(baseName)) return;

            // 新增模块
            try {

                require(f);
                console.log(dateHelper.now() + "  '" + f + "'" + ' New module !')
            } catch (e) {
                console.error(e);
            }
        });

        monitor.on("changed", function (f, curr, prev) {
            let epath = f.substr(f.indexOf('src') + 3);
            let name = epath.substr(0, epath.indexOf('.js'));
            let routerName = name.replace(/\\/g, '\/');
            let systemGiveName = routerName.split('/').join('');

            // 如果修改的不是文件，就退出
            if (isDir(epath)) return;

            // 更新路由 （删除指定或未指定的路由）
            // 删除缓存
            try {
                for (let i in server.routes) {
                    if ((i === routerName) || i.indexOf(systemGiveName) >= 0) {
                        server.rm(i);
                        console.log(i + ' router update!')
                    }
                }

                delete require.cache[f];
                require(f);
                console.log("'" + name + "'" + " module update !")
            } catch (e) {
                console.error(e);
            }
        });

        monitor.on("removed", function (f, stat) {
            let epath = f.substr(f.indexOf('src') + 3);
            let name = epath.substr(0, epath.indexOf('.js'));
            let routerName = name.replace(/\\/g, '\/');
            let systemGiveName = routerName.split('/').join('');
            // 如果修改的不是文件，就退出
            if (isDir(epath)) return;

            // 删除路由 
            // 删除缓存
            try {
                for (let i in server.routes) {
                    if ((i === routerName) || i.indexOf(systemGiveName) >= 0) {
                        server.rm(i);
                        console.log(i + ' router removed!')
                    }
                }
                delete require.cache[f];
                console.log("'" + name + "'" + " module removed !")
            } catch (e) {
                console.error(e);
            }

        })
    })
}



module.exports = {
    requireDir: requireDir,
    requireDirRecursive: requireDirRecursive,
    hotUpdate: hotUpdate
}