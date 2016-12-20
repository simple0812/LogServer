var BufferHelper = require('bufferhelper');
var config = require('../config');
var fs = require('fs');
var fsx = require('fs-extra');
var request = require('request');
var Promise = require('bluebird');
var jsonHelper = require('../utils/jsonHelper');
var logger = require('../utils/logger');
var shell = require('shelljs');
var moment = require('moment');
var fileSize = require('filesize');
var cache = require('../utils/cacheHelper');
var proxy = require('../proxy/');


exports.render = function(req, res, next) {
    res.render('file');
};

exports.renderLog = function(req, res, next) {
    res.render('file/log');
};

exports.renderStat = function(req, res, next) {
    res.render('file/stat');
};

exports.stat = function(req, res, next) {
    var step = +req.query.step || 100;
    var name = req.query.name;
    var max = +req.query.max || 100;
    var min = +req.query.min || 0;
    var type = +req.query.type || 3;
    var startTime = req.query.starttime;
    var endTime = req.query.endtime;
    var exclude = req.query.exclude || '';
    var placeholder = req.query.placeholder || false;

    if (step < 0) step = 1;

    if (type == 4) {
        res.json(proxy.Iot.resolve04Temperature(name, step, max, min, startTime, endTime, exclude, placeholder));
    } else if (type == 9) {
        res.json(proxy.Iot.resolve09Temperature(name, step, max, min, startTime, endTime, exclude, placeholder));
    } else {
        res.json(proxy.Iot.resolveTemperature(name, step, max, min, startTime, endTime, placeholder));
    }
};

exports.writeLog = function(req, res, next) {
    var name = req.query.name || 'default';
    var data = req.query.data || '';
    if (data === '') {
        return res.json(jsonHelper.getError('data is empty'));
    }

    var msg = data + '\r\n';

    var filename = config.FILE_DIR + name;
    fsx.ensureFileSync(filename);
    try {
        var x = shell.echo(msg).toEnd(filename);
    } catch (e) {
        console.log(e.message + "....");
    }

    res.json(jsonHelper.getSuccess("ok"));
};

exports.readLog = function(req, res, next) {
    var name = req.query.name || 'default';
    var line = +req.query.line || 20;
    var filename = `${config.FILE_DIR}${name}`;

    fsx.ensureFileSync(filename);

    var x = cache.getByKey(name);
    if (x && x.length) {
        return res.json(jsonHelper.getSuccess(x.join('\n')));
    }
    var result = shell.tail({
        '-n': line
    }, filename);
    cache.set(name, result.split('\n'), true);
    res.json(jsonHelper.getSuccess(result));
};

exports.upload = function(req, res, next) {
    var filename = req.headers['filename'];
    if (!filename) {
        return res.json(jsonHelper.getError('文件名称不存在'));
    }

    var bufferHelper = new BufferHelper();

    req.on("data", function(chunk) {
        bufferHelper.concat(chunk);
    });

    req.on('end', function() {
        var data = bufferHelper.toBuffer().toString();
        fs.writeFile(config.FILE_DIR + filename, data, function(err) {
            if (err)
                return res.json({
                    status: 'fail',
                    result: err.message
                });

            res.json(jsonHelper.getSuccess("上传成功"));
        });

    });
};

exports.download = function(req, res, next) {
    var filename = req.query.filename;

    if (!fs.existsSync(config.FILE_DIR + filename)) {
        return res.json(jsonHelper.getError('文件名称不存在'));
    }

    res.setHeader("Content-type", 'application/octet-stream');
    res.setHeader("Content-Disposition", 'attachment;filename=' + filename + ";");

    res.sendFile(config.FILE_DIR + filename);
};



exports.retrieve = function(req, res, next) {
    proxy.User.retrieve().then(function(data) {
        res.json(jsonHelper.getSuccess(data));
    });
};

exports.delete = function(req, res, next) {
    var files = req.body;
    if (!files || files.length == 0)
        return res.json(jsonHelper.getError('文件名称不存在'));

    var rm = Promise.promisify(fs.unlink);

    Promise.all(files.map(each => {
        return rm(config.FILE_DIR + each);
    })).then(result => {
        res.json(jsonHelper.getSuccess(""));
    }).catch(err => {
        res.json(jsonHelper.getError(err.message));
    });
};

exports.page = function(req, res, next) {
    var pageSize = req.query.pageSize;
    var pageIndex = req.query.pageIndex;
    var firNum = (pageIndex - 1) * pageSize;
    var keyword = req.query.keyword;

    fs.readdir(config.FILE_DIR, function(err, files) {
        if (err)
            return res.json(jsonHelper.getError(err.message));
        if (keyword) {
            files = files.filter(each => {
                return each.indexOf(keyword) != -1;
            });
        }

        var ret = [];

        files.splice(firNum, pageSize).forEach(function(each) {
            try {
                var fileState = fs.statSync(config.FILE_DIR + each);
                var now = moment();
                var lastModifyTime = moment(fileState.mtime);

                ret.push({
                    filename: each,
                    id: each,
                    ctime: moment(fileState.ctime).format('YYYY-MM-DD HH:mm:ss'),
                    size: fileSize(fileState.size),
                    isRunning: now.diff(lastModifyTime, 'seconds') < 65 ? '运行' : '停止'
                });
            } catch (e) {

            }
        });

        res.json(jsonHelper.pageSuccess(ret, files.length));
    });
};