import { Config, OutputTarget } from '../../declarations';
import { normalizePath } from '../util';


export function validatePublicPath(config: Config, outputTarget: OutputTarget) {
  if (outputTarget.type !== 'www' && outputTarget.type !== 'dist') {
    return;
  }

  if (typeof outputTarget.discoverPublicPath !== 'boolean') {
    // only do this check if the config hasn't been fully validated yet
    // if the config has a publicPath, then let's remember it was a custom one
    outputTarget.discoverPublicPath = (typeof outputTarget.publicPath !== 'string');
  }

  if (typeof outputTarget.publicPath !== 'string') {
    // CLIENT SIDE ONLY! Do not use this for server-side file read/writes
    // this is a reference to the public static directory from the index.html running from a browser
    // in most cases it's just "build", as in index page would request scripts from `/build/`

    outputTarget.publicPath = normalizePath(
      config.sys.path.relative(outputTarget.path, outputTarget.buildPath)
    );

    if (outputTarget.publicPath.charAt(0) !== '/') {
      // ensure prefix / by default
      outputTarget.publicPath = '/' + outputTarget.publicPath;
    }
  }

  outputTarget.publicPath = outputTarget.publicPath.trim();

  if (outputTarget.publicPath.charAt(outputTarget.publicPath.length - 1) !== '/') {
    // ensure there's a trailing /
    outputTarget.publicPath += '/';
  }
}
