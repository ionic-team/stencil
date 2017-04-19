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

    instance.$destroys = [];
    instance.$onDestroy = function(cb: Function) {
      instance.$destroys.push(cb);
    };

    initProps(plt, config, renderer, elm, tag, instance, cmpMeta.props, cmpMeta.watches);
    initalLoad = true;
  }

  if (cmpMeta.shadow) {
    if (!instance.$root) {
      const cmpMode = cmpMeta.modes[instance.mode];
      const cmpModeId = `${tag}.${instance.mode}`;
      instance.$root = plt.$attachShadow(elm, cmpMode, cmpModeId);
    }

    const vnode = generateVNode(instance.$root, instance, cmpMeta.hostCss);

    // if we already have a vnode then use it
    // otherwise, elm is the initial patch and
    // we need it to pass it the actual host element
    instance.$vnode = renderer(instance.$vnode ? instance.$vnode : elm, vnode);
  }

  if (initalLoad && instance) {
    instance.ionViewDidLoad && instance.ionViewDidLoad();
  }
}
