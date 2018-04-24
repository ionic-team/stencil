import { Component } from '../../../../dist/index';

@Component({
  tag: 'slot-array',
  shadow: true
})
export class SvgAttr {

  render() {
    return [
      <span>Content should be on top</span>,
      <slot />
    ]
  }

}
