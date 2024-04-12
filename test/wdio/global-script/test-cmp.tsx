import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'global-script-test-cmp',
  scoped: true,
})
export class GlobalScriptTestCmp {
  @Prop() renderDistCustomElementComponent = false;

  render() {
    return <section>
      <div>I am rendered after {Date.now() - window.__testStart}</div>
      {this.renderDistCustomElementComponent && <attribute-basic></attribute-basic>}
    </section>;
  }
}
