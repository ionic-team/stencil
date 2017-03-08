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

  color: string;
  mode: string;


  constructor() {
    super();

    const annotations = (<IonicComponent>this.constructor).$annotations;

    initProperties(this, annotations.props);

    const api = Ionic().api;

    if (annotations.styles) {
      if (!api.hasElementCss(annotations.tag)) {
        api.appendStyles(annotations.tag, annotations.styles);
      }

    } else if (annotations.styleUrl) {
      if (!api.hasElementCss(annotations.tag)) {
        api.appendStyleUrl(annotations.tag, annotations.styleUrl);
      }
    }
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
