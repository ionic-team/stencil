import { ComponentRef, ModuleFiles, PotentialComponentRef } from '../../declarations';


export function getComponentRefsFromSourceStrings(allModuleFiles: ModuleFiles, sourceStrings: PotentialComponentRef[]) {
  const componentRefs: ComponentRef[] = [];

  const tags = Object.keys(allModuleFiles)
    .map(filePath => allModuleFiles[filePath].cmpMeta)
    .filter(cmpMeta => cmpMeta && cmpMeta.tagNameMeta)
    .map(cmpMeta => cmpMeta.tagNameMeta);

  sourceStrings.forEach(src => {
    if (typeof src.tag === 'string') {
      src.tag = src.tag.toLowerCase();

      if (tags.some(tag => src.tag === tag)) {
        // exact match, we're good
        // probably something like h('ion-button') or
        // document.createElement('ion-toggle');
        componentRefs.push({
          tag: src.tag,
          filePath: src.filePath
        });
      }

    } else if (typeof src.html === 'string') {
      // string could be HTML
      // could be something like elm.innerHTML = '<ion-button>';

      // replace any whitespace with a ~ character
      // this is especially important for newlines and tabs
      // for tag with attributes and has a newline in the tag
      src.html = src.html.toLowerCase().replace(/\s/g, '~');

      const foundTags = tags.filter(tag => {
        return src.html.includes('<' + tag + '>') ||
               src.html.includes('</' + tag + '>') ||
               src.html.includes('<' + tag + '~');
      });

      foundTags.forEach(foundTag => {
        componentRefs.push({
          tag: foundTag,
          filePath: src.filePath
        });
      });
    }
  });

  sourceStrings.length = 0;

  return componentRefs;
}
