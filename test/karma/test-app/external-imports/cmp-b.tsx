import { Component } from '../../../../dist';
import { store } from './external-store'


@Component({
  tag: 'external-import-b'
})
export class ExternalImportB {
  first: string;
  last: string;

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
