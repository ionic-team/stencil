import { ComponentMeta, PlatformApi, VNode } from '../util/interfaces';
import { generateVNode } from '../client/host';
import { renderVNodeToString } from './renderer/core';
import * as parse5 from 'parse5';


export function upgradeInputHtml(plt: PlatformApi, html: string) {
  const node: Node = <any>parse5.parseFragment(html);

  return inspectNode(plt, node).then(() => {
    return parse5.serialize(node);

  }).catch(err => {
    console.log(err);
  });
}


export function inspectNode(plt: PlatformApi, node: Node): Promise<any> {
  const promises: Promise<any>[] = [];

  if (plt.isElement(node)) {
    const cmpMeta = plt.getComponentMeta(node.tagName.toLowerCase());

    if (cmpMeta) {
      promises.push(upgradeNode(plt, node, cmpMeta));
    }
  }

  if (node.childNodes) {
    for (var i = 0; i < node.childNodes.length; i++) {
      promises.push(inspectNode(plt, node.childNodes[i]));
    }
  }

  return Promise.all(promises);
}


export function upgradeNode(plt: PlatformApi, elm: Element, cmpMeta: ComponentMeta) {
  const instance = new cmpMeta.componentModule();

  console.log('upgradeNode', elm.tagName);

  // const cmpMode = cmpMeta.modes[instance.mode];
  // const cmpModeId = `${cmpMeta.tag}.${instance.mode}`;
  plt;

  let vnode = generateVNode(elm, instance);

  const html = renderVNodeToString(plt, vnode);

  console.log(html);

  return Promise.resolve();
}


function renderToString(vnode: VNode) {
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

  const attributes: any = {};

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
      html.push(renderToString(<VNode>child));
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
