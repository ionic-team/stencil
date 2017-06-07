import { createThemedClasses } from '../../util/theme';
import { HostElement, PlatformApi } from '../../util/interfaces';
import { h } from '../renderer/h';


export function render(plt: PlatformApi, elm: HostElement) {
  const instance = elm.$instance;
  const cmpMeta = elm.$meta;

  // if this component has a render function, let's fire
  // it off and generate the children for this vnode
  const vnodeChildren = instance.render && instance.render();

  let vnodeAttributes = instance.hostData && instance.hostData();
  if (cmpMeta.hostMeta) {
    vnodeAttributes = Object.keys(cmpMeta.hostMeta).reduce((hostData, key) => {
      switch (key) {
      case 'theme':
        hostData['class'] = hostData['class'] || {};
        hostData['class'] = Object.assign(
          hostData['class'],
          createThemedClasses(instance.mode, instance.color, cmpMeta.hostMeta['theme']),
        );
      }
      return hostData;
    }, vnodeAttributes || {});
  }

  if (vnodeChildren || vnodeAttributes) {
    let hydrating = false;

    // if this is the intial load, then we give the renderer the actual element
    // if this is a re-render, then give the renderer the last vnode we created
    const newVNode = h(elm, vnodeAttributes, vnodeChildren);

    elm._vnode = plt.render(elm._vnode ? elm._vnode : elm, newVNode, elm._hostContentNodes, hydrating);
  }
}
