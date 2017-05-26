const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoDBStore = require('connect-mongodb-session')(session);
const os = require('os');

const FFMPEG = require('./responses/GET/ffmpeg');
const RESP_LOGIN = require('./responses/GET/login');
const RESP_LOGOUT = require('./responses/GET/logout');
const RESP_USER_AUTH_SUCCESS = require('./responses/GET/user_auth_success');

const LABEL = 'REST-API';

module.exports = class Services {
  constructor(options) {
    [
      this.ip,
      this.port,
      this.ip_socket,
      this.port_socket,
      this.resolutions,
      this.channel,
      this.mongodbUrl,
      this.googleClientId,
      this.googleClientSecret,
      this.googleAuth2Callback,
      this.options,
    ] = options;
    this.app = express();
    this.globalSettings();
    this.sessionSettings();
    if (this.options.mocks) {
      this.mocksEndPoints();
    } else {
      this.endPoints();
    }
  }

  listen() {
    console.log(`[${ LABEL }] http://${ this.ip }:${ this.port }`);
    http.createServer(this.app).listen(this.port);
  }

  globalSettings() {
    this.app.set('views', `${ __dirname }/views`);
    this.app.set('view engine', 'ejs');
    this.app.use(express.static(`${ __dirname }/public`));
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    this.app.use(this.headers.bind(this));
  }

  sessionSettings() {
    this.app.use(
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
          uri: this.mongodbUrl,
          collection: 'sessions',
        }),
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  passportSettings() {
    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj, done) => {
      done(null, obj);
    });

    passport.use(
      new GoogleStrategy(
        {
          clientID: this.googleClientId,
          clientSecret: this.googleClientSecret,
          callbackURL: this.googleAuth2Callback,
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
  }

  headers(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }

  ensureAuthenticated(req, res, next) {
    console.log(`[${ LABEL }] Requesting authentication...`);
    if (req.isAuthenticated()) {
      console.log(`[${ LABEL }] Yeah is authenticated`);
      return next();
    }
    console.log(`[${ LABEL }] Oooooh, you are not authenticated`);
    res.redirect('/login');
    return null;
  }

  mocksEndPoints() {
    this.app.get('/login', this.mockLogin.bind(this));
    this.app.get('/logout', this.mockLogout.bind(this));
    this.app.get('/auth/google', this.mockAuthGoogle.bind(this));
    this.app.get('/info', this.mockInfo.bind(this));
  }

  endPoints() {
    this.app.get('/login', this.login.bind(this));
    this.app.get('/logout', this.logout.bind(this));
    this.app.get('/auth/google', this.authGoogle.bind(this));
    this.app.get('/info', this.ensureAuthenticated.bind(this), this.info.bind(this));
    this.app.get(
      '/auth/google',
      passport.authenticate('google', {
        scope: [
          'https://www.googleapis.com/auth/plus.login',
          'https://www.googleapis.com/auth/plus.profile.emails.read',
        ],
      })
    );

    this.app.get(
      '/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/loginSuccess',
        failureRedirect: '/loginError',
      })
    );
  }

  mockLogin(req, res) {
    console.log(`[${ LABEL }][MOCKS] /login: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    res.status(200).json(RESP_LOGIN);
  }

  mockLogout(req, res) {
    console.log(`[${ LABEL }][MOCKS] /logout: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    res.status(200).json(RESP_LOGOUT);
  }

  mockAuthGoogle(req, res) {
    console.log(
      `[${ LABEL }][MOCKS] /auth/google: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`
    );
    res.render('loginSuccess', { response: RESP_USER_AUTH_SUCCESS });
  }

  mockInfo(req, res) {
    console.log(`[${ LABEL }][MOCKS] /stream: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);

    res.status(200).json({
      user: RESP_USER_AUTH_SUCCESS.user,
      auth: true,
      channel: this.channel,
      resolutions: this.resolutions,
      ws: `ws://${ this.ip_socket }:${ this.port_socket }`,
      id: os.platform() === 'win32' ? FFMPEG.webm.win[9] : FFMPEG.webm.linux[7],
    });
  }

  loginError(req, res) {
    console.log(`[${ LABEL }] /loginError: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    res.render('loginError', { response: req.user });
  }

  loginSuccess(req, res) {
    console.log(`[${ LABEL }] /loginSuccess: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    res.render('loginSuccess', { response: req.user });
  }

  login(req, res) {
    console.log(`[${ LABEL }] /login: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    if (req.isAuthenticated()) {
      res.status(200).json({ user: req.user, auth: req.isAuthenticated(), redirect: '/' });
    } else {
      res
        .status(200)
        .json({ user: req.user, auth: req.isAuthenticated(), redirect: '/auth/google' });
    }
  }

  logout(req, res) {
    console.log(`[${ LABEL }] /logout: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    req.logout();
    res.status(200).json({ user: req.user, auth: req.isAuthenticated() });
  }

  info(req, res) {
    console.log(`[${ LABEL }] /stream: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    res.status(200).json({
      user: req.user,
      auth: true,
      channel: this.channel,
      resolutions: this.resolutions,
      ws: `ws://${ this.ip_socket }:${ this.port_socket }`,
      id: os.platform() === 'win32' ? FFMPEG.webm.win[9] : FFMPEG.webm.linux[7],
    });
  }
};
