import { BuildConfig, BuildContext, HydrateOptions, HydrateResults, PrerenderLocation } from '../../util/interfaces';
import { catchError } from '../util';
import { createRenderer } from '../../server/index';


export function prerenderUrl(config: BuildConfig, ctx: BuildContext, indexSrcHtml: string, prerenderLocation: PrerenderLocation) {
  const timeSpan = config.logger.createTimeSpan(`prerender, started: ${prerenderLocation.pathname}`);

  const results: HydrateResults = {
    diagnostics: []
  };

  return Promise.resolve().then(() => {
    // create the renderer config
    const rendererConfig = Object.assign({}, config);

    // create the hydrate options from the prerender config
    const hydrateOpts: HydrateOptions = Object.assign({}, config.prerender);
    hydrateOpts.url = prerenderLocation.url;
    hydrateOpts.isPrerender = true;

    // set the input html which we just read from the src index html file
    hydrateOpts.html = indexSrcHtml;

    // create a deep copy of the registry so any changes inside the render
    // don't affect what we'll be saving
    const registry = JSON.parse(JSON.stringify(ctx.registry));

    // create a server-side renderer
    const renderer = createRenderer(rendererConfig, registry, ctx);

    // parse the html to dom nodes, hydrate the components, then
    // serialize the hydrated dom nodes back to into html
    return renderer.hydrateToString(hydrateOpts).then(hydratedResults => {
      // hydrating to string is done!!
      // let's use this updated html for the index content now
      Object.assign(results, hydratedResults);

      ctx.prerenderedUrls++;
    });

  }).catch(err => {
    // ahh man! what happened!
    catchError(ctx.diagnostics, err);

  }).then(() => {
    timeSpan.finish(`prerender, finished: ${prerenderLocation.pathname}`);
    return results;
  });
}
