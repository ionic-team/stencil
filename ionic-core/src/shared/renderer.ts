import Vue from 'vue'
import { AppInitOptions, ComponentClass, ComponentCompiledMeta, PropOptions } from '../shared/interfaces';
import { getComponentMeta } from '../decorators/decorators';


export function createApp(window: any, document: any, userRootCls: ComponentClass, opts: AppInitOptions): any {

  // generate a collection of the app components
  const appComponents: {[tag: string]: any} = {};

  // add the user's root component
  let meta = getComponentMeta(userRootCls);
  let userRootSelector = meta.selector || 'ion-user-root';
  appComponents[userRootSelector] = <any>meta;

  // create the app options
  const appRoot: Vue.ComponentOptions<any> = {
    el: opts.rootSelector || 'ion-app',

    render: function(createElement) {
      return createElement('div',
        {
          class: 'ion-app md',
        },
        [
          createElement(userRootSelector)
        ]
      );
    },

    beforeCreate: function () {
      console.debug('root component: beforeCreate');
    },

    created: function () {
      console.debug('root component: created');
    },

    mounted: function () {
      console.debug('root component: mounted');
    },

    components: appComponents

  };

  // fire up the renderer
  const Renderer = rendererFactory(window, document);

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
  const meta = getComponentMeta(cls);

  const opts: Vue.ComponentOptions<any> = {
    render: meta.render,
    staticRenderFns: meta.staticRenderFns,
    beforeCreate: function() {
      console.debug(`${meta.selector} : beforeCreate`);
      initComponent(this, cls, meta);
    },
    created() {
      console.debug(`${meta.selector} : created`);
    }
  };

  r.component(meta.selector, opts);
}


function initComponent(vm: VueComponent, cls: ComponentClass, meta: ComponentCompiledMeta) {
  const instance = vm._ionInstance = new cls();

  const opts = vm.$options;

  let keys: string[];
  let i: number;
  let prop: any;

  // assign input properties
  let inputProps = meta.props;
  if (inputProps) {
    opts.props = {};
    keys = Object.keys(inputProps);
    i = keys.length;

    while (i--) {
      prop = inputProps[keys[i]];
      opts.props[keys[i]] = {
        type: (<PropOptions>prop).type,
        required: (<PropOptions>prop).required,
        default: (<PropOptions>prop).default,
        validator: (<PropOptions>prop).validator
      };
    }
  }

  // assign component methods
  let methods = meta.methods;
  if (methods) {
    opts.methods = {};
  }

  // assign component computed getters/setters
  let computed = meta.computed;
  if (computed) {
    opts.computed = {};
  }

  // proxy instance state data
  opts.data = instance;

}


interface Renderer {
  component: {(tag: string, opts: Vue.ComponentOptions<any>): Vue};
}


interface VueComponent extends Vue {
  _ionInstance?: any;
}


function rendererFactory(window: any, document: any): any {
'placeholder:vue.runtime.js'
}
