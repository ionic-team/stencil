import type * as d from '../../declarations';
import { sortBy } from '@utils';
import { getDefaultBundles } from './default-bundles';

export function computeUsedComponents(
  config: d.Config,
  defaultBundles: d.ComponentCompilerMeta[][],
  allCmps: d.ComponentCompilerMeta[],
) {
  if (!config.excludeUnusedDependencies) {
    return new Set(allCmps.map(c => c.tagName));
  }
  const usedComponents = new Set<string>();

  // All components
  defaultBundles.forEach(entry => {
    entry.forEach(cmp => usedComponents.add(cmp.tagName));
  });
  allCmps.forEach(cmp => {
    if (!cmp.isCollectionDependency) {
      usedComponents.add(cmp.tagName);
    }
  });
  allCmps.forEach(cmp => {
    if (cmp.isCollectionDependency) {
      if (cmp.dependents.some(dep => usedComponents.has(dep))) {
        usedComponents.add(cmp.tagName);
      }
    }
  });

  return usedComponents;
}

export function generateComponentBundles(config: d.Config, buildCtx: d.BuildCtx): d.ComponentCompilerMeta[][] {
  const cmps = sortBy(buildCtx.components, cmp => cmp.dependents.length);
  const defaultBundles = getDefaultBundles(config, buildCtx, cmps);
  const usedComponents = computeUsedComponents(config, defaultBundles, cmps);

  if (config.devMode) {
    return cmps.filter(c => usedComponents.has(c.tagName)).map(cmp => [cmp]);
  }

  // Visit components that are already in one of the default bundlers
  const alreadyBundled = new Set();
  defaultBundles.forEach(entry => {
    entry.forEach(cmp => alreadyBundled.add(cmp));
  });

  const bundlers: d.ComponentCompilerMeta[][] = cmps
    .filter(cmp => usedComponents.has(cmp.tagName) && !alreadyBundled.has(cmp))
    .map(c => [c]);

  return [...defaultBundles, ...optimizeBundlers(bundlers, 0.6)].filter(b => b.length > 0);
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
      cmp.dependents.forEach(tag => {
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
