import { ComponentMeta, IonicUtils, PlatformApi, RendererApi } from '../util/interfaces';
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

    if (node.childNodes) {
      for (var i = 0; i < node.childNodes.length; i++) {
        promises.push(inspectNode(utils, plt, renderer, node.childNodes[i]));
      }
    }
  }

  return Promise.all(promises);
}


export function upgradeNode(utils: IonicUtils, plt: PlatformApi, renderer: RendererApi, elm: Element, cmpMeta: ComponentMeta) {
  const instance = new cmpMeta.componentModule();

  const cmpMode = cmpMeta.modes[instance.mode];
  const cmpModeId = `${cmpMeta.tag}.${instance.mode}`;
  const rootElm = plt.$attachShadow(elm, cmpMode, cmpModeId);

  const vnode = generateVNode(utils, rootElm, instance, cmpMeta.hostCss);

  renderer(elm, vnode);

  return Promise.resolve();
}
