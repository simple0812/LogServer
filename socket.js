var net = require('net');
var fsx = require('fs-extra');
var fs = require('fs');
var config = require('./config');
var fileSize = require('filesize');
var shell = require('shelljs');
var cache = require('./utils/cacheHelper');
var models = require('./models');

var timeout = 20000; //超时
var listenPort = process.env.LOG_SOCKET_PORT || config.LOG_SOCKET_PORT; //监听端口

function saveLog(str, desc) {
    var reg = /\[([^.]+)\.\d{3} Info\] receive ->(\d{2}),04[^<]+(?=\<- receive end)/;
    var data = str.match(reg);

    if (!data) return console.log("error");
    var time = RegExp.$1
    var deviceId = RegExp.$2
    var start = str.indexOf('receive ->');
    var end = str.indexOf('<- receive end');

    console.log(start, end);
    var metadata = str.slice(start + 10, end);

    var data1 = parseInt(metadata.slice(6, 11).split(',').join(''), 16) / 10;
    var data2 = parseInt(metadata.slice(11, 17).split(',').join(''), 16) / 10;
    var data3 = parseInt(metadata.slice(17, 23).split(',').join(''), 16) / 10;
    console.log(desc)
    models.Log.create({
        description: desc,
        createdAt: time,
        deviceId: parseInt(deviceId, 16),
        data1: data1,
        data2: data2,
        data3: data3,
    }, { raw: true }).then(doc => {}).catch(err => {
        console.log(err.message)
    })
}

var server = net.createServer(function(socket) {
    socket.setEncoding('binary');
    console.log('socket connect')

    socket.localIp = 'default';
    socket.on('data', function(data) {
        if (!data) return;
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