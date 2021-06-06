import type * as d from '../../declarations';
import { flatOne, unique } from '@utils';

export function resolveComponentDependencies(cmps: d.ComponentCompilerMeta[]) {
  computeDependencies(cmps);
  computeDependents(cmps);
}

function computeDependencies(cmps: d.ComponentCompilerMeta[]) {
  const visited = new Set<d.ComponentCompilerMeta>();
  cmps.forEach(cmp => {
    resolveTransitiveDependencies(cmp, cmps, visited);
    cmp.dependencies = unique(cmp.dependencies).sort();
  });
}

function computeDependents(cmps: d.ComponentCompilerMeta[]) {
  cmps.forEach(cmp => {
    resolveTransitiveDependents(cmp, cmps);
  });
}

function resolveTransitiveDependencies(cmp: d.ComponentCompilerMeta, cmps: d.ComponentCompilerMeta[], visited: Set<d.ComponentCompilerMeta>): string[] {
  if (visited.has(cmp)) {
    return cmp.dependencies;
  }
  visited.add(cmp);

  const dependencies = unique(cmp.potentialCmpRefs.filter(tagName => cmps.some(c => c.tagName === tagName)));

  cmp.dependencies = cmp.directDependencies = dependencies;
  const transitiveDeps = flatOne(dependencies.map(tagName => cmps.find(c => c.tagName === tagName)).map(c => resolveTransitiveDependencies(c, cmps, visited)));
  return (cmp.dependencies = [...dependencies, ...transitiveDeps]);
}

function resolveTransitiveDependents(cmp: d.ComponentCompilerMeta, cmps: d.ComponentCompilerMeta[]) {
  cmp.dependents = cmps
    .filter(c => c.dependencies.includes(cmp.tagName))
    .map(c => c.tagName)
    .sort();

  cmp.directDependents = cmps
    .filter(c => c.directDependencies.includes(cmp.tagName))
    .map(c => c.tagName)
    .sort();
}
