import * as d from '../../declarations';
import { flatOne, unique } from '@utils';

export function resolveComponentDependencies(compilerCtx: d.CompilerCtx, cmps: d.ComponentCompilerMeta[]) {
  computeDependencies(compilerCtx, cmps);
  computeDependants(cmps);
}

function computeDependencies(compilerCtx: d.CompilerCtx, cmps: d.ComponentCompilerMeta[]) {
  const visited = new Set();
  cmps.forEach(cmp => {
    resolveTransitiveDependencies(compilerCtx, cmp, cmps, visited);
    cmp.dependencies = unique(cmp.dependencies).sort();
  });
}

function computeDependants(cmps: d.ComponentCompilerMeta[]) {
  cmps.forEach(cmp => {
    resolveTransitiveDependants(cmp, cmps);
  });
}

function resolveTransitiveDependencies(compilerCtx: d.CompilerCtx, cmp: d.ComponentCompilerMeta, cmps: d.ComponentCompilerMeta[], visited: Set<d.ComponentCompilerMeta>): string[] {
  if (visited.has(cmp)) {
    return cmp.dependencies;
  }
  visited.add(cmp);

  const moduleFile = compilerCtx.moduleMap.get(cmp.sourceFilePath);

  const dependencies = moduleFile.potentialCmpRefs.filter(tagName => cmps.some(c => c.tagName === tagName));
  cmp.dependencies = cmp.directDependencies = dependencies;

  const transitiveDeps = flatOne(
    dependencies
      .map(tagName => cmps.find(c => c.tagName === tagName))
      .map(c => resolveTransitiveDependencies(compilerCtx, c, cmps, visited))
  );
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
