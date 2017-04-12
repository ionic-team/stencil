import { PlatformApi, VNode } from '../../util/interfaces';
import { updateAttrs } from './modules/attributes';
import { updateClass } from './modules/class';


export function renderVNodeToString(plt: PlatformApi, vnode: VNode) {
  plt;
  updateAttrs;
  updateClass;

  if (!vnode.sel && vnode.vtext) {
    return vnode.vtext;
  }

  const tagName = getTagName(vnode.sel);

  if (tagName === '!') {
    return `<!--${vnode.vtext}-->`;
  }

  vnode.vdata = vnode.vdata || {};

  // open element
  // open start tag
  const html = ['<', tagName];

  const attributes = {};

  Object.keys(attributes).forEach(attrName => {
    const attrVal = attributes[attrName];
    html.push(' ', attrName, '="', attrVal, '"');
  });

  // close start tag
  html.push('>');

  if (vnode.vtext) {
    html.push(vnode.vtext);

  } else if (vnode.vchildren) {
    vnode.vchildren.forEach(child => {
      html.push(renderVNodeToString(plt, <VNode>child));
    });
  }

  // close element
  html.push('</', tagName, '>');

  return html.join('');
}





function getTagName(selector: string) {
  selector = selector || '';
  const parts = selector.split('.');
  return parts[0] || 'div';
}
