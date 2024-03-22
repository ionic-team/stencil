import { Component, h } from '@stencil/core';

@Component({
  tag: 'global-script-test-cmp',
  scoped: true,
})
export class SiblingRoot {
  render() {
    return <div>I am rendered after {Date.now() - window.__testStart}</div>;
  }
}
