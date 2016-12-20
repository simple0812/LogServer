var shell = require('shelljs');

exports.resolveTemperature = function(name, step, max, min, startTime, endTime, placeholder) {
    console.time('x')
    step = step || 1000;
    max = max || 100;
    var p = shell.grep('receive ->90,03', './files/' + name)
    var arr = p.stdout.split('\n');
    var xdata = {
        time: [],
        temperature: []
    };
    console.timeEnd('x')

    console.time('y');
    for (var i = 0; i < arr.length; i += step) {
        var each = arr[i];
        if (!each) continue;
        var x = resolveStr(each, max, min);

        if (x.isEvil) {
            if (!placeholder) {
                continue;
            } else {
                x.data = null;
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
    }
    console.timeEnd('y')

    return xdata;
}

exports.resolve04Temperature = function(name, step, max, min, startTime, endTime, exclude, placeholder) {
    exclude = exclude.split(',').map(each => +each);
    console.time('x')
    step = step || 1000;
    max = max || 100;
    var p = shell.grep('receive ->90,04', './files/' + name)
    var arr = p.stdout.split('\n');
    var xdata = {
        time: [],
        temperature: [],
        temperature2: [],
        temperature3: []
    };
    console.timeEnd('x')

    console.time('y');
    for (var i = 0; i < arr.length; i += step) {
        var each = arr[i];
        if (!each) continue;
        var x = resolve04Str(each, max, min, exclude);

        if (x.isEvil) {
            if (!placeholder) {
                continue;
            } else {
                x.data = null;
                x.data2 = null;
                x.data3 = null;
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
        xdata.temperature3.push(x.data3);
    }
    console.timeEnd('y')

    return xdata;
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

function resolveStr(str, max, min) {
    max = max || 100;
    min = min || 0;

    var ret = {}
    var time = str.match(/\[[^\|]+(?=Info\])/);
    if (time && time[0]) {
        ret.time = time[0].slice(1).trim().slice(0, -7);
    }

    var data = str.match(/-\>90,03.+(?=\<)/)

    if (data && data[0]) {
        ret.data = parseInt(data[0].slice(8, 13).split(',').join(''), 16) / 10;
    }

    if (ret.time && ret.data && ret.data <= max && ret.data >= min) {
        return ret;
    } else {
        ret.isEvil = true;
        return ret;
    }
}

exports.resolve09Temperature = function(name, step, max, min, startTime, endTime, exclude, placeholder) {
    exclude = exclude.split(',').map(each => +each);
    console.time('x')
    step = step || 1000;
    max = max || 100;
    var p = shell.grep('receive ->90,04\|receive ->a0,04\|receive ->a1,04', './files/' + name);
    var arr = p.stdout.split('\n');
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
    console.timeEnd('x')

    console.time('y');
    for (var i = 0; i < arr.length; i += step) {
        var each = arr[i];
        if (!each) continue;
        var x = resolve09Str(each, max, min, exclude);

        if (x.isEvil) {
            if (!placeholder) {
                continue;
            } else {
                x.data = null;
                x.data2 = null;
                x.data3 = null;
            }
        }

        if (startTime && startTime > x.time) {
            continue;
        }

        if (endTime && endTime < x.time) {
            continue;
        }
        xdata['s' + x.s].time.push(x.time);
        xdata['s' + x.s].temperature.push(x.data);
        xdata['s' + x.s].temperature2.push(x.data2);
        xdata['s' + x.s].temperature3.push(x.data3);
    }
    console.timeEnd('y')

    return xdata;
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