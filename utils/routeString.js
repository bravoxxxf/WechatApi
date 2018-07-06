var path = require('path')

const routeString = function (filename, dirname) {
    var basename = path.basename(filename, '.js')
    var routerApi = dirname.substr(dirname.indexOf('src') + 3) + '/' + basename;

    // 处理window和linux不同斜杠
    return routerApi.replace(/\\/g, '\/');
}

module.exports = routeString;