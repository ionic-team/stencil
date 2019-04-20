import * as d from '../../declarations';

export function getUsedComponents(doc: Document, cmps: d.ComponentCompilerMeta[]) {
  const tags = new Set(cmps.map(cmp => cmp.tagName.toUpperCase()));
  const found: string[] = [];

  function searchComponents(el: Element) {
    if (tags.has(el.tagName)) {
      found.push(el.tagName.toLowerCase());
    }

    for (let i = 0; i < el.childElementCount; i++) {
      searchComponents(el.children[i]);
    }
  }
  searchComponents(doc.documentElement);

  return found;
}
