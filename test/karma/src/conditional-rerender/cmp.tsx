import { Component } from '../../../../dist/index';

@Component({
  tag: 'conditional-rerender'
})
export class ConditionalRerender {

  render() {
    return (
      <main>
        <slot/>
        <nav>Nav</nav>
      </main>
    );
  }
}
