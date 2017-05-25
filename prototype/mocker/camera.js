const spawn = require('child_process').spawn;
const os = require('os');

module.exports = class Camera {
  constructor() {
    this.ffmpeg = {
      linux: ['-f', 'dshow', '-list_options', 'true', '-i', '/dev/video0'],
      win: ['-f', 'dshow', '-list_options', 'true', '-i', 'video=Integrated Camera'],
    };
    this.resolutionsArr = [];
  }

  resolutions() {
    return new Promise(this.requestResolutions.bind(this));
  }

  requestResolutions(resolve, reject) {
    const cmd = os.platform() === 'win32' ? this.ffmpeg.win : this.ffmpeg.linux;
    const childProcess = spawn('ffmpeg', cmd);
    childProcess.stdout.on('data', this.extractResolutions.bind(this));
    childProcess.stderr.on('data', this.extractResolutions.bind(this));
    childProcess.on('close', code => {
      const resolutionSet = new Set(this.resolutionsArr);
      resolve(this.sortResolutions([...resolutionSet]));
    });
  }

  sortResolutions(resolutionsArray) {
    let obj = {};
    for (let i in resolutionsArray) {
      const [w, h] = resolutionsArray[i].split('x');
      const pos = Number(w) + Number(h);
      obj[pos] = resolutionsArray[i];
    }
    return Object.keys(obj).map(item => obj[item]);
  }

  extractResolutions(uint8Data) {
    if (uint8Data) {
      const stringData = String.fromCharCode.apply(null, uint8Data);
      const matched = stringData.match(/\d{3,4}x\d{3,4}/g);
      if (matched) {
        this.resolutionsArr = this.resolutionsArr.concat(matched);
      }
    }
  }
};

/*
const c = new Camera();
c.resolutions().then(res => console.log(res));
*/
