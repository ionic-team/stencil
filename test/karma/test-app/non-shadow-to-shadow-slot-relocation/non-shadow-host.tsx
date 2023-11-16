import { Component, h } from '@stencil/core';

@Component({
  tag: 'non-shadow-host',
  shadow: false,
})
export class NonShadowHost {
  render() {
    return (
      <div>
        <drop-down>
          <slot name="main-content" slot="main-content" />
          <div slot="dropdown-content-element">
            <drop-down-content>
              <slot name="dropdown-content" />
            </drop-down-content>
          </div>
        </drop-down>
      </div>
    );
  }
}
