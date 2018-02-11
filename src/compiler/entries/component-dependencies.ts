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
  cmpMeta.dependencies = componentRefs.filter(cr => cr.filePath === filePath).map(cr => cr.tag);

  const moduleGraph = moduleGraphs.find(mg => mg.filePath === filePath);
  if (moduleGraph) {
    getComponentDepsFromImports(moduleGraphs, componentRefs, moduleGraph, cmpMeta);
  }

  cmpMeta.dependencies.sort();
}


function getComponentDepsFromImports(moduleGraphs: ModuleGraph[], componentRefs: ComponentReference[], moduleGraph: ModuleGraph, cmpMeta: ComponentMeta) {
  moduleGraph.importPaths.forEach(importPath => {
    const subModuleGraph = moduleGraphs.find(mg => {
      return (mg.filePath === importPath) ||
             (mg.filePath === importPath + '.ts') ||
             (mg.filePath === importPath + '.tsx') ||
             (mg.filePath === importPath + '.js');
    });

    if (subModuleGraph) {
      const tags = componentRefs.filter(cr => cr.filePath === subModuleGraph.filePath).map(cr => cr.tag);

      cmpMeta.dependencies.push(...tags);

      getComponentDepsFromImports(moduleGraphs, componentRefs, subModuleGraph, cmpMeta);
    }
  });
}
