const spawn = require('child_process').spawn;
const os = require('os');

module.exports = class Camera {
  constructor() {
    this.ffmpeg = {
      linux: ['-f', 'v4l2', '-list_formats', 'all', '-i', '/dev/video0'],
      win: ['-f', 'dshow', '-list_options', 'true', '-i', 'video=Integrated Camera'],
    };
    this.resolutionsArr = [];
  }

  resolutions() {
    return new Promise(this.requestResolutions.bind(this));
  }

  requestResolutions(resolve) {
    const cmd = os.platform() === 'win32' ? this.ffmpeg.win : this.ffmpeg.linux;
    const childProcess = spawn('ffmpeg', cmd);
    childProcess.stdout.on('data', this.extractResolutions.bind(this));
    childProcess.stderr.on('data', this.extractResolutions.bind(this));
    childProcess.on('close', this.onProcessClose.bind(this, resolve));
  }

  onProcessClose(resolve) {
    const resolutionSet = new Set(this.resolutionsArr);
    resolve(this.sortResolutions([...resolutionSet]));
  }

  sortResolutions(resolutionsArray) {
    const obj = {};
    for (let i = 0; i < resolutionsArray.length; i++) {
      const [w, h] = resolutionsArray[i].split('x');
      const pos = Number(w) + Number(h);
      obj[pos] = resolutionsArray[i];
    }
    return Object.keys(obj).map(item => obj[item]);
  }

  extractResolutions(uint8Data) {
    if (uint8Data) {
      const stringData = String.fromCharCode.apply(null, uint8Data);
      // console.log(stringData);
      const matched = stringData.match(/\d{3,4}x\d{3,4}/g);
      if (matched) {
        this.resolutionsArr = this.resolutionsArr.concat(matched);
      }
    }
  }
};
