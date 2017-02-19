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
  const appRoot: Vue.ComponentOptions<any> = {
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
      meta = getComponentMeta(opts.components[i]);
      Renderer.component(meta.selector, <any>meta);
    }
  }

  // create the app
  new Renderer(appRoot);
}


const APP_MIXINS = {

  created: function () {
    console.log('mixin: created!');
  },

  methods: {
    heyYou: function () {
      console.log('mixin: heyYou!')
    }
  }

};


function rendererFactory(window: any, document: any): any {
'placeholder:vue.runtime.js'
}
