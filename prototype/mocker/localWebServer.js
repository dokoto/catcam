const http = require('http');

const LABEL = 'LOCAL WEB-SERVER';

module.exports = class LocalWebServer {
  constructor(options) {
    [this.ip, this.port, this.channel, this.ws] = options;
    this.server =  http.createServer(this._webServerEngine.bind(this));
  }

  listen() {
    console.log(`[${ LABEL }] http://${ this.ip }:${ this.port }`);
    this.server.listen(this.port, this.ip);
  }

  _webServerEngine(req, res) {
    console.log(`[${ LABEL }] Stream Connected: ${ req.socket.remoteAddress }:${ req.socket.remotePort }`);
    res.connection.setTimeout(0);
    req.on('data', this._onData.bind(this));
    req.on('end', this._onEnd.bind(this));
  }

  _onData(data) {
    this.ws.to(this.channel).emit('onChunk', data);
  }

  _onEnd() {
    console.log(`[${ LABEL }] Closed`);
  }
}
