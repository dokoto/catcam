const spawn = require('child_process').spawn;
const os = require('os');
const FFMPEG = require('./responses/GET/ffmpeg');
const LABEL = 'VIDEO-DISPACHER';
const RECONNECTION_MS = 2000;

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
    console.log(
      `New WebSocket Connection:
      ${ sockConn.conn.remoteAddress }
      ${ sockConn.client.request.headers["user-agent"] }`
    );
    sockConn.on('close', this._onClose.bind(this, sockConn));
    sockConn.on('join', this._onJoin.bind(this, sockConn));
    sockConn.on('start', this._onStart.bind(this, sockConn));
    sockConn.on('disconnect', this._onDisconnect.bind(this, sockConn));
  }

  _onClose(sockConn, code, message) {
    console.log('Disconnected WebSocket %s %s', code, message);
  }

  _onJoin(sockConn, room) {
    if (room !== this.channel) {
      console.error(`[${ LABEL }][JOIN] Error access ${ room } !== ${ this.channel }`);
      return;
    }
    console.log(`[${ LABEL }][JOIN] Joining to channel ${ this.channel }`);
    sockConn.join(room);
    this.ws.to(this.channel).emit('joined');
  }

  _onStart(sockConn, options) {
    if (options.channel !== this.channel) {
      console.error(`[${ LABEL }][START] Error access ${ options.channel } !== ${ this.channel }`);
      return;
    }

    if (this.childProcess && !this.connecting) {
      this.connecting = true;
      this.ws.to(this.channel).emit('reconnecting');
      console.log(`[${ LABEL }] FFMPEG killing pid ${ this.childProcess.pid }`);
      this.childProcess.kill('SIGKILL');
      setTimeout(() => {
        console.log('Process endded, new process..');
        console.log(`[${ LABEL }][RE-CONNECT] ffmpeg ${ this.ffmpegCmd.join(' ') }`);
        this.childProcess = spawn('ffmpeg', this.ffmpegCmd);
        console.log(`[${ LABEL }] FFMPEG PID ${ this.childProcess.pid }`);
        this.ws.to(this.channel).emit('restarted');
        this.connecting = false;
      }, RECONNECTION_MS);
    } else if (!this.childProcess && !this.connecting) {
      console.log(options);
      this.ffmpegCmd.splice(this.ffmpegCmd.indexOf('-video_size')+1, 0, options.resolution);
      this.ffmpegCmd.push(`http://${ this.web_ip }:${ this.web_port }`);
      console.log(`[${ LABEL }][CONNECT] ffmpeg ${ this.ffmpegCmd.join(' ') }`);
      this.childProcess = spawn('ffmpeg', this.ffmpegCmd);
      console.log(`[${ LABEL }] FFMPEG PID: ${ this.childProcess.pid }`);
      this.ws.to(this.channel).emit('started');
    }
  }

  _onDisconnect(sockConn) {
    console.log('Client disconected');
    console.log(`[${ LABEL }] FFMPEG killing pid ${ this.childProcess.pid }`);
    this.childProcess.kill('SIGKILL');
    this.ws.to(this.channel).emit('disconnect');
    sockConn.leave(this.channel);
  }
}
