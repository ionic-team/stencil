import * as d from '../../declarations';


export function hydrateFactory(
  win: Window,
  opts: d.HydrateDocumentOptions,
  results: d.HydrateResults,
  afterHydrate: (win: Window, opts: d.RenderToStringOptions, results: d.HydrateResults, resolve: (results: d.HydrateResults) => void) => void,
  resolve: (results: d.HydrateResults) => void
) {
  win;
  opts;
  results;
  afterHydrate;
  resolve;
}
