

export class UsedSelectors {
  tags: string[] = [];
  classNames: string[] = [];
  ids: string[] = [];
  attrs: string[] = [];

  constructor(elm: Element) {
    this.collectSelectors(elm);
  }

  private collectSelectors(elm: Element) {
    var i: number;

    if (elm && elm.tagName) {

      // tags
      const tagName = elm.tagName.toLowerCase();
      if (this.tags.indexOf(tagName) === -1) {
        this.tags.push(tagName);
      }

      // classes
      const classList = elm.classList;
      for (i = 0; i < classList.length; i++) {
        const className = classList[i];

        if (this.classNames.indexOf(className) === -1) {
          this.classNames.push(className);
        }

      }

      // attributes
      const attributes = elm.attributes;
      for (i = 0; i < attributes.length; i++) {
        const attr = attributes[i];

        const attrName = attr.name.toLowerCase();
        if (!attrName || attrName === 'class' || attrName === 'id' || attrName === 'style') continue;

        if (this.attrs.indexOf(attrName) === -1) {
          this.attrs.push(attrName);
        }
      }

      // ids
      var idValue = elm.getAttribute('id');
      if (idValue) {
        idValue = idValue.trim();
        if (idValue && this.ids.indexOf(idValue) === -1) {
          this.ids.push(idValue);
        }
      }

      // drill down
      for (i = 0; i < elm.children.length; i++) {
        this.collectSelectors(elm.children[i]);
      }
    }
  }
}
