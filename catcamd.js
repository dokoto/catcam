'use strict';

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
const ws = require('socket.io')();
const exec = require('child_process').exec;

const WEBSOCKET_PORT = 8002;
const STREAM_PORT = 8001;
const FFMPEG_CMD_MP4 = 'ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera"  -vcodec libx264 -profile:v main -g 25 -r 25 -b:v 500k -keyint_min 250 -strict experimental -pix_fmt yuv420p -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof -an -preset ultrafast -f mp4 http://127.0.0.1:8001';
const FFMPEG_CMD_WEBM = 'ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera" -vcodec libvpx -b:v 3500k -r 25 -crf 10 -quality realtime -speed 16 -threads 2 -an -g 25 -f webm http://127.0.0.1:8001';

ws.on('connection', sockConn => {
    console.log('New WebSocket Connection: ', sockConn.conn.remoteAddress, sockConn.client.request.headers['user-agent']);
    exec(FFMPEG_CMD_WEBM, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
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
