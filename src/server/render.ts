import { ComponentMeta, IonicUtils, PlatformApi, RendererApi, VNode } from '../util/interfaces';
import { generateVNode } from '../element/host';
import * as parse5 from 'parse5';


export function upgradeInputHtml(utils: IonicUtils, plt: PlatformApi, renderer: RendererApi, html: string) {
  const node: Node = <any>parse5.parseFragment(html);

  return inspectNode(utils, plt, renderer, node).then(() => {
    return parse5.serialize(node);
  });
}


export function inspectNode(utils: IonicUtils, plt: PlatformApi, renderer: RendererApi, node: Node): Promise<any> {
  const promises: Promise<any>[] = [];

  if (plt.isElement(node)) {
    const cmpMeta = plt.getComponentMeta(node.tagName.toLowerCase());

    if (cmpMeta) {
      promises.push(upgradeNode(utils, plt, renderer, node, cmpMeta));
    }
  }

  if (node.childNodes) {
    for (var i = 0; i < node.childNodes.length; i++) {
      promises.push(inspectNode(utils, plt, renderer, node.childNodes[i]));
    }
  }

  return Promise.all(promises);
}


export function upgradeNode(utils: IonicUtils, plt: PlatformApi, renderer: RendererApi, elm: Element, cmpMeta: ComponentMeta) {
  console.log(`upgradeNode ${elm.tagName}`)
  const instance = new cmpMeta.componentModule();

  // const cmpMode = cmpMeta.modes[instance.mode];
  // const cmpModeId = `${cmpMeta.tag}.${instance.mode}`;
  plt;

  let vnode = generateVNode(utils, elm, instance, cmpMeta.hostCss);

  vnode = renderer(elm, vnode);

  const html = renderToString(vnode);

  console.log(html)

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
  const html = ['<' + tagName];

  const attributes = {};

  Object.keys(attributes).forEach(attrName => {
    const attrVal = attributes[attrName];
    html.push(` ${attrName}="${attrVal}"`);
  });

  // close start tag
  html.push('>');

  // Ccose tag
  if (vnode.vtext) {
    html.push(vnode.vtext);

  } else if (vnode.vchildren) {
    vnode.vchildren.forEach(child => {
      html.push(renderToString(<VNode>child));
    });
  }

  // close element
  html.push(`</${tagName}>`);

  return html.join('');
}


function getTagName(selector: string) {
  selector = selector || '';
  const parts = selector.split('.');
  return parts[0] || 'div';
}
