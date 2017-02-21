import Vue from 'vue';
import { App } from './app';
import { AppInitOptions, ComponentClass, PropOptionsMeta } from '../shared/interfaces';
import { getComponentMeta } from '../decorators/component';
import { getComponentPropMeta } from '../decorators/prop';
import { initComponent, componentDidLoad, componentWillUnload } from './component';


export function createApp(window: any, document: any, appRootCls: ComponentClass, opts: AppInitOptions): any {
  const appRootMeta = getComponentMeta(appRootCls);

  // create the Ionic App instance
  const app = new App();

  // fire up the renderer
  const Renderer = rendererFactory(window, document);

  // create the app root component
  const appRoot: Vue.ComponentOptions<Vue> = {
    el: appRootMeta.tag || 'ion-app',
    render: appRootMeta.render,
    staticRenderFns: appRootMeta.staticRenderFns,
    data: new appRootCls(),
    mounted() {
      this.$el.classList.add('ion-app');
      app.isReady();
    }
  };

  if (opts.components) {
    // add all of the app's components
    for (var i = 0, l = opts.components.length; i < l; i++) {
      registerComponent(Renderer, opts.components[i]);
    }
  }

  // create the app
  new Renderer(appRoot);
}


function registerComponent(r: Renderer, cls: ComponentClass) {
  const cmpMeta = getComponentMeta(cls);

  const opts: Vue.ComponentOptions<Vue> = {
    render: cmpMeta.render,

    staticRenderFns: cmpMeta.staticRenderFns,

    created() {
      componentDidLoad(this.$data);
    },

    beforeDestroy() {
      componentWillUnload(this.$data);
    },

    data: function() {
      return initComponent(cls);
    }
  };

  // assign input properties
  const cmpPropsMeta = getComponentPropMeta(cls);
  if (cmpPropsMeta) {
    let keys: string[];
    let i: number;
    let propOptsMeta: PropOptionsMeta;

    opts.props = {};
    keys = Object.keys(cmpPropsMeta);
    i = keys.length;

    while (i--) {
      propOptsMeta = cmpPropsMeta[keys[i]];
      opts.props[keys[i]] = {
        type: propOptsMeta.type,
        required: propOptsMeta.required,
        default: propOptsMeta.default,
        validator: propOptsMeta.validator
      };
    }
  }

  r.component(cmpMeta.tag, opts);
}


interface Renderer {
  component: {(tag: string, opts: Vue.ComponentOptions<Vue>): Vue};
}


function rendererFactory(window: any, document: any): any {
window;
document;
'placeholder:vue.runtime.js';
}
