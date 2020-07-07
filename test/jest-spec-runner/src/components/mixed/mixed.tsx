// @ts-nocheck
import { Component, Host, h } from '@stencil/core';
import deepEsm from '../utils/as-js-esm';
import deepCjs from '../utils/as-js-cjs';
import deepTs from '../utils/as-ts';

@Component({
  tag: 'my-mixed',
  shadow: false,
})
export class MyMixed {
  render() {
    return (
      <Host>
        <span id="esm">{deepEsm()}</span>
        <span id="cjs">{deepCjs()}</span>
        <span id="ts">{deepTs()}</span>
      </Host>
    );
  }
}
