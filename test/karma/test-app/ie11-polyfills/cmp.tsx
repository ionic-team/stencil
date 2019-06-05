import { Component, h } from '@stencil/core';

@Component({
  tag: 'ie-polyfills'
})
export class IE11Polyfills {

  render() {
    return (
      <div>
        <div class="fetch">
          {!!window.fetch ? 'true' : 'false'}
        </div>
      </div>
    );
  }
}
