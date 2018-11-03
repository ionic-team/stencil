import * as d from '../declarations';
import { dashToPascalCase } from '../util/helpers';
import { getElementScopeId } from '../util/scope';
import { h } from '../renderer/vdom/h';
import { RUNTIME_ERROR } from '../util/constants';


export const render = (plt: d.PlatformApi, cmpMeta: d.ComponentMeta, hostElm: d.HostElement, instance: d.ComponentInstance, perf: Performance) => {
  try {
    if (_BUILD_.profile) {
      perf.mark(`render_start:${hostElm.nodeName.toLowerCase()}`);
    }

    // if this component has a render function, let's fire
    // it off and generate the child vnodes for this host element
    // note that we do not create the host element cuz it already exists
    const hostMeta = cmpMeta.componentConstructor.host;

    const encapsulation = cmpMeta.componentConstructor.encapsulation;

    // test if this component should be shadow dom
    // and if so does the browser supports it
    const useNativeShadowDom = (encapsulation === 'shadow' && plt.domApi.$supportsShadowDom);

    let reflectHostAttr: d.VNodeData;
    let rootElm: HTMLElement = hostElm;

    if (_BUILD_.reflectToAttr) {
      reflectHostAttr = reflectInstanceValuesToHostAttributes(cmpMeta.componentConstructor.properties, instance);
    }

    // this component SHOULD use native slot/shadow dom
    // this browser DOES support native shadow dom
    // and this is the first render
    // let's create that shadow root
    // test if this component should be shadow dom
    // and if so does the browser supports it
    if (_BUILD_.shadowDom && useNativeShadowDom) {
      rootElm = hostElm.shadowRoot as any;
    }

    if (_BUILD_.styles && !hostElm['s-rn']) {
      // attach the styles this component needs, if any
      // this fn figures out if the styles should go in a
      // shadow root or if they should be global
      plt.attachStyles(plt, plt.domApi, cmpMeta, hostElm);

      const scopeId = hostElm['s-sc'];
      if (scopeId) {
        plt.domApi.$addClass(hostElm, getElementScopeId(scopeId, true));
        if (encapsulation === 'scoped') {
          plt.domApi.$addClass(hostElm, getElementScopeId(scopeId));
        }
      }
    }

    if (instance.render || instance.hostData || hostMeta || reflectHostAttr) {
      // tell the platform we're actively rendering
      // if a value is changed within a render() then
      // this tells the platform not to queue the change
      plt.activeRender = true;

      const vnodeChildren = instance.render && instance.render();

      let vnodeHostData: d.VNodeData;
      if (_BUILD_.hostData) {
        // user component provided a "hostData()" method
        // the returned data/attributes are used on the host element
        vnodeHostData = instance.hostData && instance.hostData();

        if (_BUILD_.isDev) {
          if (vnodeHostData && cmpMeta.membersMeta) {
            const foundHostKeys = Object.keys(vnodeHostData).reduce((err, k) => {
              if (cmpMeta.membersMeta[k]) {
                return err.concat(k);
              }
              if (cmpMeta.membersMeta[dashToPascalCase(k)]) {
                return err.concat(dashToPascalCase(k));
              }
              return err;
            }, <string[]>[]);

            if (foundHostKeys.length > 0) {
              throw new Error(
              `The following keys were attempted to be set with hostData() from the ` +
              `${cmpMeta.tagNameMeta} component: ${foundHostKeys.join(', ')}. ` +
              `If you would like to modify these please set @Prop({ mutable: true, reflectToAttr: true}) ` +
              `on the @Prop() decorator.`
              );
            }
          }
        }
      }

      if (_BUILD_.reflectToAttr && reflectHostAttr) {
        vnodeHostData = vnodeHostData ? Object.assign(vnodeHostData, reflectHostAttr) : reflectHostAttr;
      }

      // tell the platform we're done rendering
      // now any changes will again queue
      plt.activeRender = false;

      if (_BUILD_.hostTheme && hostMeta) {
        // component meta data has a "theme"
        // use this to automatically generate a good css class
        // from the mode and color to add to the host element
        vnodeHostData = applyComponentHostData(vnodeHostData, hostMeta, instance);
      }
      // looks like we've got child nodes to render into this host element
      // or we need to update the css class/attrs on the host element

      // if we haven't already created a vnode, then we give the renderer the actual element
      // if this is a re-render, then give the renderer the last vnode we already created
      const oldVNode = plt.vnodeMap.get(hostElm) || ({} as d.VNode);
      oldVNode.elm = rootElm;

      const hostVNode = h(null, vnodeHostData, vnodeChildren);

      if (_BUILD_.reflectToAttr) {
        // only care if we're reflecting values to the host element
        hostVNode.ishost = true;
      }

      // each patch always gets a new vnode
      // the host element itself isn't patched because it already exists
      // kick off the actual render and any DOM updates
      plt.vnodeMap.set(hostElm, plt.render(
        hostElm,
        oldVNode,
        hostVNode,
        useNativeShadowDom,
        encapsulation
      ));
    }

    // update styles!
    if (_BUILD_.cssVarShim && plt.customStyle) {
      plt.customStyle.updateHost(hostElm);
    }

    // it's official, this element has rendered
    hostElm['s-rn'] = true;

    if (hostElm['s-rc']) {
      // ok, so turns out there are some child host elements
      // waiting on this parent element to load
      // let's fire off all update callbacks waiting
      hostElm['s-rc'].forEach(cb => cb());
      hostElm['s-rc'] = null;
    }

    if (_BUILD_.profile) {
      perf.mark(`render_end:${hostElm.nodeName.toLowerCase()}`);
      perf.measure(`render:${hostElm.nodeName.toLowerCase()}`, `render_start:${hostElm.nodeName.toLowerCase()}`, `render_end:${hostElm.nodeName.toLowerCase()}`);
    }

  } catch (e) {
    plt.activeRender = false;
    plt.onError(e, RUNTIME_ERROR.RenderError, hostElm, true);
  }
};


export const applyComponentHostData = (vnodeHostData: d.VNodeData, hostMeta: d.ComponentConstructorHost, instance: any) => {
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
};


export const convertCssNamesToObj = (cssClassObj: { [className: string]: boolean}, className: string, mode?: string, color?: string) => {
  className.split(' ').forEach(cssClass => {
    cssClassObj[cssClass] = true;

    if (mode) {
      cssClassObj[`${cssClass}-${mode}`] = true;

      if (color) {
        cssClassObj[`${cssClass}-${mode}-${color}`] = cssClassObj[`${cssClass}-${color}`] = true;
      }
    }
  });
};


export const reflectInstanceValuesToHostAttributes = (properties: d.ComponentConstructorProperties, instance: d.ComponentInstance, reflectHostAttr?: d.VNodeData) => {
  if (properties) {

    Object.keys(properties).forEach(memberName => {
      if (properties[memberName].reflectToAttr) {
        reflectHostAttr = reflectHostAttr || {};
        reflectHostAttr[memberName] = instance[memberName];
      }
    });

  }

  return reflectHostAttr;
};
