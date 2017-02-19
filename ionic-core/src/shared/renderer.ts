import Vue from 'vue'
import { AppInitOptions, ComponentClass } from '../shared/interfaces';
import { ComponentMeta, getComponentMeta } from '../decorators/decorators';


export function createApp(window: any, document: any, userRootCls: ComponentClass, opts: AppInitOptions): any {

  // generate a collection of the app components
  const appComponents: {[tag: string]: any} = {};

  // add the user's root component
  let meta = getComponentMeta(userRootCls);
  let userRootSelector = meta.selector || 'ion-user-root';
  appComponents[userRootSelector] = <any>meta;

  // create the app options
  const appRoot: ComponentOptions = {
    el: opts.rootSelector || 'ion-app',

    render: function (h) {
      return h('div',
        {
          class: 'ion-app md',
        },
        [
          h(userRootSelector)
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

  const opts: ComponentOptions = {
    render: meta.render,
    staticRenderFns: meta.staticRenderFns,
    beforeCreate: function() {
      console.debug(`${meta.selector} : beforeCreate`);
      initComponent(this, cls);
    },
    created() {
      console.debug(`${meta.selector} : created`);
    },
    data: function() {
      return {
        title: Math.random()
      }
    }
  };

  r.component(meta.selector, opts);
}


function initComponent(context: ComponentOptions, cls: ComponentClass) {
  let instance = context.instance = new cls();

  setTimeout(() => {
    console.log(context)
  }, 1000)
}


export interface Renderer {
  component: {(tag: string, opts: ComponentOptions): Vue};
}


export interface ComponentOptions extends Vue.ComponentOptions<any> {
  instance?: any;
}


function rendererFactory(window: any, document: any): any {
'placeholder:vue.runtime.js'
}
