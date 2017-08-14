express = require('express');
app = express();
var http = require('http');
var _ = require('underscore');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var engine = require('ejs-locals');
var config = require('./config');
var logger = require('./utils/logger');
var websocket = require('./websocket');

app.set('views', "" + __dirname + "/views");
app.set('view engine', 'html');
app.engine('html', engine);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(require('cookie-session')({
    secret: 'xish'
}));

var env = process.env.NODE_ENV || 'production';

app.use(express["static"](__dirname + '/public'));

app.use(logger.log4js.connectLogger(logger.access, {
    level: 'auto',
    format: ':method :url :status :response-timems :content-length'
}));

require("./routers/")(app);

app.use(function(req, res, next) {
    var err = new Error('Not Found' + req.originalUrl);
    err.status = 404;
    next(err);
});

if (env == 'development') {
    app.use(require('errorhandler')());
} else {
    app.use(function(err, req, res, next) {
        return res.status(500).send(err.message || '500 status');
    });
}

var xPort = process.env.LOG_PORT || config.PORT;
// app.listen(xPort, function() {
// 	console.log("listening on port " + xPort + ', env ' + env);
// });

var server = http.createServer(app);
var WebSocket = require('ws');
var WebSocketServer = require('ws').Server;
global.wss = new WebSocketServer({ server: server });
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
    });
}

wss.broadcastTo = function(data, name) {
    if (!data) return;
    wss.clients.forEach(function(client) {
        if (client.xname === name && client.readyState === WebSocket.OPEN)
            client.send(data);
    });
}

server.listen(xPort);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind + ', env ' + env);
}

websocket(wss);