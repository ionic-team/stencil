import { ComponentReference, ModuleFiles, SourceString } from '../../declarations';


export function getComponentRefsFromSourceStrings(allModuleFiles: ModuleFiles, sourceStrings: SourceString[]) {
  const componentRefs: ComponentReference[] = [];

  const tags = Object.keys(allModuleFiles)
    .map(filePath => allModuleFiles[filePath].cmpMeta)
    .filter(cmpMeta => cmpMeta && cmpMeta.tagNameMeta)
    .map(cmpMeta => cmpMeta.tagNameMeta);

  sourceStrings.forEach(src => {
    if (typeof src.str !== 'string') {
      return;
    }

    src.str = src.str.trim().toLowerCase();

    if (tags.some(tag => src.str === tag)) {
      // exact match, we're good
      // probably something like h('ion-button') or
      // var tag = 'ion-button'; document.createElement(tag);
      componentRefs.push({
        tag: src.str,
        filePath: src.filePath
      });

    } else if (src.str.includes('<')) {
      // string could be HTML
      // could be something like elm.innerHTML = '<ion-button>';

      // replace any whitespace with a ~ character
      // this is especially important for newlines and tabs
      // for tag with attributes and has a newline in the tag
      src.str = src.str.toLowerCase().replace(/\s/g, '~');

      const foundTags = tags.filter(tag => {
        return src.str.includes('<' + tag + '>') ||
               src.str.includes('</' + tag + '>') ||
               src.str.includes('<' + tag + '~');
      });

      foundTags.forEach(foundTag => {
        componentRefs.push({
          tag: foundTag,
          filePath: src.filePath
        });
      });
    }

    // just to free up memory
    src.str = src.filePath = null;
  });

  sourceStrings.length = 0;

  return componentRefs;
}
