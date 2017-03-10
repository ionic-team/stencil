import { Component, Prop } from '../utils/decorators';
import { Ionic } from '../utils/global';
import { initProperties } from './init-element';
import { toCamelCase } from '../utils/helpers';
import { Annotations, IonicComponent, VNode, VNodeData, Props } from '../utils/interfaces';
import { patchHostElement } from './patch-element';
export { h } from '../renderer/core';
export { Annotations, Component, IonicComponent, VNode, VNodeData, Prop, Props };


export class IonElement extends getBaseElement() {
  /** @internal */
  _vnode: VNode;
  /** @internal */
  _q: boolean = true;
  /** @internal */
  _root: ShadowRoot;

  color: string;
  mode: string;


  constructor() {
    super();

    const api = Ionic().api;
    const annotations = (<IonicComponent>this.constructor).$annotations;

    this._root = this.attachShadow({mode: 'open'});

    if (annotations.externalStyleUrls) {
      annotations.externalStyleUrls.forEach(externalStyleUrl => {
        const link = <HTMLLinkElement>api.createElement('link');
        link.href = externalStyleUrl;
        link.rel = 'stylesheet';
        this._root.appendChild(link);
      });
    }

    if (annotations.styles) {
      const style = <HTMLStyleElement>api.createElement('style');
      style.innerHTML = annotations.styles;
      this._root.appendChild(style);
    }

    initProperties(this, annotations.props);
  }


  connectedCallback() {
    this._q = false;
    this.update();
  }


  static get observedAttributes() {
    const annotations = (<IonicComponent>this).$annotations = (<IonicComponent>this).$annotations || {};
    annotations.obsAttrs = annotations.obsAttrs || [];
    // all components have mode and color props
    annotations.obsAttrs.push('mode', 'color');
    return annotations.obsAttrs;
  }


  static set observedAttributes(attrs: string[]) {
    const annotations = (<IonicComponent>this).$annotations = (<IonicComponent>this).$annotations || {};

    if (annotations.obsAttrs) {
      Array.prototype.push.apply(annotations.obsAttrs, attrs);
    } else {
      annotations.obsAttrs = attrs;
    }
  }


  update() {
    const elm = this;

    // only run patch if it isn't queued already
    if (!elm._q) {
      elm._q = true;

      // run the patch in the next tick
      const ionic = Ionic();
      ionic.api.nextTick(() => {

        // vdom diff and patch the host element for differences
        patchHostElement(ionic.config, ionic.api, ionic.renderer, elm);

        this._onUpdates.forEach(cb => {
          cb(elm);
        });

        // no longer queued
        elm._q = false;
      });
    }
  }


  attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (oldVal !== newVal) {
      (<any>this)[toCamelCase(attrName)] = newVal;
    }
  }

  onUpdate(cb: {(elm: IonElement)}) {
    this._onUpdates.push(cb);
  }

  _onUpdates: Function[] = [];

  disconnectedCallback() {
    this._root = this._vnode = null;
  }

  render(): VNode { return null; };

}


function getBaseElement(): { new(): HTMLElement } {
  if (typeof HTMLElement !== 'function') {
    const BaseElement = function(){};
    BaseElement.prototype = Ionic().api.createElement('div');
    return <any>BaseElement;
  }

  return HTMLElement;
}
