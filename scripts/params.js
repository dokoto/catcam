const nopt = require('nopt');
const noptUsage = require("nopt-usage");

const knownOpts = {
  target: ['dev', 'prod'],
  env: ['loc', 'dev', 'prod'],
  platform: ['web', 'native'],
  version: String,
  languaje: ['EN'],
  help: Boolean,
};

const shortHands = {
  t: ['--target'],
  e: ['--env'],
  p: ['--platform'],
  v: ['--version'],
  l: ['--languaje'],
  h: ['--help']
};

const description = {
  target: 'Tipo de release a generar',
  env: 'Entorno donde se encuentran los servicios',
  platform: 'Plataforma a la que va destinada la release',
  version: 'Version de la app a generar',
  languaje: 'Idioma de la app',
  help: 'Muestra esta ayuda',
};

const defaults = {
  target: 'dev',
  env: 'loc',
  platform: 'web',
  version: '999.999.1',
  languaje: 'EN',
  help: true,
};

module.exports = class Params {
  static get() {
    return {
      options: nopt(knownOpts, shortHands, process.argv, 2),
      usage: noptUsage(knownOpts, shortHands, description, defaults)
    };
  }
};
