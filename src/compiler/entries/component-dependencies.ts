import { CompilerCtx, ComponentMeta, ComponentRef, ModuleFiles, ModuleGraph, PotentialComponentRef } from '../../declarations';
import { getComponentRefsFromSourceStrings } from './component-references';


export function calcModuleGraphImportPaths(compilerCtx: CompilerCtx, moduleGraphs: ModuleGraph[]) {
  // figure out the actual source's file path
  // cuz right now the import paths probably don't have the extension on them
  moduleGraphs.forEach(mg => {
    mg.importPaths = mg.importPaths.map(importPath => {
      if (importPath.startsWith('.') || importPath.startsWith('/')) {
        for (const srcExt of SRC_EXTS) {
          const srcFilePath = importPath + srcExt;
          if (compilerCtx.moduleFiles[srcFilePath]) {
            return srcFilePath;
          }
        }
      }
      return importPath;
    });
  });
}

const SRC_EXTS = ['.tsx', '.ts', '.js'];


export function calcComponentDependencies(allModuleFiles: ModuleFiles, moduleGraphs: ModuleGraph[], sourceStrings: PotentialComponentRef[]) {
  // figure out all the component references seen in each file
  const componentRefs = getComponentRefsFromSourceStrings(allModuleFiles, sourceStrings);

  Object.keys(allModuleFiles).forEach(filePath => {
    const moduleFile = allModuleFiles[filePath];
    if (moduleFile.cmpMeta) {
      getComponentDependencies(moduleGraphs, componentRefs, filePath, moduleFile.cmpMeta);
    }
  });
}


function getComponentDependencies(moduleGraphs: ModuleGraph[], componentRefs: ComponentRef[], filePath: string, cmpMeta: ComponentMeta) {
  // we may have already figured out some dependencies (collections aready have this info)
  cmpMeta.dependencies = cmpMeta.dependencies || [];

  // figure out if this file has any components in it
  const refTags = componentRefs.filter(cr => cr.filePath === filePath).map(cr => cr.tag);
  refTags.forEach(tag => {
    if (tag !== cmpMeta.tagNameMeta && !cmpMeta.dependencies.includes(tag)) {
      cmpMeta.dependencies.push(tag);
    }
  });

  const importsInspected: string[] = [];

  const moduleGraph = moduleGraphs.find(mg => mg.filePath === filePath);
  if (moduleGraph) {
    getComponentDepsFromImports(moduleGraphs, componentRefs, importsInspected, moduleGraph, cmpMeta);
  }

  cmpMeta.dependencies.sort();
}


function getComponentDepsFromImports(moduleGraphs: ModuleGraph[], componentRefs: ComponentRef[], importsInspected: string[], moduleGraph: ModuleGraph, cmpMeta: ComponentMeta) {
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
