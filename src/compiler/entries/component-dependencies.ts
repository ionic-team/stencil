import * as d from '../../declarations';
import { flatOne, unduplicate } from '@utils';

export function calcComponentDependencies(cmps: d.ComponentCompilerMeta[]) {
  const componentRefs: d.ComponentRef[] = [];
  const visited = new Set();
  // Compute dependencies
  cmps.forEach(cmp => {
    resolveDependencies(cmp.tagName, cmps, visited);
  });

  // Compute dependants
  cmps.forEach(cmp => {
    cmp.dependants = cmps
      .filter(c => c.dependencies.includes(cmp.tagName))
      .map(c => c.tagName)
      .sort();
  });
  return componentRefs;
}

function resolveDependencies(tagName: string, cmps: d.ComponentCompilerMeta[], visited: Set<string>): string[] {
  const cmp = cmps.find(c => c.tagName === tagName);
  if (visited.has(tagName)) {
    return cmp.dependencies;
  }
  visited.add(cmp.tagName);
  const dependencies = cmp.potentialCmpRefs.filter(tagName => cmps.some(c => c.tagName === tagName));
  const transitiveDeps = flatOne(
    dependencies.map(tagName => resolveDependencies(tagName, cmps, visited))
  );
  return cmp.dependencies = unduplicate([
    ...dependencies,
    ...transitiveDeps
  ]).sort();
}
