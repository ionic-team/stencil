import * as d from '@declarations';
import { getComponentRefsFromSourceStrings } from './component-references';


export function calcComponentDependencies(moduleFiles: d.Module[]) {
  // figure out all the component references seen in each file
  // these are all the the components found in the app, and which file it was found in
  const componentRefs = getComponentRefsFromSourceStrings(moduleFiles);

  // go through all the module files in the app
  moduleFiles.forEach(moduleFile => {
    moduleFile.cmps.forEach(cmp => {
      // if this module file has component metadata
      // then let's figure out which dependencies it has
      getComponentDependencies(moduleFiles, componentRefs, moduleFile, cmp);
    });
  });
}


function getComponentDependencies(moduleFiles: d.Module[], componentRefs: d.ComponentRef[], moduleFile: d.Module, cmp: d.ComponentCompilerMeta) {
  // build a list of all the component dependencies this has, using their tag as the key
  cmp.dependencies = cmp.dependencies || [];

  // figure out if this file has any components in it
  // get all the component references for this file path
  const componentRefsOfFile = componentRefs.filter(cr => cr.filePath === moduleFile.sourceFilePath);

  // get the tags for the component references with this file path
  const refTags = componentRefsOfFile.map(cr => cr.tag);

  // for each component ref of this file
  // go ahead and add the tag to the cmp metadata dependencies
  refTags.forEach(tag => {
    if (tag !== cmp.tagName && !cmp.dependencies.includes(tag)) {
      cmp.dependencies.push(tag);
    }
  });

  const importsInspected: string[] = [];

  getComponentDepsFromImports(moduleFiles, componentRefs, importsInspected, moduleFile, cmp);

  cmp.dependencies.sort();
}


function getComponentDepsFromImports(moduleFiles: d.Module[], componentRefs: d.ComponentRef[], importsInspected: string[], inspectModuleFile: d.Module, cmpMeta: d.ComponentCompilerMeta) {
  inspectModuleFile.localImports.forEach(localImport => {
    if (importsInspected.includes(localImport)) {
      return;
    }

    importsInspected.push(localImport);

    const subModuleFile = moduleFiles.find(moduleFile => {
      return (moduleFile.sourceFilePath === localImport) ||
             (moduleFile.sourceFilePath === localImport + '.ts') ||
             (moduleFile.sourceFilePath === localImport + '.tsx') ||
             (moduleFile.sourceFilePath === localImport + '.js') ||
             (moduleFile.sourceFilePath === localImport + '.mjs');
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
