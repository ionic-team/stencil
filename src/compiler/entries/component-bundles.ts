import * as d from '../../declarations';
import { sortBy } from '@utils';
import { getDefaultBundles } from './default-bundles';


export function generateComponentBundles(
  config: d.Config,
  buildCtx: d.BuildCtx,
): d.ComponentCompilerMeta[][] {
  const cmps = sortBy(buildCtx.components, cmp => cmp.dependants.length);
  if (config.devMode) {
    const devCmps = (config.excludeUnusedDependencies)
      ? filterUnusedDependencies(cmps, cmps)
      : cmps;

    return devCmps.map(cmp => [cmp]);
  }

  const defaultBundles = getDefaultBundles(config, buildCtx, cmps);

  // Visit components that are already in one of the default bundlers
  const visited = new Set();
  defaultBundles.forEach(entry => {
    entry.forEach(cmp => visited.add(cmp));
  });

  let remainingComponents: d.ComponentCompilerMeta[] = cmps
    .filter(cmp => !visited.has(cmp));

  if (config.excludeUnusedDependencies) {
    remainingComponents = filterUnusedDependencies(remainingComponents, cmps);
  }

  const bundlers = remainingComponents.map(c => [c]);
  return [
    ...defaultBundles,
    ...optimizeBundlers(bundlers, 0.6)
  ].filter(b => b.length > 0);
}

function filterUnusedDependencies(remainingComponents: d.ComponentCompilerMeta[], allCmps: d.ComponentCompilerMeta[]) {
  return remainingComponents.filter(c => (
    !c.isCollectionDependency ||
    c.dependants.some(dep => allCmps.some(c => c.tagName === dep && !c.isCollectionDependency))
  ));
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
      cmp.dependants.forEach(tag => {
        const index = cmpIndexMap.get(tag);
        if (index !== undefined) {
          vector[index] = 1;
        }
      });
    });
    entry.forEach(cmp => {
      const index = cmpIndexMap.get(cmp.tagName);
      if (index !== undefined) {
        vector[index] = 0;
      }
    });
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
