import { Prop, Component } from '@stencil/core';

@Component({
  tag: 'mixed-in-cmp'
})
export class ToMixin {
  @Prop() middleName: string = 'B';

  render() {
    return 'Hello. This is not used';
  }
}
