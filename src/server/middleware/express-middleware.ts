import { Config } from '../../declarations';
import { loadConfig } from '../../compiler/config/load-config';
import { Renderer } from '../renderer';


export function ssrMiddleware(middlewareConfig: MiddlewareConfig) {
  // load up the config
  const path = require('path');
  const nodeSys = require(path.join(__dirname, '../sys/node/index.js'));
  const config = loadConfig(nodeSys.sys, middlewareConfig.config);

  // create the renderer
  const renderer = new Renderer(config);

  let srcIndexHtml: string;
  try {
    // load the source index.html
    srcIndexHtml = renderer.fs.readFileSync(config.srcIndexHtml);

  } catch (e) {
    config.logger.error(`ssrMiddleware, error loading srcIndexHtml`, e);
    process.exit(1);
  }

  // middleware fn
  return function(req: any, res: any) {
    config.logger.debug(`ssr request: ${req.url}`);

    // hydrate level 4, please!
    renderer.hydrate({
      html: srcIndexHtml,
      req: req
    }).then(results => {

      // print out any diagnostics
      config.logger.printDiagnostics(results.diagnostics);

      // respond with the hydrated html
      res.send(results.html);
    });
  };
}

/**
 * SSR Path Regex matches urls which end with index.html,
 * urls with a trailing /, and urls with no trailing slash,
 * but also do not have a file extension. The following example
 * urls would all match (with or without a querystring):
 *   /index.html
 *   /about
 *   /about/
 *   /
 *
 * The follwing example url would not match:
 *   /image.jpg
 *   /font.woff
 *
 * Please see the unit tests if any changes are required.
 */
export const ssrPathRegex = /^([^.+]|.html)*(\?.*)?$/i;


export interface MiddlewareConfig {
  config: string | Config;
}
