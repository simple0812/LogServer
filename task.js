var later = require('later');
var intervalTime = 100;

later.date.localTime();
var schedule = later.parse.recur().every(1).minute();

later.setInterval(function() {
  console.log('x');
}, schedule);
