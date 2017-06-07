module.exports = require('yargs')
  .usage('Usage: $0 [options]')
  // PLATFORM OPTION
  .array('platform')
  .describe('platform', 'Tipo de release')
  .choices('platform', ['web', 'native'])
  .alias('p', 'platform')
  .demandOption(['platform'])
  // TARGET OPTION
  .array('target')
  .describe('target', 'Tipo de release a generar')
  .choices('target', ['dev', 'prod'])
  .alias('t', 'target')
  .demandOption(['target'])
  // ENV OPTION
  .array('env')
  .describe('env', 'Entorno donde se encuentran los servicios')
  .choices('env', ['loc', 'dev', 'prod'])
  .alias('e', 'env')
  .demandOption(['env'])
  // OS OPTION
  .array('os')
  .describe('os', 'Sistema operativo movil a compilar')
  .choices('os', ['android', 'ios'])
  .alias('o', 'os')
  .default('os', 'android')
  // LANGUAJE OPTION
  .array('lang')
  .describe('lang', 'Idioma de la app')
  .choices('lang', ['EN', 'ES'])
  .alias('l', 'lang')
  .demandOption(['lang'])
  // LANGUAJE OPTION
  .describe('version', 'Version de la app a generar')
  .alias('vers', 'version')
  .demandOption(['version'])
  // VERBOSE
  .count('verbose')
  .alias('v', 'verbose')
  .describe('verbose', 'Log ampliado')
  // HELP
  .help('h')
  .alias('h', 'help').argv;

// console.log(JSON.stringify(argv));
