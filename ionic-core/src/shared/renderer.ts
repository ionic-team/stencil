import Vue from 'vue'
import { AppInitializeData, ComponentClass } from '../shared/interfaces';
import { ComponentMeta } from '../decorators/decorators';


export function createRenderer(window: any, document: any): Renderer {
  const r: any = rendererFactory(window, document);
  return r;
}


export function createApp(r: Renderer, appInit: AppInitializeData) {
  debugger
  const app = new (<any>r)({
    el: appInit.el
  });
}


export function registerComponent(r: Renderer, cls: ComponentClass, meta: ComponentMeta) {
  r.component(meta.selector, meta.render);


}

export interface Renderer extends Vue {
  component: Vue.CreateElement;
}


function rendererFactory(window: any, document: any) {
'placeholder:vue.runtime.js'
}

