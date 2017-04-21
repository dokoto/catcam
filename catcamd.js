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
const spawn = require('child_process').spawn;
const ifs = require('os').networkInterfaces();

const WEBSOCKET_PORT = 8002;
const STREAM_PORT = 8001;
const CHUNKS = 8;
const LOCAL_IP = Object.keys(ifs).map(x => ifs[x].filter(x => x.family === 'IPv4' && !x.internal)[0]).filter(x => x)[0].address;

const FFMPEG_CMD_MP4_WIN = 'ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera"  -vcodec libx264 -profile:v main -g 25 -r 25 -b:v 500k -keyint_min 250 -strict experimental -pix_fmt yuv420p -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof -an -preset ultrafast -f mp4 http://127.0.0.1:8001';
const FFMPEG_CMD_WEBM_WIN = 'ffmpeg -rtbufsize 1500M -f dshow -framerate 25 -video_size 640x480 -i video="Integrated Camera" -vcodec libvpx -b:v 3500k -r 25 -crf 10 -quality realtime -speed 16 -threads 2 -an -g 25 -f webm http://127.0.0.1:8001';
const FFMPEG_CMD_MP4_LINUX = 'ffmpeg -f v4l2 -framerate 25 -video_size 640x480 -i /dev/video0  -vcodec libx264 -profile:v main -g 25 -r 25 -b:v 500k -keyint_min 250 -strict experimental -pix_fmt yuv420p -movflags empty_moov+omit_tfhd_offset+frag_keyframe+default_base_moof -an -preset ultrafast -f mp4 http://127.0.0.1:8001';
const FFMPEG_CMD_WEBM_LINUX = 'ffmpeg  -f v4l2 -framerate 25 -video_size 640x480 -i /dev/video0 -vcodec libvpx -b:v 3500k -r 25 -crf 10 -quality realtime -speed 16 -threads 2 -an -g 25 -f webm http://127.0.0.1:8001';

const FFMPEG_CMD_WEBM_WIN_SPLIT = ['-rtbufsize', '1500M', '-f', 'dshow', '-framerate', '25', '-video_size', '640x480', '-i', 'video=Integrated Camera',
    '-vcodec', 'libvpx', '-b:v', '3500k', '-r', '25', '-crf', '10', '-quality', 'realtime', '-speed', '16', '-threads', '2', '-an', '-g', '25', '-f', 'webm', 'http://127.0.0.1:8001'
];

let FFMPEG_CMD = FFMPEG_CMD_WEBM_WIN_SPLIT;
let childProcess;
ws.on('connection', sockConn => {
    console.log('New WebSocket Connection: ', sockConn.conn.remoteAddress, sockConn.client.request.headers['user-agent']);

    if (childProcess) {
        childProcess.kill('SIGKILL');
        setTimeout(function() {
            console.log('Process endded, new process..');
            childProcess = spawn('ffmpeg', FFMPEG_CMD);
        }, 1000);
    } else {
        childProcess = spawn('ffmpeg', FFMPEG_CMD);
    }

    sockConn.on('close', function(code, message) {
        console.log('Disconnected WebSocket');
    });

    sockConn.on('disconnect', function() {
        console.log('Client disconected');
        ws.emit('user disconnected');
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


console.log('Listening for incomming MPEG-TS Stream on http://%s:%d', LOCAL_IP, STREAM_PORT);
console.log('Awaiting WebSocket connections on ws://%s:%d/', LOCAL_IP, WEBSOCKET_PORT);
