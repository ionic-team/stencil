import { ComponentMeta, HostElement, PlatformApi } from '../../util/interfaces';
import { createThemedClasses } from '../../util/theme';
import { h } from '../renderer/h';
import { VNode as VNodeObj } from '../renderer/vnode';


export function render(plt: PlatformApi, elm: HostElement, cmpMeta: ComponentMeta, isUpdateRender: boolean) {
  const instance = elm.$instance;

  // if this component has a render function, let's fire
  // it off and generate the child vnodes for this host element
  // note that we do not create the host element cuz it already exists
  const hostMeta = cmpMeta.hostMeta;

  if (instance.render || instance.hostData || hostMeta) {
    const vnodeChildren = instance.render && instance.render();
    let vnodeHostData: any = instance.hostData && instance.hostData();

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

    // if we haven't already created a vnode, then we give the renderer the actual element
    // if this is a re-render, then give the renderer the last vnode we already created
    let oldVNode = elm._vnode || new VNodeObj();
    oldVNode.elm = elm;

    // each patch always gets a new vnode
    // the host element itself isn't patched because it already exists
    // kick off the actual render and any DOM updates
    elm._vnode = plt.render(
      oldVNode,
      h(null, vnodeHostData, vnodeChildren),
      isUpdateRender,
      elm._hostContentNodes,
      cmpMeta.encapsulation
    );

    // attach the styles this component needs, if any
    // this fn figures out if the styles should go in a
    // shadow root or if they should be global
    plt.attachStyles(cmpMeta, instance.mode, elm);
  }

  // it's official, this element has rendered
  elm.$rendered = true;

  if (elm.$onRender) {
    // ok, so turns out there are some child host elements
    // waiting on this parent element to load
    // let's fire off all update callbacks waiting
    elm.$onRender.forEach(cb => {
      cb();
    });
    delete elm.$onRender;
  }
}
