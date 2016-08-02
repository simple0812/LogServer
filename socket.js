var net = require('net');
var fsx = require('fs-extra');
var config = require('./config');
var fileSize = require('filesize');

var timeout = 20000;//超时
var listenPort = 3000;//监听端口

var server = net.createServer(function(socket){
    socket.setEncoding('binary');

    socket.on('data',function(data){
        if(!data) return;
        console.log(data);
        var reg = /\[[^\[]*\|/ig;
        var localIps = data.match(reg) || ['[default|'];
        var localIp = localIps[0].slice(1,-1);


        var msg = data.replace(reg, "\n[");

        var filename = config.FILE_DIR + localIp;
        fsx.ensureFileSync(filename);
        fsx.appendFile(filename, msg, function (err) {
            if(err) {
              console.log(err.message);
            }
        });
    });

    //数据错误事件
    socket.on('error',function(exception){
        console.log('socket error:' + exception);
        socket.end();
    });
    //客户端关闭事件
    socket.on('close',function(data){
        console.log('close: ' +
            socket.remoteAddress + ' ' + socket.remotePort);

    });

}).listen(listenPort);

//服务器监听事件
server.on('listening',function(){
    console.log("server listening:" + server.address().port);
});

//服务器错误事件
server.on("error",function(exception){
    console.log("server error:" + exception);
});