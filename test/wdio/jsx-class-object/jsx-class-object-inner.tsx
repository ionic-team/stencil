import { Component, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'jsx-class-object-inner',
})
export class JsxClassObjectInner {
  /**
   * The answer to the question.
   */
  @Prop() answer = 'good';

  render() {
    return (
      <Host>
        How are you?
        <p>Answer: {this.answer}</p>
      </Host>
    );
  }
}
