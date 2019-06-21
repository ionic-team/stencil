

export class UsedSelectors {
  tags = new Set<string>();
  classNames = new Set<string>();
  ids = new Set<string>();
  attrs = new Set<string>();

  constructor(elm: Element) {
    this.collectSelectors(elm);
  }

  private collectSelectors(elm: Element) {
    if (elm != null && elm.tagName) {

      // tags
      const tagName = elm.tagName.toLowerCase();
      this.tags.add(tagName);

      // attributes
      const attributes = elm.attributes;
      for (let i = 0, l = attributes.length; i < l; i++) {
        const attr = attributes.item(i);

        const attrName = attr.name.toLowerCase();

        if (attrName === 'class') {
          // classes
          const classList = elm.classList;
          for (let i = 0, l = classList.length; i < l; i++) {
            this.classNames.add(classList.item(i));
          }

        } else if (attrName === 'style') {
          continue;

        } else if (attrName === 'id') {
          // ids
          this.ids.add(attr.value);

        } else {
          this.attrs.add(attrName);
        }
      }

      // drill down
      for (let i = 0, l = elm.children.length; i < l; i++) {
        this.collectSelectors(elm.children[i]);
      }
    }
  }
}
