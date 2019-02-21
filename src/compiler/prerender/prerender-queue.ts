import * as d from '@declarations';
import { normalizePrerenderPath } from './normalize-prerender-path';


export function addUrlPathsFromOutputTarget(instructions: d.PrerenderInstructions) {
  if (Array.isArray(instructions.outputTarget.prerenderLocations) === true) {
    instructions.outputTarget.prerenderLocations.forEach(prerenderLocation => {
      addUrlPathToPending(instructions, PRERENDER_HOST, prerenderLocation.path);
    });
  }
}


export function addUrlPathToPending(instructions: d.PrerenderInstructions, windowLocationHref: string, inputPath: string) {
  const normalizedPath = normalizePrerenderPath(
    instructions.config,
    instructions.outputTarget,
    windowLocationHref,
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
