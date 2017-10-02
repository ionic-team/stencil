import { BuildConfig } from '../util/interfaces';
import { createRenderer } from './renderer';
import { loadConfig } from './load-config';


export function ssrMiddleware(middlewareConfig: MiddlewareConfig) {
  // load up the config
  const config = loadConfig(middlewareConfig.config);

  // create the renderer
  const renderer = createRenderer(config);

  let srcIndexHtml: string;
  try {
    // load the source index.html
    srcIndexHtml = config.sys.fs.readFileSync(config.srcIndexHtml, 'utf-8');

  } catch (e) {
    config.logger.error(`ssrMiddleware, error loading srcIndexHtml: ${e}`);
    process.exit(1);
  }

  // middleware fn
  return function(req: any, res: any) {
    config.logger.debug(`ssr request: ${req.url}`);

    // hydrate level 4, please!
    renderer.hydrateToString({
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
  config: string | BuildConfig;
}
