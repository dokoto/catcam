const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ifs = require('os').networkInterfaces();
const crypto = require('crypto');
const format = require('biguint-format');
const ws = require('socket.io')();

const RESP_LOGIN = require('./responses/GET/login');
const RESP_LOGOUT = require('./responses/GET/logout');
const RESP_USER_AUTH_SUCCESS = require('./responses/GET/user_auth_success');
const FFMPEG = require('./responses/GET/ffmpeg');

const WEBSOCKET_PORT = 4445;
const STREAM_PORT = 8001;
const HTTP_PORT = 8002;
const LOCAL_IP = Object.keys(ifs)
  .map(x => ifs[x].filter(y => y.family === 'IPv4' && !y.internal)[0])
  .filter(z => z)[0].address;

function generateRandHash() {
  const x = crypto.randomBytes(8);
  const hash = crypto.createHash('sha256');
  hash.update(format(x, 'dec'));
  return hash.digest('hex');
}

// ********************************************************
// WEBSOCKET SERVER
// *********************************************************/
let childProcess;
let WS_CHANNEL;
let ffmpegCmd = FFMPEG.webm.win;
ffmpegCmd.push(`http://${ LOCAL_IP }:${ STREAM_PORT }`);

ws.on('connection', sockConn => {
  console.log(
    'New WebSocket Connection: ',
    sockConn.conn.remoteAddress,
    sockConn.client.request.headers['user-agent']
  );

  sockConn.on('close', (code, message) => {
    console.log('Disconnected WebSocket %s %s', code, message);
  });

  sockConn.on('join', room => {
    if (room === WS_CHANNEL) {
      sockConn.join(room);
    }
  });

  sockConn.on('start', room => {
    if (room !== WS_CHANNEL) {
      console.error(`[MOCKER] Error access`);
      return;
    }

    if (childProcess) {
      childProcess.kill('SIGKILL');
      setTimeout(() => {
        console.log('Process endded, new process..');
        childProcess = spawn('ffmpeg', ffmpegCmd);
      }, 1000);
    } else {
      console.log(' COMM: %s', ffmpegCmd.join(' '));
      childProcess = spawn('ffmpeg', ffmpegCmd);
    }
  });

  sockConn.on('disconnect', () => {
    console.log('Client disconected');
    sockConn.leave(WS_CHANNEL);
  });
});

// ********************************************************
// EXPRESS SERVER
// *********************************************************/
const app = express();
app.set('views', `${ __dirname }/views`);
app.set('view engine', 'ejs');
app.use(express.static(`${ __dirname }/public`));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/login', (req, res) => {
  console.log(`[MOCKER] /login: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  res.status(200).json(RESP_LOGIN);
});

app.get('/logout', (req, res) => {
  console.log(`[MOCKER] /logout: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  res.status(200).json(RESP_LOGOUT);
});

app.get('/auth/google', (req, res) => {
  console.log(`[MOCKER] /auth/google: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  res.render('loginSuccess', { response: RESP_USER_AUTH_SUCCESS });
});

app.get('/stream', (req, res) => {
  console.log(`/stream: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  const WS_CHANNEL = generateRandHash();
  res
    .status(200)
    .json({
      user: RESP_USER_AUTH_SUCCESS.user,
      auth: true,
      channel: WS_CHANNEL,
      ws: `ws://${ PUBLIC_IP }:${ WEBSOCKET_PORT }`,
    });
});

// ********************************************************
// STREAM HTTP SERVER
// *********************************************************/
const videoHttpServer = http.createServer((req, res) => {
  console.log(`Stream Connected: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);

  res.connection.setTimeout(0);
  req.on('data', data => {
    ws.to(WS_CHANNEL).emit('onChunk', data);
  });

  req.on('end', () => {
    console.log('close');
  });
});

// ********************************************************
// LISTENERS
// *********************************************************/
videoHttpServer.listen(STREAM_PORT, LOCAL_IP);
ws.listen(WEBSOCKET_PORT);
http.createServer(app).listen(HTTP_PORT);

console.log('[MOCKER] LOCAL HTTP BROADCAST-VIDEO on http://%s:%s', LOCAL_IP, STREAM_PORT);
console.log('[MOCKER] PUBLIC WEBSOCKET ws://%s:%d/', LOCAL_IP, WEBSOCKET_PORT);
console.log('[MOCKER] PUBLIC REST API on http://%s:%s', LOCAL_IP, HTTP_PORT);
