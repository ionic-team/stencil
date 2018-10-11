import { Component, State } from '../../../../dist/index';


@Component({
  tag: 'app-root'
})
export class AppRoot {

  @State() first: string;
  @State() last: string;

  componentWillLoad() {
    const url = new URL(window.location.href);
    this.first = url.searchParams.get('first') || 'Stencil';
    this.last = url.searchParams.get('last') || 'JS';
  }

  render() {
    return <prop-cmp first={this.first} lastName={this.last}></prop-cmp>
  }

}
