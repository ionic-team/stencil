import * as d from '../../declarations';
import { flatOne, unique } from '@utils';

export function resolveComponentDependencies(cmps: d.ComponentCompilerMeta[]) {
  computeDependencies(cmps);
  computeDependants(cmps);
}

function computeDependencies(cmps: d.ComponentCompilerMeta[]) {
  const visited = new Set();
  cmps.forEach(cmp => {
    resolveTransitiveDependencies(cmp, cmps, visited);
    cmp.dependencies = unique(cmp.dependencies).sort();
  });
}

function computeDependants(cmps: d.ComponentCompilerMeta[]) {
  cmps.forEach(cmp => {
    resolveTransitiveDependants(cmp, cmps);
  });
}

function resolveTransitiveDependencies(cmp: d.ComponentCompilerMeta, cmps: d.ComponentCompilerMeta[], visited: Set<string>): string[] {
  if (visited.has(cmp.tagName)) {
    return cmp.dependencies;
  }
  // Reset deps
  cmp.dependencies = cmp.directDependencies = [];
  visited.add(cmp.tagName);

  const dependencies = cmp.potentialCmpRefs.filter(tagName => cmps.some(c => c.tagName === tagName));
  const transitiveDeps = flatOne(
    dependencies
      .map(tagName => cmps.find(c => c.tagName === tagName))
      .map(c => resolveTransitiveDependencies(c, cmps, visited))
  );
  cmp.directDependencies = dependencies;
  return cmp.dependencies = [
    ...dependencies,
    ...transitiveDeps
  ];
}

function resolveTransitiveDependants(cmp: d.ComponentCompilerMeta, cmps: d.ComponentCompilerMeta[]) {
  cmp.dependants = cmps
    .filter(c => c.dependencies.includes(cmp.tagName))
    .map(c => c.tagName)
    .sort();

  cmp.directDependants = cmps
    .filter(c => c.directDependencies.includes(cmp.tagName))
    .map(c => c.tagName)
    .sort();
}
