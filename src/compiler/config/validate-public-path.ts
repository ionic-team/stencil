import { Config } from '../../declarations';
import { normalizePath } from '../util';


export function validatePublicPath(config: Config) {
  if (typeof config.discoverPublicPath !== 'boolean') {
    // only do this check if the config hasn't been fully validated yet
    // if the config has a publicPath, then let's remember it was a custom one
    config.discoverPublicPath = (typeof config.publicPath !== 'string');
  }

  if (typeof config.publicPath !== 'string') {
    // CLIENT SIDE ONLY! Do not use this for server-side file read/writes
    // this is a reference to the public static directory from the index.html running from a browser
    // in most cases it's just "build", as in index page would request scripts from `/build/`
    config.publicPath = normalizePath(
      config.sys.path.relative(config.wwwDir, config.buildDir)
    );
    if (config.publicPath.charAt(0) !== '/') {
      // ensure prefix / by default
      config.publicPath = '/' + config.publicPath;
    }
  }

  config.publicPath = config.publicPath.trim();

  if (config.publicPath.charAt(config.publicPath.length - 1) !== '/') {
    // ensure there's a trailing /
    config.publicPath += '/';
  }
}
