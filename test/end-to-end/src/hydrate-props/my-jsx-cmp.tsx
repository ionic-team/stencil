import { Component, h, Prop } from '@stencil/core';

/**
 * @virtualProp mode - Mode
 */
@Component({
  tag: 'my-jsx-cmp',
  shadow: true,
})
export class MyJsxCmp {
  @Prop()
  fooProp: string;

  @Prop()
  get barProp() {
    return 'bar';
  }

  render() {
    return (
      <div>
        {this.fooProp} - {this.barProp}
      </div>
    );
  }
}
