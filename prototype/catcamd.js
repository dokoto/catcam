// ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera" -vcodec libvpx -b:v 3500k -r 25 -crf 10 -quality realtime -speed 16 -threads 2 -an -g 25 -f webm http://127.0.0.1:8001
// ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera"  -vcodec libx264 -profile:v main -g 25 -r 25 -b:v 500k -keyint_min 250 -strict experimental -pix_fmt yuv420p -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof -an -preset ultrafast -f mp4 http://127.0.0.1:8001

/*
 * https://developers.google.com/web/fundamentals/media/mse/basics
 * Check codecs
 * https://hacks.mozilla.org/2015/07/streaming-media-on-demand-with-media-source-extensions/
 * TO CHECK
 ** https://groups.google.com/a/chromium.org/forum/#!topic/chromium-html5/p2pFsHNaj-k
 ** https://www.chromestatus.com/feature/4563797888991232
 ** https://www.chromestatus.com/features/4563797888991232
 ** http://html5-demos.appspot.com/static/media-source.html
 */

//const https = require('https');
const http = require('http');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoDBStore = require('connect-mongodb-session')(session);
const crypto = require('crypto');
const format = require('biguint-format');
const fs = require('fs');
const ws = require('socket.io')();
const spawn = require('child_process').spawn;
const ifs = require('os').networkInterfaces();

const GOOGLE_CLIENT_ID = '702802836349-cmpihi89o5pp2mh85cl8t06g2k9jmjuu.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '7v7XQ2fl-PfvMBSwGrfdMqDP';
const WEBSOCKET_PORT = 4445;
const HTTP_PORT = 8002;
const STREAM_PORT = 8001;
const PUBLIC_IP = 'titan.homelinux.net';
const LOCAL_IP = Object.keys(ifs)
  .map(x => ifs[x].filter(y => y.family === 'IPv4' && !y.internal)[0])
  .filter(z => z)[0].address;

const ffCmd = {
  FFMPEG_CMD_MP4_WIN: 'ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera"  -vcodec libx264 -profile:v main -g 25 -r 25 -b:v 500k -keyint_min 250 -strict experimental -pix_fmt yuv420p -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof -an -preset ultrafast -f mp4 http://127.0.0.1:8001',
  FFMPEG_CMD_WEBM_WIN: 'ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera" -vcodec libvpx -b:v 3500k -r 25 -crf 10 -quality realtime -speed 16 -threads 2 -an -g 25 -f webm http://127.0.0.1:8001',
  FFMPEG_CMD_MP4_LINUX: 'ffmpeg -f v4l2 -framerate 25 -video_size 640x480 -i /dev/video0  -vcodec libx264 -profile:v main -g 25 -r 25 -b:v 500k -keyint_min 250 -strict experimental -pix_fmt yuv420p -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof -an -preset ultrafast -f mp4 http://127.0.0.1:8001',
  FFMPEG_CMD_WEBM_LINUX: [
    '-f',
    'v4l2',
    '-framerate',
    '25',
    '-video_size',
    '640x480',
    '-i',
    '/dev/video0',
    '-vcodec',
    'libvpx',
    '-b:v',
    '3500k',
    '-r',
    '25',
    '-crf',
    '10',
    '-quality',
    'realtime',
    '-speed',
    '16',
    '-threads',
    '2',
    '-an',
    '-g',
    '25',
    '-f',
    'webm',
    `http://${ LOCAL_IP }:${ STREAM_PORT }`,
  ],
  FFMPEG_CMD_WEBM_WIN_SPLIT: [
    '-rtbufsize',
    '1500M',
    '-f',
    'dshow',
    '-framerate',
    '25',
    '-video_size',
    '640x480',
    '-i',
    'video=Integrated Camera',
    '-vcodec',
    'libvpx',
    '-b:v',
    '3500k',
    '-r',
    '25',
    '-crf',
    '10',
    '-quality',
    'realtime',
    '-speed',
    '16',
    '-threads',
    '2',
    '-an',
    '-g',
    '25',
    '-f',
    'webm',
    `http://${ LOCAL_IP }:${ STREAM_PORT }`,
  ],
};

function generateRandHash() {
  const x = crypto.randomBytes(8);
  const hash = crypto.createHash('sha256');
  hash.update(format(x, 'dec'));
  return hash.digest('hex');
}

// ********************************************************
// WEBSOCKET SERVER
// *********************************************************/
const FFMPEG_CMD = ffCmd.FFMPEG_CMD_WEBM_LINUX;
let childProcess;
let WS_CHANNEL;
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
    if (room === WS_CHANNEL) {
      if (childProcess) {
        childProcess.kill('SIGKILL');
        setTimeout(() => {
          console.log('Process endded, new process..');
          childProcess = spawn('ffmpeg', FFMPEG_CMD);
        }, 1000);
      } else {
        console.log(' COMM: %s', FFMPEG_CMD.join(' '));
        childProcess = spawn('ffmpeg', FFMPEG_CMD);
      }
    }
  });

  sockConn.on('disconnect', () => {
    console.log('Client disconected');
    sockConn.leave(WS_CHANNEL);
    ws.emit('user disconnected');
  });
});

ws.listen(WEBSOCKET_PORT);

// ********************************************************
// EXPRESS SERVER
// *********************************************************/

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://proxyserver.homelinux.net/catcam/auth/google/callback', // `http://${ PUBLIC_IP }:${ HTTP_PORT }/auth/google/callback`,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      console.log('Google callback profile id : %s', profile.id);
      process.nextTick(() => {
        return done(null, profile);
      });
    }
  )
);

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

app.use(
  session({
    secret: 'camcat',
    name: 'catcamSession',
    resave: false,
    proxy: true,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: new mongoDBStore({
      uri: 'mongodb://127.0.0.1:27017/Catcam',
      collection: 'sessions',
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  console.log('Requesting authentication...');
  if (req.isAuthenticated()) {
    console.log('Yeah is authenticated');
    return next();
  }
  console.log('Oooooh, you are not authenticado');
  res.redirect('/login');
  return null;
}

app.get('/', (req, res) => {
  console.log(`/ : ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  if (req.isAuthenticated()) {
    res.render('/loginSuccess', { user: req.user });
  } else {
    res.status(200).json(JSON.stringify({ user: req.user, auth: req.isAuthenticated() }));
  }
});

app.get('/login', (req, res) => {
  console.log(`/login: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  res
    .status(200)
    .json(
      JSON.stringify({ user: req.user, auth: req.isAuthenticated(), redirect: '/auth/google' })
    );
});

app.get('/logout', (req, res) => {
  console.log(`/logout: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  req.logout();
  res.redirect('/');
});

app.get('/stream', ensureAuthenticated, (req, res) => {
  console.log(`/stream: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  WS_CHANNEL = generateRandHash();
  res
    .status(200)
    .json(JSON.stringify({ user: req.user, auth: req.isAuthenticated(), channel: WS_CHANNEL }));
});

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/plus.profile.emails.read',
    ],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

//const cert = fs.readFileSync('./certs/cert.pem');
//const key = fs.readFileSync('./certs/key.pem');

//https.createServer({ cert, key }, app).listen(HTTPS_PORT);
http.createServer(app).listen(HTTP_PORT);

// ********************************************************
// STREAM HTTP SERVER
// *********************************************************/
http
  .createServer((req, res) => {
    console.log(`Stream Connected: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);

    res.connection.setTimeout(0);
    req.on('data', data => {
      ws.to(WS_CHANNEL).emit('onChunk', data);
    });

    req.on('end', () => {
      console.log('close');
    });
  })
  .listen(STREAM_PORT, LOCAL_IP);

console.log('LOCAL HTTP BROADCAST-VIDEO on http://%s:%s', LOCAL_IP, STREAM_PORT);
// console.log('PUBLIC REST API on https://%s:%s', PUBLIC_IP, HTTPS_PORT);
console.log('PUBLIC REST API on http://%s:%s', PUBLIC_IP, HTTP_PORT);
console.log('PUBLIC WEBSOCKET ws://%s:%d/', PUBLIC_IP, WEBSOCKET_PORT);
