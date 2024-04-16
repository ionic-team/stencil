import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'global-script-test-cmp',
  scoped: true,
})
export class GlobalScriptTestCmp {
  @Prop() renderDistCustomElementComponent = false;

  render() {
    return (
      <section>
        <div>I am rendered after {Date.now() - window.__testStart}</div>
        {/*
        rendering this component will fail as `<attribute-basic /`> is compiled with
        a `dist-custom-element` output target, which will break in a lazy load environment
      */}
        {this.renderDistCustomElementComponent && <attribute-basic></attribute-basic>}
      </section>
    );
  }
}
