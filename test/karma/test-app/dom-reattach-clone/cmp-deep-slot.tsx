import { Component, h } from '@stencil/core';

@Component({
  tag: 'dom-reattach-clone-deep-slot',
})
export class DomReattachCloneDeep {
  render() {
    return (
      <div class="wrapper">
        <span class="component-mark-up">Component mark-up</span>
        <div>
          <section>
            <slot></slot>
          </section>
        </div>
      </div>
    );
  }
}
