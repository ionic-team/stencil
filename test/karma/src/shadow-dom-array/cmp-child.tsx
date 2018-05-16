import { Component } from '../../../../dist/index';

@Component({
  tag: 'shadow-dom-child',
  styleUrl: 'child.css',
  shadow: true
})
export class ShadowDomArrayChild {

  render() {
    return (
      <p>
        <shadow-dom-aux/>
        <slot></slot>
        <shadow-dom-aux/>
      </p>
    );
  }

}
