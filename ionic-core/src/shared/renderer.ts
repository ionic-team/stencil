import Vue from 'vue';
import { App } from './app';
import { AppInitOptions, ComponentClass, ComponentInstance, PropOptionsMeta } from '../shared/interfaces';
import { getComponentMeta } from '../decorators/component';
import { getComponentPropMeta } from '../decorators/prop';
import { initComponent, componentDidLoad, componentWillUnload } from './component';


export function createApp(window: any, document: any, appRootCls: ComponentClass, opts: AppInitOptions): any {
  const appRootMeta = getComponentMeta(appRootCls);

  // create the Ionic App instance
  const app = new App();

  // fire up the renderer
  const Renderer = rendererFactory(window, document);

  // register the app root component
  const appRoot = registerComponent(Renderer, appRootCls, false);
  appRoot.el = appRootMeta.tag || 'ion-app';
  appRoot.mounted = function() {
    this.$el.classList.add('ion-app');
    app.isReady();
  };

  if (opts.components) {
    // add all of the app's components
    for (var i = 0, l = opts.components.length; i < l; i++) {
      registerComponent(Renderer, opts.components[i], true);
    }
  }

  // create the app
  new Renderer(appRoot);
}


function registerComponent(r: Renderer, cls: ComponentClass, reusableComponent: boolean) {
  const cmpMeta = getComponentMeta(cls);

  const opts: Vue.ComponentOptions<Vue> = {
    render: cmpMeta.render,

    staticRenderFns: cmpMeta.staticRenderFns,

    created() {
      if (this.$options.propsData) {
        proxyProps(this, this.$data);
      }
      componentDidLoad(this.$data);
    },

    beforeDestroy() {
      componentWillUnload(this.$data);
    },

    data() {
      return initComponent(cls);
    },

    computed: {},

    methods: {}
  };

  let keys: string[];
  let i: number;

  const cmpPropsMeta = getComponentPropMeta(cls);
  if (cmpPropsMeta) {
    let propOptsMeta: PropOptionsMeta;

    keys = Object.keys(cmpPropsMeta);
    i = keys.length;
    opts.props = {};

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

  keys = Object.getOwnPropertyNames(cls.prototype);
  keys.forEach(key => {
    if (key === 'constructor') return;

    const descriptor = Object.getOwnPropertyDescriptor(cls.prototype, key);

    if (typeof descriptor.value === 'function') {
      // method
      opts.methods[key] = cls.prototype[key];

    } else if (typeof descriptor.get === 'function') {
      // getter
      opts.computed[key] = opts.computed[key] || {};
      (<any>opts.computed[key]).get = function() {
        return this.$data[key];
      };

    } else if (typeof descriptor.set === 'function') {
      // setter
      opts.computed[key] = opts.computed[key] || {};
      (<any>opts.computed[key]).set = function(val: any) {
        this.$data[key] = val;
      };
    }
  });

  if (reusableComponent) {
    r.component(cmpMeta.tag, opts);
  }

  return opts;
}


function proxyProps(vm: Vue, cmpInstance: ComponentInstance) {
  Object.keys(vm.$options.propsData).forEach(propKey => {
    Object.defineProperty(cmpInstance, propKey, {
      get: function() {
        return (<any>vm)[propKey];
      },
      set: function(val: any) {
        (<any>vm)[propKey] = val;
      }
    });
  });
}


interface Renderer {
  component: {(tag: string, opts: Vue.ComponentOptions<Vue>): Vue};
}


function rendererFactory(window: any, document: any): any {
window;
document;
'placeholder:vue.runtime.js';
}
