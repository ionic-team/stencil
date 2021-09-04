import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'custom-element-root',
  shadow: true
})
export class CustomElementRoot {
  @State() optionalComponentString: 'a' | 'b' = 'a';

  render() {
    const OptionalComponentStringTag = 'custom-element-child-optional-string-' + this.optionalComponentString
    return (
      <div>
        <h4>Basic Nested Component</h4>
        <custom-element-child-a></custom-element-child-a>

        <h4>Optional Nested Component via String</h4>
        <OptionalComponentStringTag></OptionalComponentStringTag>
      </div>
    );
  }
}
