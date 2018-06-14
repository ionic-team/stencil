import * as d from '../../declarations';
import { getComponentRefsFromSourceStrings } from './component-references';


export function calcComponentDependencies(moduleFiles: d.ModuleFile[]) {
  // figure out all the component references seen in each file
  // these are all the the components found in the app, and which file it was found in
  const componentRefs = getComponentRefsFromSourceStrings(moduleFiles);

  // go through all the module files in the app
  moduleFiles.forEach(moduleFile => {
    if (moduleFile.cmpMeta) {
      // if this module file has component metadata
      // then let's figure out which dependencies it has
      getComponentDependencies(moduleFiles, componentRefs, moduleFile);
    }
  });
}


function getComponentDependencies(moduleFiles: d.ModuleFile[], componentRefs: d.ComponentRef[], moduleFile: d.ModuleFile) {
  // build a list of all the component dependencies this has, using their tag as the key
  moduleFile.cmpMeta.dependencies = moduleFile.cmpMeta.dependencies || [];

  // figure out if this file has any components in it
  // get all the component references for this file path
  const componentRefsOfFile = componentRefs.filter(cr => cr.filePath === moduleFile.sourceFilePath);

  // get the tags for the component references with this file path
  const refTags = componentRefsOfFile.map(cr => cr.tag);

  // for each component ref of this file
  // go ahead and add the tag to the cmp metadata dependencies
  refTags.forEach(tag => {
    if (tag !== moduleFile.cmpMeta.tagNameMeta && !moduleFile.cmpMeta.dependencies.includes(tag)) {
      moduleFile.cmpMeta.dependencies.push(tag);
    }
  });

  const importsInspected: string[] = [];

  getComponentDepsFromImports(moduleFiles, componentRefs, importsInspected, moduleFile, moduleFile.cmpMeta);

  moduleFile.cmpMeta.dependencies.sort();
}


function getComponentDepsFromImports(moduleFiles: d.ModuleFile[], componentRefs: d.ComponentRef[], importsInspected: string[], inspectModuleFile: d.ModuleFile, cmpMeta: d.ComponentMeta) {
  inspectModuleFile.localImports.forEach(localImport => {
    if (importsInspected.includes(localImport)) {
      return;
    }

    importsInspected.push(localImport);

    const subModuleFile = moduleFiles.find(moduleFile => {
      return (moduleFile.sourceFilePath === localImport) ||
             (moduleFile.sourceFilePath === localImport + '.ts') ||
             (moduleFile.sourceFilePath === localImport + '.tsx') ||
             (moduleFile.sourceFilePath === localImport + '.js');
    });

    if (subModuleFile) {
      const tags = componentRefs.filter(cr => cr.filePath === subModuleFile.sourceFilePath).map(cr => cr.tag);

      tags.forEach(tag => {
        if (!cmpMeta.dependencies.includes(tag)) {
          cmpMeta.dependencies.push(tag);
        }
      });

      getComponentDepsFromImports(moduleFiles, componentRefs, importsInspected, subModuleFile, cmpMeta);
    }
  });
}
