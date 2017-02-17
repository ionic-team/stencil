import Vue from 'vue'


export function createRenderer(window: any, document: any): Renderer {
  const r: any = rendererFactory(window, document);
  return r;
}


export function createComponent(r: Renderer) {

}


function rendererFactory(window: any, document: any) {
'placeholder:vue.runtime.js'
}


export interface Renderer {

}

