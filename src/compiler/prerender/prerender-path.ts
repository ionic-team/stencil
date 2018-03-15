import * as d from '../../declarations';
import { catchError } from '../util';
import { Renderer } from '../../server/index';


export async function prerenderPath(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, outputTarget: d.OutputTargetWww, indexSrcHtml: string, prerenderLocation: d.PrerenderLocation) {
  const msg = outputTarget.hydrateComponents ? 'prerender' : 'optimize html';
  const timeSpan = config.logger.createTimeSpan(`${msg}, started: ${prerenderLocation.path}`);

  const results: d.HydrateResults = {
    diagnostics: []
  };

  try {
    // create the renderer config
    const rendererConfig = Object.assign({}, config);

    // create the hydrate options from the prerender config
    const hydrateOpts: d.HydrateOptions = {};
    hydrateOpts.url = prerenderLocation.url;
    hydrateOpts.isPrerender = true;

    // set the input html which we just read from the src index html file
    hydrateOpts.html = indexSrcHtml;

    // create a server-side renderer
    const renderer = new Renderer(rendererConfig, null, compilerCtx, outputTarget);

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

  timeSpan.finish(`${msg}, finished: ${prerenderLocation.path}`);

  return results;
}
