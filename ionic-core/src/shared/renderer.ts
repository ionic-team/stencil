import Vue from 'vue';
import { App } from './app';
import { AppInitOptions, ComponentClass, ComponentInstance, ComponentCompiledMeta, PropOptionsMeta } from '../shared/interfaces';
import { getComponentMeta } from '../decorators/component';
import { getComponentPropMeta } from '../decorators/prop';
import { initComponent, componentDidLoad, componentWillUnload } from './component';


export function createApp(window: any, document: any, appRootCls: ComponentClass, opts: AppInitOptions): any {
  const appRootMeta = getComponentMeta(appRootCls);

  // create the Ionic App instance
  const app = new App();

  // fire up the renderer
  const Renderer: Renderer = rendererFactory(window, document);

  // register the app root component
  const appRoot = generateComponentOptions(appRootMeta, appRootCls);
  appRoot.el = appRootMeta.tag || 'ion-app';
  appRoot.mounted = function() {
    this.$el.classList.add('ion-app');
    app.isReady();
  };

  if (opts.components) {
    // add all of the app's components
    opts.components.forEach(cls => {
      const meta = getComponentMeta(cls);
      Renderer.component(meta.tag, generateComponentOptions(meta, cls));
    });
  }

  if (opts.pages) {
    opts.pages.forEach(page => {
      Renderer.component(page.tag, function(resolve: Function) {
        setTimeout(function(){
          const asyncReceivedCls: any = {};
          const meta = getComponentMeta(asyncReceivedCls);
          const opts = generateComponentOptions(meta, asyncReceivedCls)
          resolve(opts);
        }, 1000);
      });
    });
  }

  // create the app
  new Renderer(appRoot);
}


function generateComponentOptions(cmpMeta: ComponentCompiledMeta, cls: ComponentClass) {

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

    methods: {},

    watch: {}
  };

  const cmpPropsMeta = getComponentPropMeta(cls);
  if (cmpPropsMeta) {
    let propOptsMeta: PropOptionsMeta;

    let keys = Object.keys(cmpPropsMeta);
    let i = keys.length;
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

  Object.getOwnPropertyNames(cls.prototype).forEach(key => {
    if (key === 'constructor') return;

    const descriptor = Object.getOwnPropertyDescriptor(cls.prototype, key);

    if (typeof descriptor.value === 'function') {
      // method
      opts.methods[key] = cls.prototype[key];

    } else {
      if (typeof descriptor.get === 'function') {
        // getter

        // computed getter property
        opts.computed[key] = opts.computed[key] || {};
        (<any>opts.computed[key]).get = function() {
          return this.$data[key];
        };
      }

      if (typeof descriptor.set === 'function') {
        // setter

        if ((<any>opts).props[key]) {
          // if a property is already a "prop" property, as in an object
          // reference is being passed down from the parent to the child,
          // and this property on this component is also a "setter", then
          // we don't want  to make this a "computed" property, but rather
          // we need to "watch" the property and fire off this setter when
          // the parent's data changes.

          // watch setter property
          opts.watch[key] = function(val: any) {
            debugger;
            cls.prototype[key].call(this.$data, val);
          };

        } else {
          // computed setter property
          opts.computed[key] = opts.computed[key] || {};
          (<any>opts.computed[key]).set = function(val: any) {
            this.$data[key] = val;
          };
        }
      }
    }
  });

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
  new (appRootOpts: any): any;
  component: {(tag: string, opts: Vue.ComponentOptions<Vue>): Vue};
}


function rendererFactory(window: any, document: any): any {
window;
document;
'placeholder:vue.runtime.js';
}
