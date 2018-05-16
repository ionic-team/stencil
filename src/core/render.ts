import * as d from '../declarations';
import { Build } from '../util/build-conditionals';
import { h } from '../renderer/vdom/h';
import { RUNTIME_ERROR } from '../util/constants';


export function render(plt: d.PlatformApi, cmpMeta: d.ComponentMeta, elm: d.HostElement, instance: d.ComponentInstance, isUpdateRender: boolean) {
  try {
    // if this component has a render function, let's fire
    // it off and generate the child vnodes for this host element
    // note that we do not create the host element cuz it already exists
    const hostMeta = cmpMeta.componentConstructor.host;

    let reflectHostAttr: d.VNodeData;

    if (Build.reflectToAttr) {
      reflectHostAttr = reflectInstanceValuesToHostAttributes(cmpMeta.componentConstructor.properties, instance);
    }

    if (instance.render || instance.hostData || hostMeta || reflectHostAttr) {
      // tell the platform we're actively rendering
      // if a value is changed within a render() then
      // this tells the platform not to queue the change
      plt.activeRender = true;

      const vnodeChildren = instance.render && instance.render();

      let vnodeHostData: d.VNodeData;
      if (Build.hostData) {
        // user component provided a "hostData()" method
        // the returned data/attributes are used on the host element
        vnodeHostData = instance.hostData && instance.hostData();
      }

      if (Build.reflectToAttr && reflectHostAttr) {
        vnodeHostData = vnodeHostData ? Object.assign(vnodeHostData, reflectHostAttr) : reflectHostAttr;
      }

      // tell the platform we're done rendering
      // now any changes will again queue
      plt.activeRender = false;

      if (Build.hostTheme && hostMeta) {
        // component meta data has a "theme"
        // use this to automatically generate a good css class
        // from the mode and color to add to the host element
        vnodeHostData = applyComponentHostData(vnodeHostData, hostMeta, instance);
      }
      // looks like we've got child nodes to render into this host element
      // or we need to update the css class/attrs on the host element

      // if we haven't already created a vnode, then we give the renderer the actual element
      // if this is a re-render, then give the renderer the last vnode we already created
      const oldVNode = plt.vnodeMap.get(elm) || ({} as d.VNode);
      oldVNode.elm = elm;

      const hostVNode = h(null, vnodeHostData, vnodeChildren);

      if (Build.reflectToAttr) {
        // only care if we're reflecting values to the host element
        hostVNode.ishost = true;
      }

      // each patch always gets a new vnode
      // the host element itself isn't patched because it already exists
      // kick off the actual render and any DOM updates
      plt.vnodeMap.set(elm, plt.render(
        oldVNode,
        hostVNode,
        isUpdateRender,
        cmpMeta.componentConstructor.encapsulation
      ));
    }

    if (Build.styles) {
      // attach the styles this component needs, if any
      // this fn figures out if the styles should go in a
      // shadow root or if they should be global
      plt.attachStyles(plt, plt.domApi, cmpMeta, instance.mode, elm);
    }

    // it's official, this element has rendered
    elm['s-rn'] = true;

    if ((elm as any)['$onRender']) {
      // $onRender deprecated 2018-04-02
      elm['s-rc'] = (elm as any)['$onRender'];
    }

    if (elm['s-rc']) {
      // ok, so turns out there are some child host elements
      // waiting on this parent element to load
      // let's fire off all update callbacks waiting
      elm['s-rc'].forEach(cb => cb());
      elm['s-rc'] = null;
    }

  } catch (e) {
    plt.activeRender = false;
    plt.onError(e, RUNTIME_ERROR.RenderError, elm, true);
  }
}


export function applyComponentHostData(vnodeHostData: d.VNodeData, hostMeta: d.ComponentConstructorHost, instance: any) {
  vnodeHostData = vnodeHostData || {};

  // component meta data has a "theme"
  // use this to automatically generate a good css class
  // from the mode and color to add to the host element
  Object.keys(hostMeta).forEach(key => {

    if (key === 'theme') {
      // host: { theme: 'button' }
      // adds css classes w/ mode and color combinations
      // class="button button-md button-primary button-md-primary"
      convertCssNamesToObj(
        vnodeHostData['class'] = vnodeHostData['class'] || {},
        hostMeta[key],
        instance.mode,
        instance.color
      );

    } else if (key === 'class') {
      // host: { class: 'multiple css-classes' }
      // class="multiple css-classes"
      convertCssNamesToObj(
        vnodeHostData[key] = vnodeHostData[key] || {},
        hostMeta[key]
      );

    } else {
      // rando attribute/properties
      vnodeHostData[key] = hostMeta[key];
    }
  });

  return vnodeHostData;
}


export function convertCssNamesToObj(cssClassObj: { [className: string]: boolean}, className: string, mode?: string, color?: string) {
  className.split(' ').forEach(cssClass => {
    cssClassObj[cssClass] = true;

    if (mode) {
      cssClassObj[`${cssClass}-${mode}`] = true;

      if (color) {
        cssClassObj[`${cssClass}-${mode}-${color}`] = cssClassObj[`${cssClass}-${color}`] = true;
      }
    }
  });
}


export function reflectInstanceValuesToHostAttributes(properties: d.ComponentConstructorProperties, instance: d.ComponentInstance, reflectHostAttr?: d.VNodeData) {
  if (properties) {

    Object.keys(properties).forEach(memberName => {
      if (properties[memberName].reflectToAttr) {
        reflectHostAttr = reflectHostAttr || {};
        reflectHostAttr[memberName] = instance[memberName];
      }
    });

  }

  return reflectHostAttr;
}
