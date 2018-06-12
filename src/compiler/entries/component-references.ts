import * as d from '../../declarations';


export function getComponentRefsFromSourceStrings(moduleFiles: d.ModuleFile[]) {
  const componentRefs: d.ComponentRef[] = [];

  const tags = moduleFiles
    .filter(moduleFile => !!moduleFile.cmpMeta)
    .map(moduleFile => moduleFile.cmpMeta.tagNameMeta);

  moduleFiles.forEach(moduleFile => {
    moduleFile.potentialCmpRefs.forEach(potentialCmpRef => {
      parsePotentialComponentRef(componentRefs, tags, moduleFile, potentialCmpRef);
    });
  });

  return componentRefs;
}


function parsePotentialComponentRef(componentRefs: d.ComponentRef[], tags: string[], moduleFile: d.ModuleFile, potentialCmpRef: d.PotentialComponentRef) {
  if (typeof potentialCmpRef.tag === 'string') {
    potentialCmpRef.tag = potentialCmpRef.tag.toLowerCase();

    if (tags.some(tag => potentialCmpRef.tag === tag)) {
      // exact match, we're good
      // probably something like h('ion-button') or
      // document.createElement('ion-toggle');
      componentRefs.push({
        tag: potentialCmpRef.tag,
        filePath: moduleFile.sourceFilePath
      });
    }

  } else if (typeof potentialCmpRef.html === 'string') {
    // string could be HTML
    // could be something like elm.innerHTML = '<ion-button>';

    // replace any whitespace with a ~ character
    // this is especially important for newlines and tabs
    // for tag with attributes and has a newline in the tag
    potentialCmpRef.html = potentialCmpRef.html.toLowerCase().replace(/\s/g, '~');

    const foundTags = tags.filter(tag => {
      return potentialCmpRef.html.includes('<' + tag + '>') ||
             potentialCmpRef.html.includes('</' + tag + '>') ||
             potentialCmpRef.html.includes('<' + tag + '~');
    });

    foundTags.forEach(foundTag => {
      componentRefs.push({
        tag: foundTag,
        filePath: moduleFile.sourceFilePath
      });
    });
  }
}
