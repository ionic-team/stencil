
export function testClasslist(el: HTMLElement, classes: string[]) {
  expect(el.classList).toHaveLength(classes.length);
  for (var c of classes) {
    expect(el.classList.contains(c)).toBeTruthy();
  }
}

export function testAttributes(el: HTMLElement, attributes: any) {
  const keys = Object.keys(attributes);
  expect(el.attributes).toHaveLength(keys.length);
  for (var attr of keys) {
    expect(el.hasAttribute(attr)).toBeTruthy();
    expect(el.getAttribute(attr)).toEqual(attributes[attr]);
  }
}
