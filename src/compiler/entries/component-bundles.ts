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

  cmps = sortBy(cmps, cmp => cmp.dependants.length);

  // Visit components that are already in one of the default bundlers
  const visited = new Set();
  defaultBundles.forEach(entry => {
    entry.forEach(cmp => visited.add(cmp));
  });

  const bundlers: d.ComponentCompilerMeta[][] = [
    ...defaultBundles,
    ...cmps
        .filter(cmp => !visited.has(cmp))
        .map(cmp => [cmp])
  ];
  return optimizeBundlers(bundlers, 0.6);

}


function optimizeBundlers(bundles: d.ComponentCompilerMeta[][], threshold: number) {
  const cmpIndexMap = new Map<string, number>();
  bundles.forEach((entry, index) => {
    entry.forEach(cmp => {
      cmpIndexMap.set(cmp.tagName, index);
    });
  });

  const visited = new Uint8Array(bundles.length);
  const matrix = bundles.map(entry => {
    const vector = new Uint8Array(bundles.length);
    entry.forEach(cmp => {
      cmp.dependants.forEach(tag => vector[cmpIndexMap.get(tag)] = 1);
    });
    entry.forEach(cmp => vector[cmpIndexMap.get(cmp.tagName)] = 0);
    return vector;
  });

  // resolve similar components
  const newBundles: d.ComponentCompilerMeta[][] = [];

  for (let i = 0; i < matrix.length; i++) {
    // check if bundle is visited (0 means it's not)
    if (visited[i] === 0) {
      const bundle = [...bundles[i]];
      visited[i] = 1;
      for (let j = i + 1; j < matrix.length; j++) {
        if (visited[j] === 0 && computeScore(matrix[i], matrix[j]) >= threshold) {
          bundle.push(...bundles[j]);
          visited[j] = 1;
        }
      }
      newBundles.push(bundle);
    }
  }
  return newBundles;
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
