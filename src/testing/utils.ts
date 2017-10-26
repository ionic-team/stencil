
export function testClasslist(el: HTMLElement, classes: string[]) {
  if (el.classList.length !== classes.length) {
    throw new Error(`expected ${classes.length} classes, found ${el.classList.length}`);
  }
  for (var c of classes) {
    if (!el.classList.contains(c)) {
      throw new Error(`expected class "${c}", but it was not found`);
    }
  }
}

export function testAttributes(el: HTMLElement, attributes: { [attr: string]: string }) {
  const keys = Object.keys(attributes);
  if (el.attributes.length !== keys.length) {
    throw `expected ${keys.length} classes, found ${el.attributes.length}`;
  }
  for (var attr of keys) {
    if (!el.hasAttribute(attr)) {
      throw `expected attribute "${attr}",  but it was not found`;
    }
    if (el.getAttribute(attr) !== attributes[attr]) {
      throw `expected attribute "${attr}" to be equal to "${attributes[attr]}, but it is "${el.getAttribute(attr)}"`;
    }
  }
}
