import { Component, Prop } from '../../../../dist/index';

@Component({
  tag: 'shadow-dom-array',
  styleUrl: 'parent.css',
  shadow: true
})
export class ShadowDomArray {

  @Prop() values: number[] = [];

  render() {
    return this.values.map(v => <shadow-dom-child>{v}</shadow-dom-child>);
  }

}
