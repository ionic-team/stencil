import { Component, Mixin, Prop, h, Listen, Element } from '@stencil/core';
import { MixedBasic as MixedBasicAlias1 } from './mixed-in-component';
import { MixedBasic as MixedBasicAlias2 } from './mixed-in-class';

@Mixin(MixedBasicAlias1)
@Mixin(MixedBasicAlias2)
@Component({
  tag: 'mixin-basic'
})
export class MixinBasic {
  @Element() el: HTMLElement;
  @Prop() nameClash: boolean = false;
  @Listen('eventFromComponent')
  eventFromComponentListener(e: CustomEvent) {
    this.el.querySelector('.eventComponent').textContent = e.detail;
  }
  @Listen('eventFromBasicClass')
  eventFromBasicClassListener(e: CustomEvent) {
    this.el.querySelector('.eventBasic').textContent = e.detail;
  }

  render() {
    return <div>
      <this.renderTpl/>
      <h2 class="privateMethodBasic">{this.privateMethodFromBasicClass()} {this.privateMethodFromBasicClassReverse()}</h2>
      <h2 class="privateMethodComponent">{this.privateMethodFromComponent()} {this.privateMethodFromComponentReverse()}</h2>
      <h3 class="stateBasic">{this.stateFromBasicClass}</h3>
      <h3 class="stateComponent">{this.stateFromComponent}</h3>
      <h4 class="eventBasic"></h4>
      <h4 class="eventComponent"></h4>
    </div>
  }
}
export interface MixinBasic extends Omit<MixedBasicAlias1, 'nameClash' | 'nameFiltered'>, Omit<MixedBasicAlias2, 'nameClash'> {}
