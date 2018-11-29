import { Component } from '../../../../dist/index';

@Component({
  tag: 'dom-api'
})
export class DomApiCmp {

  render() {
    return (
      <span data-z="z" class="red green blue" data-a="a">
        dom api
      </span>
    );
  }
}
