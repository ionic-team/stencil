import * as d from '@declarations';
import { normalizePrerenderPath } from './normalize-prerender-path';
import { URL } from 'url';


export function addUrlPathsFromOutputTarget(instructions: d.PrerenderInstructions) {
  if (Array.isArray(instructions.outputTarget.prerenderLocations) === true) {
    const url = new URL('/', PRERENDER_HOST);
    instructions.outputTarget.prerenderLocations.forEach(p => {
      addUrlPathToPending(instructions, url, p);
    });
  }
}


export function addUrlPathToPending(instructions: d.PrerenderInstructions, windowLocationUrl: URL, inputPath: string) {
  const prodMode = (!instructions.config.devMode && instructions.config.logLevel !== 'debug');

  const normalizedPath = normalizePrerenderPath(
    prodMode,
    instructions.outputTarget,
    windowLocationUrl,
    inputPath
  );

  if (typeof normalizedPath !== 'string') {
    return;
  }

  if (instructions.pathsPending.has(normalizedPath) === true) {
    return;
  }

  if (instructions.pathsProcessing.has(normalizedPath) === true) {
    return;
  }

  if (instructions.pathsCompleted.has(normalizedPath) === true) {
    return;
  }

  // add this to our pending queue of urls to prerender
  instructions.pathsPending.add(normalizedPath);
}


export const PRERENDER_HOST = `http://prerender.stenciljs.com`;
