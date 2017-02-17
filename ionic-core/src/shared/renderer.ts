import Vue from 'vue'
import { AppInitOptions, ComponentClass } from '../shared/interfaces';
import { ComponentMeta, getComponentMeta } from '../decorators/decorators';


export function createRenderer(window: any, document: any): Renderer {
  const r: any = rendererFactory(window, document);
  return r;
}


export function createApp(window: any, document: any, rootComponentCls: any, opts: AppInitOptions): any {
  const r: any = rendererFactory(window, document);

  const rootComponentMeta = getComponentMeta(rootComponentCls);

  (<any>rootComponentMeta).el = rootComponentMeta.selector;

  const app: Vue = new (<any>r)(rootComponentMeta);

  app.$el.classList.add('ion-app');

  return app;
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

