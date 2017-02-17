import Vue from 'vue'
import { ComponentClass } from '../shared/interfaces';
import { ComponentMeta } from '../decorators/decorators';


export function createRenderer(window: any, document: any): Renderer {
  const r: any = rendererFactory(window, document);
  return r;
}


export function registerComponent(r: Renderer, cls: ComponentClass, meta: ComponentMeta) {
  r.component(meta.selector, meta.render);
}


export interface Renderer {
  component: Vue.CreateElement;
}


function rendererFactory(window: any, document: any) {
'placeholder:vue.runtime.js'
}

