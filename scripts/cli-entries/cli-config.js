var path = require('path');


exports.getCmdArgs = function(process) {
  var cmdArgs = process.argv;

  try {
    var npmRunArgs = process.env.npm_config_argv;
    if (npmRunArgs) {
      cmdArgs = cmdArgs.concat(JSON.parse(npmRunArgs).original);
    }
  } catch (e) {}

  return cmdArgs;
}


exports.parseConfig = function(process, cmdArgs, sys) {
  if (cmdArgs.indexOf('--skip-node-check') === -1) {
    var minVersion = 6.11;
    var versionMatch = process.version.match(/(\d+).(\d+)/);
    if (versionMatch && parseFloat(versionMatch[0]) < minVersion) {
      console.error(util.chalk.red('ERR: Your Node.js version is ' + util.chalk.bold(process.version) + '. Please update to the latest Node LTS version.\n'));
      process.exit(1);
    }
  }

  var configPath = 'stencil.config.js';

  var appConfigFileNameCmdIndex = cmdArgs.indexOf('--config');
  if (appConfigFileNameCmdIndex > -1) {
    configPath = cmdArgs[appConfigFileNameCmdIndex + 1];
  }

  if (!path.isAbsolute(configPath)) {
    configPath = path.join(process.cwd(), configPath);
  }

  var config = sys.loadConfigFile(configPath);
  config.sys = sys;

  if (cmdArgs.indexOf('--version') > -1 || cmdArgs.indexOf('-v') > -1) {
    var packageJson = require(path.join(__dirname, '../package.json'));
    console.log(packageJson.version);
    process.exit(0);
  }

  if (cmdArgs.indexOf('--prod') > -1) {
    config.devMode = false;
  } else if (cmdArgs.indexOf('--dev') > -1) {
    config.devMode = true;
  }

  if (cmdArgs.indexOf('--watch') > -1) {
    config.watch = true;
  }

  if (cmdArgs.indexOf('--debug') > -1) {
    config.logLevel = 'debug';

  } else {
    var logLevelCmdIndex = cmdArgs.indexOf('--log-level');
    if (logLevelCmdIndex > -1) {
      config.logLevel = cmdArgs[logLevelCmdIndex + 1];
    }
  }

  if (cmdArgs.indexOf('--prerender') === -1) {
    config.prerender = false;

  } else if (!config.prerender) {
    config.prerender = true;
  }

  if (config.devMode) {
    if (cmdArgs.indexOf('--service-worker') > -1 && !config.serviceWorker) {
      // dev mode, but forcing service worker
      // but they didn't provide a sw config
      // so still force it to generate w/ our defaults
      config.serviceWorker = true;

    } else {
      // dev mode, and not forcing service worker
      // so set this to false so it's not generated
      config.serviceWorker = false;
    }

  } else if (!config.serviceWorker) {
    // prod mode, and they didn't provide a sw config
    // so force it generate with our defaults
    config.serviceWorker = true;
  }

  return config;
}