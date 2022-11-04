import type * as d from '../../declarations';

export function hydrateFactory<DocOptions extends d.SerializeDocumentOptions>(
  win: Window,
  opts: d.HydrateDocumentOptions,
  results: d.HydrateResults,
  afterHydrate: (
    win: Window,
    opts: DocOptions,
    results: d.HydrateResults,
    resolve: (results: d.HydrateResults) => void
  ) => void,
  resolve: (results: d.HydrateResults) => void
) {
  win;
  opts;
  results;
  afterHydrate;
  resolve;
}
