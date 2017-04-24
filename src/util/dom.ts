

export function pointerCoordX(ev: any): number {
  // get X coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientX;
    }
    if (ev.pageX !== undefined) {
      return ev.pageX;
    }
  }
  return 0;
}


export function pointerCoordY(ev: any): number {
  // get Y coordinates for either a mouse click
  // or a touch depending on the given event
  if (ev) {
    var changedTouches = ev.changedTouches;
    if (changedTouches && changedTouches.length > 0) {
      return changedTouches[0].clientY;
    }
    if (ev.pageY !== undefined) {
      return ev.pageY;
    }
  }
  return 0;
}


export function getElementReference(elm: any, ref: string) {
  if (ref === 'child') {
    return elm.firstElementChild;
  }
  if (ref === 'parent') {
    if (elm.parentElement ) {
      // normal element with a parent element
      return elm.parentElement;
    }
    if (elm.parentNode && elm.parentNode.host) {
      // shadow dom's document fragment
      return elm.parentNode.host;
    }
  }
  if (ref === 'body') {
    return elm.ownerDocument.body;
  }
  if (ref === 'document') {
    return elm.ownerDocument;
  }
  if (ref === 'window') {
    return elm.ownerDocument.defaultView;
  }
  return elm;
}


export function getKeyCodeByName(keyName: string) {
  if (keyName === 'enter') {
    return 13;
  }
  if (keyName === 'escape') {
    return 27;
  }
  if (keyName === 'space') {
    return 32;
  }
  if (keyName === 'tab') {
    return 9;
  }
  return null;
}


export function applyStyles(elm: HTMLElement, styles: {[styleProp: string]: string|number}) {
  const styleProps = Object.keys(styles);

  for (var i = 0; i < styleProps.length; i++) {
    (<any>elm.style)[styleProps[i]] = styles[styleProps[i]];
  }
}
