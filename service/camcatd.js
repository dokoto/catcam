const Camera = require('./camera');
const LocalWebServer = require('./localWebServer');
const Services = require('./services');
const VideoDispacher = require('./videoDispacher');
const Utils = require('./utils');
const Conf = require('../.appconf.json');
const Options = require('./options');

class CamCat {
  constructor(options) {
    [this.webSocketStreamPort, this.localOnlyHttpStreamPort, this.httpRestfulPort] = options;
    this.camera = new Camera();
    this.camResolutions = [];
    this.channel = Utils.generateRandHash();
    this.options = Options.get();
  }

  settings(resolutions) {
    this.services = new Services([
      Utils.localIp(),
      this.httpRestfulPort,
      Utils.localIp(),
      this.webSocketStreamPort,
      resolutions,
      this.channel,
    ]);
    this.videoDispacher = new VideoDispacher([
      Utils.localIp(),
      this.webSocketStreamPort,
      Utils.localIp(),
      this.localOnlyHttpStreamPort,
      this.channel,
    ]);
    this.localWebServer = new LocalWebServer([
      Utils.localIp(),
      this.localOnlyHttpStreamPort,
      this.channel,
      this.videoDispacher.ws,
    ]);
    this.setListener();
  }

  setListener() {
    this.localWebServer.listen();
    this.services.listen();
    this.videoDispacher.listen();
  }

  listen() {
    this.camera.resolutions().then(this.settings.bind(this));
  }
}

const catcam = new CamCat([
  Conf.WEBSOCKET_STREAM_PORT,
  Conf.LOCALONLY_HTTP_STREAM_PORT,
  Conf.HTTP_RESTFUL_PORT,
]);

catcam.listen();
