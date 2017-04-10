var net = require('net');
var fsx = require('fs-extra');
var fs = require('fs');
var url = require('url');
var config = require('./config');
var fileSize = require('filesize');
var shell = require('shelljs');
var models = require('./models');

function writeLog(localIp, msg, index) {
    index = index || 0;
    var filename = config.FILE_DIR + localIp + (index ? '_' + index : '');
    fsx.ensureFileSync(filename);
    var size = fs.statSync(filename).size;

    if (size > 100 * 1024 * 1024) {
        writeLog(localIp, msg, index + 1);
        return;
    }

    try {
        fs.appendFile(filename, msg, function(err) {
            if (err) return console.log(err.message);
            wss.broadcastTo(msg, localIp + (index ? '_' + index : ''))
        });
    } catch (e) {
        console.log(e.message);
    }
}

module.exports = function(wss) {
    wss.on('connection', function connection(ws) {
        var location = url.parse(ws.upgradeReq.url, true);
        console.log(location);
        console.log('ws connect')
        if (location.pathname == '/browser') {
            ws.xname = location.query.name;
            ws.xtype = 'browser';
        }

        ws.on('message', function incoming(data) {
            if (!data) return;
            var reg = /\[[^\[]*\|/ig;
            var localIps = data.match(reg) || ['[default|'];
            var localIp = localIps[0].slice(1, -1);

            if (localIp != "default") {
                var ip = localIp.replace(/\./ig, '_');
                var msg = data.replace(reg, "\n[");

                writeLog(ip, msg);
            }

        });

        ws.on('close', function close() {
            console.log('websocket disconnected');
        });

        // ws.send(JSON.stringify({ a: '1' }));
    });
}