import Vue from 'vue';
import { AppInitOptions, ComponentClass, ComponentCompiledMeta, ComponentInstance, PropOptionsMeta } from '../shared/interfaces';
import { getComponentMeta } from '../decorators/component';
import { getAllPropMeta } from '../decorators/prop';
import { initComponent, componentDidLoad, componentWillUnload } from './component';


export function createApp(window: any, document: any, appRootCls: ComponentClass, opts: AppInitOptions): any {
  let meta = getComponentMeta(appRootCls);

  // create the app options
  const appRoot = generateOptions(meta, appRootCls);
  appRoot.el = meta.tag || 'ion-app';
  appRoot.mounted = function() {
    this.$el.classList.add('ion-app');
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
  const opts = generateOptions(meta, cls);
  r.component(meta.tag, opts);
}


function generateOptions(meta: ComponentCompiledMeta, cls: ComponentClass) {
  const opts: Vue.ComponentOptions<VueInstance> = {
    render: meta.render,
    staticRenderFns: meta.staticRenderFns,

    beforeCreate() {
      createRenderComponent(this, cls);
    },

    created() {
      componentDidLoad(this._ion);
    },

    beforeDestroy() {
      componentWillUnload(this._ion);
    }
  };

  return opts;
}


function createRenderComponent(vm: VueInstance, cls: ComponentClass) {
  const instance = vm._ion = initComponent(cls);

  const opts = vm.$options;

  let keys: string[];
  let i: number;

  // assign input properties
  let inputProps = getAllPropMeta(cls);
  if (inputProps) {
    let prop: PropOptionsMeta;
    opts.props = {};
    keys = Object.keys(inputProps);
    i = keys.length;

    while (i--) {
      prop = inputProps[keys[i]];
      opts.props[keys[i]] = {
        type: prop.type,
        required: prop.required,
        default: prop.default,
        validator: prop.validator
      };
    }
  }

  // proxy instance state data
  opts.data = instance;
}


interface VueInstance extends Vue {
  _ion: ComponentInstance;
}


interface Renderer {
  component: {(tag: string, opts: Vue.ComponentOptions<VueInstance>): Vue};
}


function rendererFactory(window: any, document: any): any {
window;
document;
'placeholder:vue.runtime.js';
}
