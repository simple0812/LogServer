var net = require('net');
var fsx = require('fs-extra');
var fs = require('fs');
var config = require('./config');
var fileSize = require('filesize');
var shell = require('shelljs');
var cache = require('./utils/cacheHelper');

var timeout = 20000; //超时
var listenPort = process.env.LOG_SOCKET_PORT || config.LOG_SOCKET_PORT; //监听端口

var server = net.createServer(function(socket) {
    socket.setEncoding('binary');

    socket.localIp = 'default';
    socket.on('data', function(data) {
        if (!data) return;
        // console.log(data);
        var reg = /\[[^\[]*\|/ig;
        var localIps = data.match(reg) || ['[default|'];
        var localIp = localIps[0].slice(1, -1);
        if (socket.localIp == 'default' && localIp != 'default') {
            socket.localIp = localIp.replace(/\./ig, '_');
        }

        var msg = data.replace(reg, "\n[");

        var filename = config.FILE_DIR + socket.localIp;
        fsx.ensureFileSync(filename);

        try {

            fs.appendFile(filename, msg, function(err) {
                if (err) return console.log(err.message);
                cache.set(socket.localIp, msg);
            });
            // var x = shell.echo(msg).toEnd(filename);
            // cache.set(socket.localIp, msg);
        } catch (e) {
            console.log(e.message);
        }

    });

    //数据错误事件
    socket.on('error', function(exception) {
        console.log('socket error:' + exception);
        socket.end();
    });
    //客户端关闭事件
    socket.on('close', function(data) {
        console.log('close: ' +
            socket.remoteAddress + ' ' + socket.remotePort);

    });

}).listen(listenPort);

//服务器监听事件
server.on('listening', function() {
    console.log("server listening:" + server.address().port);
});

//服务器错误事件
server.on("error", function(exception) {
    console.log("server error:" + exception);
});