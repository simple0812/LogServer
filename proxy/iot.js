var shell = require('shelljs');

exports.resolveTemperature = function(name, step, max, min) {
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
    var currYearDate = '';
    for (var i = 0; i < arr.length; i += step) {
        var each = arr[i];
        if (!each) continue;
        var x = resolveStr(each, max, min);

        if (!x) continue;
        var xtime = x.time.split(' ');
        if (currYearDate != xtime[0]) {
            currYearDate = xtime[0];
            xdata.time.push(x.time);
        } else {
            xdata.time.push(xtime[1]);
        }

        xdata.temperature.push(x.data);
    }
    console.timeEnd('y')

    return xdata;
}

exports.resolve04Temperature = function(name, step, max, min) {
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
    var currYearDate = '';
    for (var i = 0; i < arr.length; i += step) {
        var each = arr[i];
        if (!each) continue;
        var x = resolve04Str(each, max, min);

        if (!x) continue;
        var xtime = x.time.split(' ');
        if (currYearDate != xtime[0]) {
            currYearDate = xtime[0];
            xdata.time.push(x.time);
        } else {
            xdata.time.push(xtime[1]);
        }

        xdata.temperature.push(x.data);
        xdata.temperature2.push(x.data2);
        xdata.temperature3.push(x.data3);
    }
    console.timeEnd('y')

    return xdata;
}

function resolve04Str(str, max, min) {
    max = max || 100;
    min = min || 0;
    var ret = {}
    var time = str.match(/\[[^\|]+(?=Info\])/);
    if (time && time[0]) {
        ret.time = time[0].slice(1).trim().slice(0, -7);
    }

    var data = str.match(/-\>90,04.+(?=\<)/)

    if (data && data[0]) {
        ret.data = parseInt(data[0].slice(8, 13).split(',').join(''), 16) / 10;
        ret.data2 = parseInt(data[0].slice(13, 19).split(',').join(''), 16) / 10;
        ret.data3 = parseInt(data[0].slice(19, 25).split(',').join(''), 16) / 10;
    }

    return ret.time && ret.data &&
        ret.data <= max && ret.data >= min &&
        ret.data2 >= min && ret.data2 <= max &&
        ret.data3 >= min && ret.data3 <= max ? ret : null;
}

var x = resolve04Str('[2016-10-31 13:45:09.488 Info] receive ->90,04,00,d3,00,da,00,c9,00,0c,02,5f,1d<- receive end');
console.log(x)

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

    return ret.time && ret.data && ret.data <= max && ret.data >= min ? ret : null;
}