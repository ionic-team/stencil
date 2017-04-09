import { ComponentMeta, PlatformApi, RendererApi } from '../util/interfaces';
import * as parse5 from 'parse5';


export function renderComponentToString(renderer: RendererApi, content: string) {
  renderer;

  return new Promise(resolve => {

    resolve(content);

  });
}


export function upgradeInputHtml(renderer: RendererApi, plt: PlatformApi, html: string) {
  const node: Node = <any>parse5.parseFragment(html);

  return inspectNode(renderer, plt, node).then(() => {
    return parse5.serialize(node);
  });
}


export function inspectNode(renderer: RendererApi, plt: PlatformApi, node: Node): Promise<any> {
  const promises: Promise<any>[] = [];

  let cmpMeta: ComponentMeta;

  if (plt.isElement(node)) {
    cmpMeta = plt.getComponentMeta(node.tagName.toLowerCase());

    if (cmpMeta) {
      promises.push(upgradeNode(renderer, plt, node, cmpMeta));
    }
  }

  if (node.childNodes) {
    for (var i = 0; i < node.childNodes.length; i++) {
      promises.push(inspectNode(renderer, plt, node.childNodes[i]));
    }
  }

  return Promise.all(promises);
}


export function upgradeNode(renderer: RendererApi, plt: PlatformApi, node: Node, cmpMeta: ComponentMeta) {
  console.log(node)
  renderer;
  plt;
  node;
  cmpMeta;
  return Promise.resolve();
}
