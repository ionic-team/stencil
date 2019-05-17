import { Component, h } from '@stencil/core';
import { store } from './external-store'


@Component({
  tag: 'external-import-a'
})
export class ExternalImportA {
  first?: string;
  last?: string;

  componentWillLoad() {
    const data = store().data;
    this.first = data.first;
    this.last = data.last;
  }

  render() {
    return (
      <div>{this.first} {this.last}</div>
    );
  }
}
