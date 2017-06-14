import { createThemedClasses } from '../../util/theme';
import { HostElement, PlatformApi, VNode } from '../../util/interfaces';
import { isArray } from '../../util/helpers';
import { VNode as VNodeObj } from '../renderer/vnode';


export function render(plt: PlatformApi, elm: HostElement, isInitialRender: boolean) {
  const instance = elm.$instance;
  const cmpMeta = plt.getComponentMeta(elm);

  if (!isInitialRender) {
    // fire off the user's ionViewWillUpdate method (if one was provided)
    // ionViewWillUpdate runs BEFORE render() has been called
    // but only BEFORE an UPDATE and not before the intial render
    instance.ionViewWillUpdate && instance.ionViewWillUpdate();
  }

  // if this component has a render function, let's fire
  // it off and generate the children for this vnode
  const vnodeChildren = instance.render && instance.render();

  let vnodeHostData = instance.hostData && instance.hostData();
  if (cmpMeta.hostMeta) {
    vnodeHostData = Object.keys(cmpMeta.hostMeta).reduce((hostData, key) => {
      switch (key) {
      case 'theme':
        hostData['class'] = hostData['class'] || {};
        hostData['class'] = Object.assign(
          hostData['class'],
          createThemedClasses(instance.mode, instance.color, cmpMeta.hostMeta['theme']),
        );
      }
      return hostData;
    }, vnodeHostData || {});
  }

  if (vnodeChildren || vnodeHostData) {
    let oldVNode: VNode;
    let newVNode: VNode;
    let hydrating = false;

    // if this is the intial load, then we give the renderer the actual element
    // if this is a re-render, then give the renderer the last vnode we created
    if (isInitialRender) {
      oldVNode = new VNodeObj();
      oldVNode.elm = elm;
    } else {
      oldVNode = elm._vnode;
    }

    newVNode = new VNodeObj();

    if (vnodeHostData) {
      newVNode.vattrs = vnodeHostData['attrs'];
      newVNode.vclass = vnodeHostData['class'];
    }

    if (vnodeChildren) {
      // the host element's children should always be an array
      newVNode.vchildren = isArray(vnodeChildren) ? vnodeChildren : [vnodeChildren];
    }

    // // kick off the actual render and any DOM updates
    elm._vnode = plt.render(oldVNode, newVNode, !isInitialRender, elm._hostContentNodes, hydrating);
  }

  if (!isInitialRender) {
    // fire off the user's ionViewDidUpdate method (if one was provided)
    // ionViewDidUpdate runs AFTER render() has been called
    // but only AFTER an UPDATE and not after the intial render
    instance.ionViewDidUpdate && instance.ionViewDidUpdate();
  }
}
