import { ComponentMeta, ComponentReference, ModuleFiles, ModuleGraph } from '../../declarations';


export function calcComponentDependencies(moduleFiles: ModuleFiles, moduleGraphs: ModuleGraph[], componentRefs: ComponentReference[]) {
  Object.keys(moduleFiles).forEach(filePath => {
    const moduleFile = moduleFiles[filePath];
    if (moduleFile.cmpMeta) {
      getComponentDependencies(moduleGraphs, componentRefs, filePath, moduleFile.cmpMeta);
    }
  });
}


function getComponentDependencies(moduleGraphs: ModuleGraph[], componentRefs: ComponentReference[], filePath: string, cmpMeta: ComponentMeta) {
  // we may have already figured out some dependencies (collections aready have this info)
  cmpMeta.dependencies = cmpMeta.dependencies || [];

  // push on any new tags we found through component references
  cmpMeta.dependencies.push(...componentRefs.filter(cr => cr.filePath === filePath).map(cr => cr.tag));

  const importsInspected: string[] = [];

  const moduleGraph = moduleGraphs.find(mg => mg.filePath === filePath);
  if (moduleGraph) {
    getComponentDepsFromImports(moduleGraphs, componentRefs, importsInspected, moduleGraph, cmpMeta);
  }

  cmpMeta.dependencies.sort();
}


function getComponentDepsFromImports(moduleGraphs: ModuleGraph[], componentRefs: ComponentReference[], importsInspected: string[], moduleGraph: ModuleGraph, cmpMeta: ComponentMeta) {
  moduleGraph.importPaths.forEach(importPath => {
    if (importsInspected.includes(importPath)) {
      return;
    }

    importsInspected.push(importPath);

    const subModuleGraph = moduleGraphs.find(mg => {
      return (mg.filePath === importPath) ||
             (mg.filePath === importPath + '.ts') ||
             (mg.filePath === importPath + '.tsx') ||
             (mg.filePath === importPath + '.js');
    });

    if (subModuleGraph) {
      const tags = componentRefs.filter(cr => cr.filePath === subModuleGraph.filePath).map(cr => cr.tag);

      tags.forEach(tag => {
        if (!cmpMeta.dependencies.includes(tag)) {
          cmpMeta.dependencies.push(tag);
        }
      });

      getComponentDepsFromImports(moduleGraphs, componentRefs, importsInspected, subModuleGraph, cmpMeta);
    }
  });
}
