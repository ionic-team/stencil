import { attachListeners } from './events';
import { collectedHostContentNodes } from './host';
import { ConfigApi, PlatformApi, ProxyElement } from '../util/interfaces';
import { initProps } from './proxy';
import { RendererApi } from '../util/interfaces';


export function queueUpdate(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, tag: string) {
  // only run patch if it isn't queued already
  if (!elm.$queued) {
    elm.$queued = true;

    // run the patch in the next tick
    plt.nextTick(function queueUpdateNextTick() {

      // vdom diff and patch the host element for differences
      update(plt, config, renderer, elm, tag);

      // no longer queued
      elm.$queued = false;
    });
  }
}


export function update(plt: PlatformApi, config: ConfigApi, renderer: RendererApi, elm: ProxyElement, tag: string) {
  const cmpMeta = plt.getComponentMeta(tag);
  let initalLoad = false;

  let instance = elm.$instance;
  if (!instance) {
    instance = elm.$instance = new cmpMeta.componentModule();
    instance.$el = elm;
    instance.$meta = cmpMeta;

    initProps(plt, config, renderer, elm, tag, instance, cmpMeta.props, cmpMeta.watchers);

    plt.$attachComponent(elm, cmpMeta, instance);

    initalLoad = true;

    if (!cmpMeta.shadow && instance.render) {
      // this component is not using shadow dom
      // and it does have a render function
      // collect up the host content nodes so we can
      // manually move them around to the correct slot

      if (cmpMeta.tag === 'ion-item') {
        // TODO!!
        cmpMeta.namedSlots = ['start', 'end'];
      }

      elm.$hostContent = collectedHostContentNodes(elm, cmpMeta.namedSlots);
    }
  }

  const vnode = instance.render && instance.render();
  if (vnode) {
    vnode.elm = elm;
    delete vnode.sel;
    instance.$vnode = renderer(instance.$vnode ? instance.$vnode : elm, vnode, elm.$hostContent);
  }

  if (initalLoad) {
    attachListeners(cmpMeta.listeners, instance);

    instance.ionViewDidLoad && instance.ionViewDidLoad();
  }
}
