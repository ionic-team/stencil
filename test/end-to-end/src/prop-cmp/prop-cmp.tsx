import { Component, Prop, h } from '@stencil/core';
import { saveAs } from 'file-saver';

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

  saveAs() {
    saveAs('data', 'filename.txt');
  }

  render() {
    return (
      <div>
        Hello, my name is {this.first} {this.lastName}
        <button onClick={() => this.saveAs()}>File Save</button>
      </div>
    )
  }
}
