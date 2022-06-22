import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'child-reflect-nan-attribute',
  // 'shadow' is not needed here, but does make testing easier by using the shadow root to help encapsulate textContent
  shadow: true,
})
export class ChildReflectNanAttribute {
  // for this test, it's necessary that 'reflect' is true, the class member is not camel-cased, and is of type 'number'
  @Prop({ reflect: true }) val: number;

  // counter to proxy the number of times a render has occurred, since we don't have access to those dev tools during
  // karma tests
  renderCount = 0;

  render() {
    this.renderCount += 1;
    return <div>child-reflect-nan-attribute Render Count: {this.renderCount}</div>;
  }

  componentDidUpdate() {
    // we don't expect the component to update, this will increment the render count in case it does (and should fail
    // the test)
    this.renderCount += 1;
  }
}
