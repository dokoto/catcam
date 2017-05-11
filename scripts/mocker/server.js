const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ifs = require('os').networkInterfaces();

const RESP_LOGIN = require('./responses/GET/login');
const RESP_LOGOUT = require('./responses/GET/logout');
const RESP_USER_AUTH_SUCCESS = require('./responses/GET/user_auth_success');

const HTTP_PORT = 8002;
const LOCAL_IP = Object.keys(ifs)
  .map(x => ifs[x].filter(y => y.family === 'IPv4' && !y.internal)[0])
  .filter(z => z)[0].address;

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
  res.render('loginSuccess', {response: RESP_USER_AUTH_SUCCESS});
  //res.status(200).json(RESP_USER_AUTH_SUCCESS);
});

http.createServer(app).listen(HTTP_PORT);
console.log('[MOCKER] PUBLIC REST API on http://%s:%s', LOCAL_IP, HTTP_PORT);
