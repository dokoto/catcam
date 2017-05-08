#!/usr/bin/env node

const http = require('http');
const ws = require('socket.io')();
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const ifs = require('os').networkInterfaces();

const WEBSOCKET_PORT = 4445;
const STREAM_PORT = 8001;
const PUBLIC_IP = 'titan.homelinux.net';
const LOCAL_IP = Object.keys(ifs)
  .map(x => ifs[x].filter(x => x.family === 'IPv4' && !x.internal)[0])
  .filter(x => x)[0].address;

const FFMPEG_CMD = [
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
];

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
    console.log(`ffmpeg ${ FFMPEG_CMD.join(' ') }`);
    childProcess = spawn('ffmpeg', FFMPEG_CMD);
  }

  sockConn.on('close', (code, message) => {
    console.log('Disconnected WebSocket');
  });

  sockConn.on('disconnect', () => {
    console.log('Client disconected');
    ws.emit('user disconnected');
  });
});

ws.listen(WEBSOCKET_PORT);

const httpServer = http
  .createServer((req, res) => {
    console.log(`Stream Connected: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);

    res.connection.setTimeout(0);
    req.on('data', (data) => {
      ws.emit('onChunk', data);
    });

    req.on('end', () => {
      console.log('close');
    });
  })
  .listen(STREAM_PORT);

console.log('LOCAL HTTP BROADCAST-VIDEO on http://%s:%s', LOCAL_IP, STREAM_PORT);
console.log('PUBLIC WEBSOCKET ws://%s:%d/', PUBLIC_IP, WEBSOCKET_PORT);
