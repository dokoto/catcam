const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const os = require('os');
const Utils = require('./utils');

const FFMPEG = require('./responses/GET/ffmpeg');
const RESP_LOGIN = require('./responses/GET/login');
const RESP_LOGOUT = require('./responses/GET/logout');
const RESP_USER_AUTH_SUCCESS = require('./responses/GET/user_auth_success');
const LABEL = 'REST-API';

module.exports = class Services {
  constructor(options) {
    [this.ip, this.port, this.ip_socket, this.port_socket, this.resolutions, this.channel] = options;
    this.app = express();
    this._settings();
    this._endPoints();
    this.channel;
  }

  listen() {
    console.log(`[${ LABEL }] http://${ this.ip }:${ this.port }`);
    http.createServer(this.app).listen(this.port);
  }

  _settings() {
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
    this.app.use(this._headers.bind(this));
  }

  _headers(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  }

  _endPoints() {
    this.app.get('/login', this._login.bind(this));
    this.app.get('/logout', this._logout.bind(this));
    this.app.get('/auth/google', this._auth_google.bind(this));
    this.app.get('/info', this._info.bind(this));
  }

  _login(req, res) {
    console.log(`[${ LABEL }] /login: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    res.status(200).json(RESP_LOGIN);
  }

  _logout(req, res) {
    console.log(`[${ LABEL }] /logout: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    res.status(200).json(RESP_LOGOUT);
  }

  _auth_google(req, res) {
    console.log(`[${ LABEL }] /auth/google: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    res.render('loginSuccess', { response: RESP_USER_AUTH_SUCCESS });
  }

  _info(req, res) {
    console.log(`[${ LABEL }] /stream: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);

    res.status(200).json({
      user: RESP_USER_AUTH_SUCCESS.user,
      auth: true,
      channel: this.channel,
      resolutions: this.resolutions,
      ws: `ws://${ this.ip_socket }:${ this.port_socket }`,
      id: os.platform() === 'win32' ? FFMPEG.webm.win[9] : FFMPEG.webm.linux[7],
    });
  }
}
