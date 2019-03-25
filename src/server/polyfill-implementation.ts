

export function polyfillDocumentImplementation(win: any, doc: any) {
  const HTMLElement = doc.documentElement.constructor.prototype;
  if (typeof HTMLElement.getRootNode !== 'function') {
    const elm = doc.createElement('unknown-element');
    const HTMLUnknownElement = elm.constructor.prototype;
    HTMLUnknownElement.getRootNode = getRootNode;
  }

  const CustomEvent = doc.createEvent('CustomEvent').constructor;
  if (win.CustomEvent !== CustomEvent) {
      win.CustomEvent = CustomEvent;
  }
}


function getRootNode(opts?: { composed?: boolean; [key: string]: any; }) {
  const isComposed = (opts != null && opts.composed === true);

  let node: Node = this as any;

  while (node.parentNode != null) {
    node = node.parentNode;

    if (isComposed === true && node.parentNode == null && (node as any).host != null) {
      node = (node as any).host;
    }
  }

  return node;
}
