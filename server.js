var restify = require('restify');
var plugins = require('restify-plugins');
var mysql = require('mysql');
var utils = require('./utils/index.js');
var path = require('path');

var server = restify.createServer({
    name: 'api',
    version: '1.0.0'
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.authorizationParser());
server.use(restify.plugins.dateParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.jsonp());
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.jsonBodyParser());
server.use(restify.plugins.fullResponse());
server.use(restify.plugins.pre.context());

// ------------ 设置阀值
server.use(plugins.throttle({
    burst: 1000,
    rate: 500,
    ip: true
}));

// ------------  数据库链接，创建连接池
var dbPool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'xxx',
    password: 'xxx',
    database: 'xxx'
});

// global data
global.dbPool = dbPool;
global.server = server;

// 设置appid 和 秘钥
// 如果管理多个公众号，请使用数据库动态获取秘钥
global.appid = "xxxxxx";
global.appSecret = "xxxxxx"; 

// 加载所有模块
var dir = utils.dir;
dir.requireDirRecursive(path.format({ dir: __dirname, base: 'src' }));

// 监听api
utils.dir.hotUpdate(server, path.format({ dir: __dirname, base: '/src/api' }));

// 监听端口
server.listen(61337, function () {
    console.log('微信后台已启动. 端口：61337');
});


