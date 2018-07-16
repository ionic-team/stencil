import { Component } from '../../../../dist';

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
