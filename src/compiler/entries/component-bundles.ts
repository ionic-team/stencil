import * as d from '../../declarations';
import { sortBy } from '@utils';
import { getDefaultBundles } from './default-bundles';
import { resolveComponentDependencies } from './resolve-component-dependencies';


export function generateComponentBundles(
  config: d.Config,
  buildCtx: d.BuildCtx,
): d.ComponentCompilerMeta[][] {
  let cmps = buildCtx.components;
  if (config.devMode) {
    return cmps.map(cmp => [cmp]);
  }
  resolveComponentDependencies(cmps);

  const defaultBundles = getDefaultBundles(config, buildCtx, cmps);

  // user config entry modules you leave as is
  // whatever the user put in the bundle is how it goes
  cmps = sortBy(cmps, cmp => cmp.dependants.length);
  const included = new Set();
  defaultBundles.forEach(entry => {
    entry.forEach(cmp => included.add(cmp));
  });

  const bundlers: d.ComponentCompilerMeta[][] = [
    ...defaultBundles,
    ...cmps.filter(cmp => !included.has(cmp)).map(cmp => [cmp])
  ];
  return optimizeBundlers(bundlers, 0.6);
}


function optimizeBundlers(entryPoints: d.ComponentCompilerMeta[][], threshold: number) {
  const cmpMap = new Map<string, number>();
  entryPoints.forEach((entry, index) => {
    entry.forEach(cmp => {
      cmpMap.set(cmp.tagName, index);
    });
  });

  const visited = new Uint8Array(entryPoints.length);
  const matrix = entryPoints.map(entry => {
    const vector = new Uint8Array(entryPoints.length);
    entry.forEach(cmp => {
      cmp.dependants.forEach(tag => vector[cmpMap.get(tag)] = 1);
    });
    entry.forEach(cmp => vector[cmpMap.get(cmp.tagName)] = 0);
    return vector;
  });

  // resolve similar components
  const bundles: d.ComponentCompilerMeta[][] = [];

  for (let i = 0; i < matrix.length; i++) {
    if (visited[i] === 0) {
      const bundle = [...entryPoints[i]];
      visited[i] = 1;
      for (let j = i + 1; j < matrix.length; j++) {
        if (visited[j] === 0 && computeScore(matrix[i], matrix[j]) > threshold) {
          bundle.push(...entryPoints[j]);
          visited[j] = 1;
        }
      }
      bundles.push(bundle);
    }
  }
  return bundles;
}

function computeScore(m0: Uint8Array, m1: Uint8Array) {
  let total = 0;
  let match = 0;
  for (let i = 0; i < m0.length; i++) {
    if (m0[i] === 1 || m1[i] === 1) {
      total++;
      if (m0[i] === m1[i]) {
        match++;
      }
    }
  }
  return match / total;
}
