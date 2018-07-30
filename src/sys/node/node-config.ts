import * as d from '../../declarations';
import * as path from 'path';


export function loadConfigFile(fs: d.FileSystem, configPath: string, process?: NodeJS.Process) {
  let config: d.Config;

  let cwd = '';
  if (process) {
    if (process.cwd) {
      cwd = process.cwd();
    }
    if (process.env && typeof process.env.PWD === 'string') {
      cwd = process.env.PWD;
    }
  }

  let hasConfigFile = false;

  if (typeof configPath === 'string') {
    if (!path.isAbsolute(configPath)) {
      throw new Error(`Stencil configuration file "${configPath}" must be an absolute path.`);
    }

    try {
      let fileStat = fs.statSync(configPath);
      if (fileStat.isFile()) {
        hasConfigFile = true;

      } else if (fileStat.isDirectory()) {
        // this is only a directory, so let's just assume we're looking for in stencil.config.js
        // otherwise they could pass in an absolute path if it was somewhere else
        configPath = path.join(configPath, 'stencil.config.js');
        fileStat = fs.statSync(configPath);
        hasConfigFile = fileStat.isFile();
      }
    } catch (e) {}
  }

  if (hasConfigFile) {
    // the passed in config was a string, so it's probably a path to the config we need to load
    // first clear the require cache so we don't get the same file
    const configFileData = requireConfigFile(fs, configPath);
    if (!configFileData.config) {
      throw new Error(`Invalid Stencil configuration file "${configPath}". Missing "config" property.`);
    }
    config = configFileData.config;
    config.configPath = configPath;

    if (!config.rootDir && configPath) {
      config.rootDir = path.dirname(configPath);
    }

  } else {
    // no stencil.config.js or ts file, which is fine
    // #0CJS
    config = {
      rootDir: cwd
    };
  }

  config.cwd = cwd;

  return config;
}


export function requireConfigFile(fs: d.FileSystem, configPath: string) {
  delete require.cache[path.resolve(configPath)];
  let code = fs.readFileSync(configPath);
  code = code.replace(/export\s+\w+\s+(\w+)/gm, 'exports.$1');

  const defaultLoader = require.extensions['.js'];
  require.extensions['.js'] = (module: NodeModuleWithCompile, filename: string) => {
    if (filename === configPath) {
      module._compile(code, filename);
    } else {
      defaultLoader(module, filename);
    }
  };

  const config = require(configPath);
  require.extensions['.js'] = defaultLoader;
  return config;
}


interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}
