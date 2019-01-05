import { Component, Prop, h } from '@stencil/core';
import { printLifecycle } from '../../global/util';


@Component({
  tag: 'cmp-a',
  styleUrl: 'cmp-a.css'
})
export class CmpA {

  @Prop({ context: 'isClient' }) isClient: boolean;

  componentWillLoad() {
    printLifecycle(this.isClient, 'CmpA', 'componentWillLoad');
  }

  componentDidLoad() {
    printLifecycle(this.isClient, 'CmpA', 'componentDidLoad');
  }

  render() {
    return (
      <div>
        <div>CmpA</div>
        <cmp-b/>
        <slot/>
      </div>
    );
  }
}
