
const Camera = require ('./camera');
const LocalWebServer = require('./localWebServer');
const Services = require('./Services');
const VideoDispacher = require('./videoDispacher');
const Utils = require('./utils');

const WEBSOCKET_STREAM_PORT = 4445;
const LOCALONLY_HTTP_STREAM_PORT = 8001;
const HTTP_RESTFUL_PORT = 8002;

class CamCat {
  constructor(options) {
    [this.webSocketStreamPort, this.localOnlyHttpStreamPort, this.httpRestfulPort] = options;
    this.camera = new Camera();
    this.camResolutions = [];
    this.channel = Utils.generateRandHash();
    this.camera.resolutions().then(this._settings.bind(this));
  }

  _settings(resolutions) {
    this.services = new Services([Utils.localIp(), this.httpRestfulPort, Utils.localIp(), this.webSocketStreamPort, resolutions, this.channel]);
    this.videoDispacher = new VideoDispacher([Utils.localIp(), this.webSocketStreamPort, Utils.localIp(), this.localOnlyHttpStreamPort, this.channel]);
    this.localWebServer = new LocalWebServer([Utils.localIp(), this.localOnlyHttpStreamPort, this.channel, this.videoDispacher.ws]);
    this._listen();
  }

  _listen() {
    this.localWebServer.listen();
    this.services.listen();
    this.videoDispacher.listen();
  }

}

new CamCat([WEBSOCKET_STREAM_PORT, LOCALONLY_HTTP_STREAM_PORT, HTTP_RESTFUL_PORT]);
