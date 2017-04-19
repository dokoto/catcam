'use strict';

// ffmpeg -rtbufsize 1500M -f dshow -r 30 -i video="Integrated Camera" -f h264 -vcodec libx264  udp://127.0.0.1:8001
// ffmpeg -rtbufsize 1500M -f dshow -r 30 -i video="Integrated Camera":audio="Microphone (Realtek High Defini" -crf 0 -vcodec libx264 -acodec pcm_s16le -ac 1 -ar 44100  -f flv http://127.0.0.1:8001
// ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera" -vcodec libvpx -b:v 3500k -r 25 -crf 10 -quality realtime -speed 16 -threads 2 -an -g 25 -f webm http://127.0.0.1:8001
// ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera"  -vcodec libx264 -profile:v main -g 25 -r 25 -b:v 500k -keyint_min 250 -strict experimental -pix_fmt yuv420p -movflags empty_moov+default_base_moof -an -preset ultrafast -f mp4 http://127.0.0.1:8001

 // **** https://github.com/kmoskwiak/node-tcp-streaming-server/tree/master/client/js


// https://ricochen.wordpress.com/2011/10/14/learning-node-js-socket-io-a-simple-streaming-example/
// https://github.com/phoboslab/jsmpeg/blob/master/websocket-relay.js
// http://janganstop.com/news/HTML5-Live-Video-Streaming-via-WebSockets
// https://github.com/websockets/ws
// http://web-engineering.info/node/57

const http = require('http');
const ws = require('socket.io')();
const WEBSOCKET_PORT = 8002;
const STREAM_PORT = 8001;

ws.on('connection', sockConn => {
    console.log('New WebSocket Connection: ', sockConn.conn.remoteAddress, sockConn.client.request.headers['user-agent']);
    sockConn.on('close', function(code, message) {
        console.log('Disconnected WebSocket');
    });
});

ws.listen(WEBSOCKET_PORT);

const httpServer = http.createServer((req, res) => {
    console.log('Stream Connected: ' + req.socket.remoteAddress + ':' + req.socket.remotePort);

    res.connection.setTimeout(0);
    req.on('data', function(data) {
        ws.emit('onChunk', data);
    });

    req.on('end', function() {
        console.log('close');
    });

}).listen(STREAM_PORT);


console.log('Listening for incomming MPEG-TS Stream on http://127.0.0.1:' + STREAM_PORT);
console.log('Awaiting WebSocket connections on ws://127.0.0.1:' + WEBSOCKET_PORT + '/');
