var shell = require('shelljs');
var fs = require('fs');
var readline = require('readline');
var Promise = require('bluebird');


exports.resolve04Temperature = function(name, step, max, min, startTime, endTime, exclude, placeholder) {
    return new Promise(function(resolve, reject) {
        exclude = exclude.split(',').map(each => +each);
        step = step || 1000;
        max = max || 100;

        if (!fs.existsSync('./files/' + name)) {
            return reject(new Error("文件不存在"));
        }

        var stat = fs.statSync('./files/' + name);
        console.log(stat)
        if (stat.size < 1024 * 1024) {
            step = 1;
        } else if (stat.size < 10 * 1024 * 1024) {
            step = 10;
        } else if (stat.size < 50 * 1024 * 1024) {
            step = 50;
        } else if (stat.size < 100 * 1024 * 1024) {
            step = 100;
        } else if (stat.size < 200 * 1024 * 1024) {
            step = 1000;
        } else if (stat.size < 500 * 1024 * 1024) {
            step = 10000;
        } else {
            return reject(new Error("文件太大无法解析"));
        }
        console.log(step)

        var rl = readline.createInterface({
            input: fs.createReadStream('./files/' + name),
            output: null,
            terminal: false
        });
        var xdata = {
            time: [],
            temperature: [],
            temperature2: [],
            temperature3: []
        };
        var index = 0;
        rl.on('line', function(line) {
            var reg = /\[[^.]+\.\d{3} Info\] receive ->90,04[^<]+(?=\<- receive end)/;
            if (line.match(reg)) {
                index++;
                if (index % step == 0) {
                    var x = resolve04Str(line, max, min, exclude);

                    if (x.isEvil) {
                        if (!placeholder) {
                            return;
                        } else {
                            x.data = null;
                            x.data2 = null;
                            x.data3 = null;
                        }
                    }

                    if (startTime && startTime > x.time) {
                        return;
                    }

                    if (endTime && endTime < x.time) {
                        return;
                    }

                    xdata.time.push(x.time);
                    xdata.temperature.push(x.data);
                    xdata.temperature2.push(x.data2);
                    xdata.temperature3.push(x.data3);
                }
            }
        });

        rl.on('close', function() {
            return resolve(xdata);
        });

        rl.on('error', function(err) {
            return reject(err);
        })
    });
}

function resolve04Str(str, max, min, exclude) {
    max = max || 100;
    min = min || 0;
    var ret = {}
    var time = str.match(/\[[^\|]+(?=Info\])/);
    if (time && time[0]) {
        ret.time = time[0].slice(1).trim().slice(0, -7);
    }

    var data = str.match(/-\>90,04.+(?=\<)/)

    if (data && data[0]) {
        if (exclude.indexOf(1) == -1)
            ret.data = parseInt(data[0].slice(8, 13).split(',').join(''), 16) / 10;
        if (exclude.indexOf(2) == -1)
            ret.data2 = parseInt(data[0].slice(13, 19).split(',').join(''), 16) / 10;
        if (exclude.indexOf(3) == -1)
            ret.data3 = parseInt(data[0].slice(19, 25).split(',').join(''), 16) / 10;
    }

    if (ret.time &&
        (ret.data === undefined || (ret.data <= max && ret.data >= min)) &&
        (ret.data2 === undefined || (ret.data2 <= max && ret.data2 >= min)) &&
        (ret.data3 === undefined || (ret.data3 <= max && ret.data3 >= min))) {
        return ret;
    } else {
        ret.isEvil = true;
        return ret;
    }

}

exports.resolve09Temperature = function(name, step, max, min, startTime, endTime, exclude, placeholder) {
    return new Promise(function(resolve, reject) {
        exclude = exclude.split(',').map(each => +each);
        step = step || 1000;
        max = max || 100;

        if (!fs.existsSync('./files/' + name)) {
            return reject(new Error("文件不存在"));
        }

        var stat = fs.statSync('./files/' + name);
        console.log(stat)
        if (stat.size < 1024 * 1024) {
            step = 1;
        } else if (stat.size < 10 * 1024 * 1024) {
            step = 10;
        } else if (stat.size < 50 * 1024 * 1024) {
            step = 50;
        } else if (stat.size < 100 * 1024 * 1024) {
            step = 100;
        } else if (stat.size < 200 * 1024 * 1024) {
            step = 1000;
        } else if (stat.size < 500 * 1024 * 1024) {
            step = 10000;
        } else {
            return reject(new Error("文件太大无法解析"));
        }
        console.log(step)

        var rl = readline.createInterface({
            input: fs.createReadStream('./files/' + name),
            output: null,
            terminal: false
        });
        var xdata = {
            s90: {
                time: [],
                temperature: [],
                temperature2: [],
                temperature3: []
            },
            sa0: {
                time: [],
                temperature: [],
                temperature2: [],
                temperature3: []
            },
            sa1: {
                time: [],
                temperature: [],
                temperature2: [],
                temperature3: []
            }
        };

        var index = {
            '90': 0,
            'a0': 0,
            'a1': 0,
        }

        rl.on('line', function(line) {
            var reg = /\[[^.]+\.\d{3} Info\] receive ->(\w{2}),04[^<]+(?=\<- receive end)/;
            if (line.match(reg) && RegExp.$1) {
                index[RegExp.$1]++;

                if (index[RegExp.$1] % step == 0) {
                    var x = resolve09Str(line, max, min, exclude);

                    if (x.isEvil) {
                        if (!placeholder) {
                            return;
                        } else {
                            x.data = null;
                            x.data2 = null;
                            x.data3 = null;
                        }
                    }

                    if (startTime && startTime > x.time) {
                        return;
                    }

                    if (endTime && endTime < x.time) {
                        return;
                    }
                    xdata['s' + x.s].time.push(x.time);
                    xdata['s' + x.s].temperature.push(x.data);
                    xdata['s' + x.s].temperature2.push(x.data2);
                    xdata['s' + x.s].temperature3.push(x.data3);
                }
            }
        });

        rl.on('close', function() {
            return resolve(xdata);
        });

        rl.on('error', function(err) {
            return reject(err);
        })
    });
}

function resolve09Str(str, max, min, exclude) {
    max = max || 100;
    min = min || 0;
    var ret = {}
    var time = str.match(/\[[^\|]+(?=Info\])/);
    if (time && time[0]) {
        ret.time = time[0].slice(1).trim().slice(0, -7);
    }

    var data = str.match(/-\>(90|a0|a1),04.+(?=\<)/);

    if (data && data[0] && RegExp.$1) {
        ret.s = RegExp.$1;
        if (exclude.indexOf(1) == -1)
            ret.data = parseInt(data[0].slice(8, 13).split(',').join(''), 16) / 10;
        if (exclude.indexOf(2) == -1)
            ret.data2 = parseInt(data[0].slice(13, 19).split(',').join(''), 16) / 10;
        if (exclude.indexOf(3) == -1)
            ret.data3 = parseInt(data[0].slice(19, 25).split(',').join(''), 16) / 10;
    }

    if (ret.time &&
        (ret.data === undefined || (ret.data <= max && ret.data >= min)) &&
        (ret.data2 === undefined || (ret.data2 <= max && ret.data2 >= min)) &&
        (ret.data3 === undefined || (ret.data3 <= max && ret.data3 >= min))) {
        return ret;
    } else {
        ret.isEvil = true;
        return ret;
    }

}

exports.resolveGas = function(name, step, max, min, startTime, endTime, exclude, placeholder) {
    exclude = exclude.split(',').map(each => +each);
    console.time('x')
    step = step || 1000;
    max = max || 100;
    var p = shell.grep('receive ->91,04', './files/' + name)
    var arr = p.stdout.split('\n');
    var xdata = {
        time: [],
        temperature: [],
        temperature2: []
    };
    console.timeEnd('x')

    console.time('y');
    for (var i = 0; i < arr.length; i += step) {
        var each = arr[i];
        if (!each) continue;
        var x = resolveGasStr(each, max, min, exclude);

        if (x.isEvil) {
            if (!placeholder) {
                continue;
            } else {
                x.data = null;
                x.data2 = null;
            }
        }

        if (startTime && startTime > x.time) {
            continue;
        }

        if (endTime && endTime < x.time) {
            continue;
        }

        xdata.time.push(x.time);
        xdata.temperature.push(x.data);
        xdata.temperature2.push(x.data2);
    }
    console.timeEnd('y')

    return xdata;
}

function resolveGasStr(str, max, min, exclude) {
    max = max || 100;
    min = min || 0;
    var ret = {}
    var time = str.match(/\[[^\|]+(?=Info\])/);
    if (time && time[0]) {
        ret.time = time[0].slice(1).trim().slice(0, -7);
    }

    var data = str.match(/-\>91,04.+(?=\<)/)

    if (data && data[0]) {
        if (exclude.indexOf(1) == -1)
            ret.data = parseInt(data[0].slice(8, 13).split(',').join(''), 16);
        if (exclude.indexOf(2) == -1)
            ret.data2 = parseInt(data[0].slice(13, 19).split(',').join(''), 16);
    }

    if (ret.time &&
        (ret.data === undefined || (ret.data <= max && ret.data >= min)) &&
        (ret.data2 === undefined || (ret.data2 <= max && ret.data2 >= min))) {
        return ret;
    } else {
        ret.isEvil = true;
        return ret;
    }

}