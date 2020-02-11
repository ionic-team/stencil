import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'prop-cmp',
  styleUrls: {
    ios: 'prop-cmp.ios.css',
    md: 'prop-cmp.md.css',
  },
  shadow: true
})
export class PropCmp {
  @Prop() first: string;
  @Prop() lastName: string;

  render() {
    return (
      <div>
        Hello, my name is {this.first} {this.lastName}
      </div>
    )
  }
}
