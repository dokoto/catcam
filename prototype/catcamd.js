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

const http = require('http');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoDBStore = require('connect-mongodb-session')(session);

const ws = require('socket.io')();
const spawn = require('child_process').spawn;
const ifs = require('os').networkInterfaces();

const GOOGLE_CLIENT_ID = '702802836349-mskkrk139ffvqr73gb9vc8bfsh5ai3mk.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'Rk88u2lHxTNEW41vD6PmkwKq';
const WEBSOCKET_PORT = 8002;
const HTTP_PORT = 8001;
const PUBLIC_IP = '46.105.122.140';
const LOCAL_IP = Object.keys(ifs)
  .map(x => ifs[x].filter(y => y.family === 'IPv4' && !y.internal)[0])
  .filter(z => z)[0].address;

const ffCmd = {
  FFMPEG_CMD_MP4_WIN: 'ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera"  -vcodec libx264 -profile:v main -g 25 -r 25 -b:v 500k -keyint_min 250 -strict experimental -pix_fmt yuv420p -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof -an -preset ultrafast -f mp4 http://127.0.0.1:8001',
  FFMPEG_CMD_WEBM_WIN: 'ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera" -vcodec libvpx -b:v 3500k -r 25 -crf 10 -quality realtime -speed 16 -threads 2 -an -g 25 -f webm http://127.0.0.1:8001',
  FFMPEG_CMD_MP4_LINUX: 'ffmpeg -f v4l2 -framerate 25 -video_size 640x480 -i /dev/video0  -vcodec libx264 -profile:v main -g 25 -r 25 -b:v 500k -keyint_min 250 -strict experimental -pix_fmt yuv420p -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof -an -preset ultrafast -f mp4 http://127.0.0.1:8001',
  FFMPEG_CMD_WEBM_LINUX: 'ffmpeg  -f v4l2 -framerate 25 -video_size 640x480 -i /dev/video0 -vcodec libvpx -b:v 3500k -r 25 -crf 10 -quality realtime -speed 16 -threads 2 -an -g 25 -f webm http://127.0.0.1:8001',
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
    'http://127.0.0.1:8001',
  ],
};

const FFMPEG_CMD = ffCmd.FFMPEG_CMD_WEBM_WIN_SPLIT;
let childProcess;
ws.on('connection', sockConn => {
  console.log(
    'New WebSocket Connection: ',
    sockConn.conn.remoteAddress,
    sockConn.client.request.headers['user-agent']
  );

  if (childProcess) {
    childProcess.kill('SIGKILL');
    setTimeout(() => {
      console.log('Process endded, new process..');
      childProcess = spawn('ffmpeg', FFMPEG_CMD);
    }, 1000);
  } else {
    childProcess = spawn('ffmpeg', FFMPEG_CMD);
  }

  sockConn.on('close', (code, message) => {
    console.log('Disconnected WebSocket %s %s', code, message);
  });

  sockConn.on('disconnect', () => {
    console.log('Client disconected');
    ws.emit('user disconnected');
  });
});

ws.listen(WEBSOCKET_PORT);

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
      callbackURL: `http://${ PUBLIC_IP }:${ HTTP_PORT }/auth/google/callback`,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
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
      uri: '',
      collection: '',
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
  return null;
}

app.get('/', (req, res) => {
  console.log(`Stream Connected / : ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  res.status(200).json(JSON.stringify({ user: req.user, auth: req.isAuthenticated() }));
});

app.get('/account', ensureAuthenticated, (req, res) => {
  console.log(`Stream Connected /account: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  res.status(200).json(JSON.stringify({ user: req.user, auth: req.isAuthenticated() }));
});

app.get('/login', (req, res) => {
  console.log(`Stream Connected /login: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  res
    .status(200)
    .json(
      JSON.stringify({ user: req.user, auth: req.isAuthenticated(), redirect: '/auth/google' })
    );
});

app.get('/logout', (req, res) => {
  console.log(`Stream Connected /logout: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
  req.logout();
  res.redirect('/');
});

app.get('/stream', (req, res) => {
  console.log(`Stream Connected /stream: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);

  res.connection.setTimeout(0);
  req.on('data', data => {
    ws.emit('onChunk', data);
  });

  req.on('end', () => {
    console.log('close');
  });
});

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login'],
  })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

http.createServer(app).listen(HTTP_PORT);

console.log('Listening for incomming MPEG-TS Stream on http://%s:%d', LOCAL_IP, HTTP_PORT);
console.log('Awaiting WebSocket connections on ws://%s:%d/', LOCAL_IP, WEBSOCKET_PORT);
