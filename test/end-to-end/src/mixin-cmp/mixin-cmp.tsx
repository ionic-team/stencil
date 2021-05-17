import { Component, Mixin, Prop, h } from '@stencil/core';
import { ToMixin } from './to-mixin-plain';
import { ToMixin as ToMixinCmp } from './to-mixin-cmp';

@Mixin(ToMixinCmp)
@Mixin(ToMixin)
@Component({
  tag: 'mixin-cmp',
  shadow: true
})
export class MixinCmp {
  @Prop() firstName = 'Johnny';

  render() {
    return (
      <div>
        {this.firstName} {this.middleName} {this.surname}
      </div>
    )
  }
}
export interface MixinCmp extends ToMixinCmp, ToMixin {}
