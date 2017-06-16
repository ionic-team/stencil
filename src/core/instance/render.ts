import { createThemedClasses } from '../../util/theme';
import { HostElement, PlatformApi } from '../../util/interfaces';
import { isArray } from '../../util/helpers';
import { h } from '../renderer/h';
import { VNode as VNodeObj } from '../renderer/vnode';


export function render(plt: PlatformApi, elm: HostElement, isUpdateRender: boolean) {
  const instance = elm.$instance;
  const cmpMeta = plt.getComponentMeta(elm);

  if (isUpdateRender) {
    // fire off the user's ionViewWillUpdate method (if one was provided)
    // ionViewWillUpdate runs BEFORE render() has been called
    // but only BEFORE an UPDATE and not before the intial render
    instance.ionViewWillUpdate && instance.ionViewWillUpdate();
  }

  // if this component has a render function, let's fire
  // it off and generate the child vnodes for this host element
  // note that we do not create the host element cuz it already exists
  const vnodeChildren = instance.render && instance.render();
  let vnodeHostData: any = instance.hostData && instance.hostData();
  const hostMeta = cmpMeta.hostMeta;

  if (vnodeChildren || vnodeHostData || hostMeta) {
    if (hostMeta) {
      vnodeHostData = Object.keys(hostMeta).reduce((hostData, key) => {
        switch (key) {
        case 'theme':
          hostData['class'] = hostData['class'] || {};
          hostData['class'] = Object.assign(
            hostData['class'],
            createThemedClasses(instance.mode, instance.color, hostMeta['theme']),
          );
        }
        return hostData;
      }, vnodeHostData || {});
    }
    // looks like we've got child nodes to render into this host element
    // or we need to update the css class/attrs on the host element

    // if this is the intial load, then we give the renderer the actual element
    // if this is a re-render, then give the renderer the last vnode we created
    let oldVNode = elm._vnode || new VNodeObj();
    oldVNode.elm = elm;

    // normalize host data keys to abbr. key
    vnodeHostData.a = vnodeHostData['attrs'];
    vnodeHostData.c = vnodeHostData['class'];
    vnodeHostData.s = vnodeHostData['style'];

    // each patch always gets a new vnode
    // the host element itself isn't patched because it already exists
    // kick off the actual render and any DOM updates
    elm._vnode = plt.render(oldVNode, h(null, vnodeHostData, vnodeChildren), isUpdateRender, elm._hostContentNodes);
  }

  if (isUpdateRender) {
    // fire off the user's ionViewDidUpdate method (if one was provided)
    // ionViewDidUpdate runs AFTER render() has been called
    // but only AFTER an UPDATE and not after the intial render
    instance.ionViewDidUpdate && instance.ionViewDidUpdate();
  }
}
