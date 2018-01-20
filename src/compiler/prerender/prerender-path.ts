import { BuildCtx, CompilerCtx, Config, HydrateOptions, HydrateResults } from '../../declarations';
import { catchError } from '../util';
import { PrerenderLocation } from './prerender-utils';
import { Renderer } from '../../server/index';


export async function prerenderPath(config: Config, compilerCtx: CompilerCtx, buildCtx: BuildCtx, indexSrcHtml: string, prerenderLocation: PrerenderLocation) {
  const timeSpan = config.logger.createTimeSpan(`prerender, started: ${prerenderLocation.path}`);

  const results: HydrateResults = {
    diagnostics: []
  };

  try {
    // create the renderer config
    const rendererConfig = Object.assign({}, config);

    // create the hydrate options from the prerender config
    const hydrateOpts: HydrateOptions = rendererConfig.prerender as HydrateOptions;
    hydrateOpts.url = prerenderLocation.url;
    hydrateOpts.isPrerender = true;

    // set the input html which we just read from the src index html file
    hydrateOpts.html = indexSrcHtml;

    // create a server-side renderer
    const renderer = new Renderer(rendererConfig, compilerCtx);

    // parse the html to dom nodes, hydrate the components, then
    // serialize the hydrated dom nodes back to into html
    const hydratedResults = await renderer.hydrate(hydrateOpts);

    // hydrating to string is done!!
    // let's use this updated html for the index content now
    Object.assign(results, hydratedResults);

  } catch (e) {
    // ahh man! what happened!
    catchError(buildCtx.diagnostics, e);
  }

  timeSpan.finish(`prerender, finished: ${prerenderLocation.path}`);

  return results;
}
