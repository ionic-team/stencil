import * as d from '../../declarations';
import { loadConfig as compilerLoadConfig } from '../../compiler/config/load-config';
import { loadConfig as serverLoadConfig } from '../load-config';
import { Renderer } from '../renderer';


export function initApp(ssrConfig: d.ServerConfigInput) {
  if (!ssrConfig.app) {
    throw new Error(`missing "app" config`);
  }

  if (typeof ssrConfig.app.use !== 'function') {
    throw new Error(`invalid express app, missing the "app.use()" function`);
  }

  if (typeof ssrConfig.configPath !== 'string') {
    ssrConfig.configPath = process.cwd();
  }

  // load up the user's config
  // to be passed to the middleware
  const middlewareConfig: d.MiddlewareConfig = {
    config: serverLoadConfig(ssrConfig.configPath)
  };

  // start the ssr middleware
  ssrConfig.app.use(ssrPathRegex, ssrMiddleware(middlewareConfig));

  const wwwOutput = (middlewareConfig.config as d.Config).outputTargets.find(o => {
    return o.type === 'www';
  }) as d.OutputTargetWww;

  if (!wwwOutput || typeof wwwOutput.dir !== 'string') {
    throw new Error(`unable to find www directory to serve static files from`);
  }

  return {
    config: (middlewareConfig.config as d.Config),
    logger: (middlewareConfig.config as d.Config).logger,
    wwwDir: wwwOutput.dir,
    destroy: () => {
      (middlewareConfig.config as d.Config).sys.destroy();
    }
  } as d.ServerConfigOutput;
}


export function ssrMiddleware(middlewareConfig: d.MiddlewareConfig) {
  // load up the config
  const path = require('path');
  const nodeSys = require(path.join(__dirname, '..', 'sys', 'node', 'index.js'));
  middlewareConfig.config = compilerLoadConfig(nodeSys.sys, middlewareConfig.config);

  const config: d.Config = middlewareConfig.config;

  // set the ssr flag
  config.flags = config.flags || {};
  config.flags.ssr = true;

  // create the renderer
  const renderer = new Renderer(middlewareConfig.config);

  // add the destroy fn to the middleware config
  // this will exit all forked workers
  middlewareConfig.destroy = () => {
    (middlewareConfig.config as d.Config).sys.destroy();
  };

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
