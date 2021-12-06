import { Component, Prop, h, Host } from '@stencil/core';
import { saveAs } from 'file-saver';

/**
 * @virtualProp mode - Mode
 */
@Component({
  tag: 'prop-cmp',
  styleUrls: {
    ios: 'prop-cmp.ios.css',
    md: 'prop-cmp.md.css',
  },
  shadow: true,
})
export class PropCmp {
  @Prop() first: string;
  @Prop() lastName: string;

  saveAs() {
    saveAs('data', 'filename.txt');
  }

  render() {
    return (
      <Host>
        <div>
          Hello, my name is {this.first} {this.lastName}
        </div>
        <button onClick={() => this.saveAs()}>File Save</button>
      </Host>
    );
  }
}
