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

exports.render = function(req, res, next) {
  res.render('file');
};

exports.renderLog = function(req, res, next) {
  res.render('file/log');
};

exports.writeLog = function(req, res, next) {
  var name = req.query.name || 'default';
  var data = req.query.data || '';
  if(data === '') {
    return res.json(jsonHelper.getError('data is empty'));
  }

  var filename = config.FILE_DIR + name;
  fsx.ensureFileSync(filename);
  fsx.appendFile(filename, data+'\r\n', function (err) {
    if (err) {
      return res.json(jsonHelper.getError(err.message));
    }

    res.json(jsonHelper.getSuccess("ok"));
  });
};

exports.readLog = function(req, res, next) {
  var name = req.query.name || 'default';
  var line = +req.query.line || 20;
  var filename = `${config.FILE_DIR}${name}`;

  var result =shell.tail({'-n': line}, filename);
  res.json(jsonHelper.getSuccess(result));
};

exports.upload = function(req, res, next) {
  var filename = req.headers['filename'];
  if(!filename) {
    return res.json(jsonHelper.getError('文件名称不存在'));
  }

  var bufferHelper = new BufferHelper();

  req.on("data", function (chunk) {
    bufferHelper.concat(chunk);
  });

  req.on('end', function () {
    var data = bufferHelper.toBuffer().toString();
    fs.writeFile(config.FILE_DIR + filename, data, function(err) {
      if(err)
        return res.json({status:'fail', result: err.message});
      
      res.json(jsonHelper.getSuccess("上传成功"));
    });

  });
};

exports.download = function(req, res, next) {
  var filename = req.query.filename;

  if(!fs.existsSync(config.FILE_DIR + filename)) {
    return res.json(jsonHelper.getError('文件名称不存在'));
  }

  res.setHeader("Content-type", 'application/octet-stream');
  res.setHeader("Content-Disposition", 'attachment;filename='+filename + ";");
  
  res.sendFile(config.FILE_DIR + filename);
};



exports.retrieve = function(req, res, next) {
  proxy.User.retrieve().then(function(data) {
    res.json(jsonHelper.getSuccess(data));
  });
};

exports.delete = function(req, res, next) {
  var files = req.body;
  if(!files || files.length == 0)
    return res.json(jsonHelper.getError('文件名称不存在'));

  var rm = Promise.promisify(fs.unlink);

  Promise.all(files.map(each => {return rm(config.FILE_DIR  + each);})).then(result => {
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
      if(err)
        return res.json(jsonHelper.getError(err.message));
      if(keyword) {
        files = files.filter(each => {return each.indexOf(keyword) != -1;});
      }

      res.json(jsonHelper.pageSuccess(files.splice(firNum, pageSize).map(each => {
        var fileState = fs.statSync(config.FILE_DIR + each);
        var now = moment();
        var lastModifyTime = moment(fileState.mtime);
        //console.log(now.format('YYYY-MM-DD HH:mm:ss'), lastModifyTime.format('YYYY-MM-DD HH:mm:ss'))
        return {filename : each, id:each, isRunning: now.diff(lastModifyTime, 'seconds') < 5 ?'运行' : '停止'};
      }), files.length));
    });
};