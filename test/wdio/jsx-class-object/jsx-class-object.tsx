import { Component, h, Host } from '@stencil/core';

import { JsxClassObjectInner } from './jsx-class-object-inner.js';

@Component({
  tag: 'jsx-class-object',
})
export class JsxClassObject {
  render() {
    return (
      <Host>
        Hello World!
        <JsxClassObjectInner answer="good" />
      </Host>
    );
  }
}
