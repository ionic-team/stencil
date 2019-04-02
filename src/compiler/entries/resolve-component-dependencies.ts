import * as d from '../../declarations';
import { flatOne, unique } from '@utils';

export function resolveComponentDependencies(cmps: d.ComponentCompilerMeta[]) {
  computeDependencies(cmps);
  computeDependants(cmps);
}

function computeDependencies(cmps: d.ComponentCompilerMeta[]) {
  const visited = new Set();
  cmps.forEach(cmp => {
    cmp.dependencies = resolveTransitiveDependencies(cmp, cmps, visited);
  });
}

function computeDependants(cmps: d.ComponentCompilerMeta[]) {
  cmps.forEach(cmp => {
    cmp.dependants = resolveTransitiveDependants(cmp.tagName, cmps);
  });
}

function resolveTransitiveDependencies(cmp: d.ComponentCompilerMeta, cmps: d.ComponentCompilerMeta[], visited: Set<string>): string[] {
  if (visited.has(cmp.tagName)) {
    return cmp.dependencies;
  }
  visited.add(cmp.tagName);
  const dependencies = cmp.potentialCmpRefs.filter(tagName => cmps.some(c => c.tagName === tagName));
  const transitiveDeps = flatOne(
    dependencies
      .map(tagName => cmps.find(c => c.tagName === tagName))
      .map(c => resolveTransitiveDependencies(c, cmps, visited))
  );
  return unique([
    ...dependencies,
    ...transitiveDeps
  ]).sort();
}

function resolveTransitiveDependants(tagName: string, cmps: d.ComponentCompilerMeta[]) {
  return cmps
    .filter(c => c.dependencies.includes(tagName))
    .map(c => c.tagName)
    .sort();
}
