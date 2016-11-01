var shell = require('shelljs');

exports.resolveTemperature = function(name, step, max) {
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
        var x = resolveStr(each, max);

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

function resolveStr(str, max) {
    max = max || 100;
    var ret = {}
    var time = str.match(/\[[^\|]+(?=Info\])/);
    if (time && time[0]) {
        ret.time = time[0].slice(1).trim().slice(0, -7);
    }

    var data = str.match(/-\>90,03.+(?=\<)/)

    if (data && data[0]) {
        ret.data = parseInt(data[0].slice(8, 13).split(',').join(''), 16) / 10;
    }

    return ret.time && ret.data && ret.data <= max ? ret : null;
}