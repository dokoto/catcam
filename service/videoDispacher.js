const spawn = require('child_process').spawn;
const os = require('os');
const ws = require('socket.io')();
const FFMPEG = require('./responses/GET/ffmpeg');

const LABEL = 'VIDEO-DISPACHER';
const RECONNECTION_MS = 3000;

module.exports = class VideoDispacher {
  constructor(options) {
    [this.ip, this.port, this.web_ip, this.web_port, this.channel] = options;
    this.childProcess = null;
    this.ffmpegCmd = os.platform() === 'win32' ? FFMPEG.webm.win : FFMPEG.webm.linux;
    this.connecting = false;
  }

  listen() {
    console.log(`[${ LABEL }] ws://${ this.ip }:${ this.port }/`);
    ws.on('connection', this.onConnection.bind(this));
    ws.listen(this.port);
  }

  onConnection(sockConn) {
    console.log(`[${ LABEL }][CONNECTED] ${ sockConn.conn.remoteAddress }`);
    console.log(sockConn.client.request.headers['user-agent']);
    sockConn.on('close', this.onClose.bind(this, sockConn));
    sockConn.on('join', this.onJoin.bind(this, sockConn));
    sockConn.on('start', this.onStart.bind(this, sockConn));
    sockConn.on('disconnect', this.onDisconnect.bind(this, sockConn));
  }

  onClose(sockConn, code, message) {
    console.log('Disconnected WebSocket %s %s', code, message);
  }

  onJoin(sockConn, options) {
    if (options.channel !== this.channel) {
      console.error(
        `[${ LABEL }][JOIN] Error ${ options.email } accessing ${ options.channel } !== ${ this.channel }`
      );
      return;
    }
    console.log(`[${ LABEL }][JOIN] ${ options.email } joining to channel ${ this.channel }`);
    sockConn.join(options.channel);

    if (this.childProcess) {
      console.log(`[${ LABEL }] FFMPEG killing pid ${ this.childProcess.pid }`);
      ws.to(this.channel).emit('new:user');
      this.childProcess.kill('SIGKILL');
      setTimeout(() => {
        console.log(`[${ LABEL }] FFMPEG pid ${ this.childProcess.pid } killed`);
        ws.to(this.channel).emit('joined');
        ws.to(this.channel).emit('camera:down');
        this.childProcess = null;
      }, RECONNECTION_MS);
    } else {
      ws.to(this.channel).emit('joined');
      ws.to(this.channel).emit('camera:down');
    }
  }

  onStart(sockConn, options) {
    if (options.channel !== this.channel) {
      console.error(
        `[${ LABEL }][START] Error ${ options.email } accessing ${ options.channel } !== ${ this.channel }`
      );
      return;
    }

    if (!this.childProcess) {
      console.log(`[${ LABEL }][START] ${ options.email } starting live cam`);
      this.ffmpegCmd.splice(this.ffmpegCmd.indexOf('-video_size') + 1, 0, options.resolution);
      this.ffmpegCmd.push(`http://${ this.web_ip }:${ this.web_port }`);
      console.log(`[${ LABEL }][START] ffmpeg ${ this.ffmpegCmd.join(' ') }`);
      this.childProcess = spawn('ffmpeg', this.ffmpegCmd);
      this.ffmpegCmd.splice(this.ffmpegCmd.indexOf('-video_size') + 1, 1);
      this.ffmpegCmd.splice(this.ffmpegCmd.length - 1);
      console.log(`[${ LABEL }] FFMPEG PID: ${ this.childProcess.pid }`);
      ws.to(this.channel).emit('started');
    }
  }

  onDisconnect(sockConn) {
    console.log(`[${ LABEL }][DISCONNECT] Client disconnected`);
    if (this.childProcess) {
      ws.to(this.channel).emit('disconnected');
      const pid = this.childProcess.pid;
      this.childProcess.kill('SIGKILL');
      setTimeout(() => {
        console.log(`[${ LABEL }] FFMPEG pid ${ pid } killed`);
        ws.to(this.channel).emit('camera:down');
        this.childProcess = null;
      }, RECONNECTION_MS);
    }
    sockConn.leave(this.channel);
  }
};
