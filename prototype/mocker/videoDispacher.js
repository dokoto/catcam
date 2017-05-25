const spawn = require('child_process').spawn;
const os = require('os');
const FFMPEG = require('./responses/GET/ffmpeg');
const LABEL = 'VIDEO-DISPACHER';
const RECONNECTION_MS = 3000;

module.exports = class VideoDispacher {
  constructor(options) {
    [this.ip, this.port, this.web_ip, this.web_port, this.channel] = options;
    this.ws = require('socket.io')();
    this.childProcess;
    this.ffmpegCmd = os.platform() === 'win32' ? FFMPEG.webm.win : FFMPEG.webm.linux;
    this.connecting = false;
  }

  listen() {
    console.log(`[${ LABEL }] ws://${ this.ip }:${ this.port }/`);
    this.ws.on('connection', this._onConnection.bind(this));
    this.ws.listen(this.port);
  }

  _onConnection(sockConn) {
    console.log(`[${ LABEL }][CONNECTED] ${ sockConn.conn.remoteAddress }`);
    console.log(sockConn.client.request.headers["user-agent"]);
    sockConn.on('close', this._onClose.bind(this, sockConn));
    sockConn.on('join', this._onJoin.bind(this, sockConn));
    sockConn.on('start', this._onStart.bind(this, sockConn));
    sockConn.on('disconnect', this._onDisconnect.bind(this, sockConn));
  }

  _onClose(sockConn, code, message) {
    console.log('Disconnected WebSocket %s %s', code, message);
  }

  _onJoin(sockConn, options) {
    if (options.channel !== this.channel) {
      console.error(`[${ LABEL }][JOIN] Error ${ options.email } accessing ${ options.channel } !== ${ this.channel }`);
      return;
    }
    console.log(`[${ LABEL }][JOIN] ${ options.email } joining to channel ${ this.channel }`);
    sockConn.join(options.channel);

    if (this.childProcess) {
      console.log(`[${ LABEL }] FFMPEG killing pid ${ this.childProcess.pid }`);
      this.ws.to(this.channel).emit('new:user');
      this.childProcess.kill('SIGKILL');
      setTimeout(() => {
        console.log(`[${ LABEL }] FFMPEG pid ${ this.childProcess.pid } killed`);
        this.ws.to(this.channel).emit('joined');
        this.ws.to(this.channel).emit('camera:down');
        this.childProcess = null;
      }, RECONNECTION_MS);
    } else {
      this.ws.to(this.channel).emit('joined');
      this.ws.to(this.channel).emit('camera:down');
    }
  }

  _onStart(sockConn, options) {
    if (options.channel !== this.channel) {
      console.error(`[${ LABEL }][START] Error ${ options.email } accessing ${ options.channel } !== ${ this.channel }`);
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
      this.ws.to(this.channel).emit('started');
    }
  }

  _onDisconnect(sockConn) {
    console.log(`[${ LABEL }][DISCONNECT] Client disconnected`);
    if (this.childProcess) {
      this.ws.to(this.channel).emit('disconnected');
      const pid = this.childProcess.pid;
      this.childProcess.kill('SIGKILL');
      setTimeout(() => {
        console.log(`[${ LABEL }] FFMPEG pid ${ pid } killed`);
        this.ws.to(this.channel).emit('camera:down');
        this.childProcess = null;
      }, RECONNECTION_MS);
    }
    sockConn.leave(this.channel);
  }
}
