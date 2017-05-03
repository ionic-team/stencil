import { attachListeners } from './events';
import { ConfigApi, PlatformApi, ProxyElement } from '../util/interfaces';
import { generateVNode } from './host';
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
  }

  if (cmpMeta.shadow) {
    // should use shadom dom with default slot and/or named slots

    // if we already have a vnode then use it
    // otherwise, elm is the initial patch and
    // we need it to pass it the actual host element
    instance.$vnode = renderer(instance.$vnode ? instance.$vnode : elm, generateVNode(instance.$root, instance));

  } else if (initalLoad && instance.render) {
    // should not use shadow dom, but it still has a render function
    // in this case it'll manually relocate the content into the render's slot
    // this does not work for named slots, only the default slot
    // but it doesn't use native shadow dom for that, everything stays light dom
    // additionally, this should only happen on the initial load
    const vnode = instance.render();
    vnode.elm = elm;
    renderer(elm, vnode, true);
  }

  if (initalLoad) {
    attachListeners(cmpMeta.listeners, instance);

    instance.ionViewDidLoad && instance.ionViewDidLoad();
  }
}
