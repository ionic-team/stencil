import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'key-reorder-root',
})
export class KeyReorderRoot {
  @State() isReversed = false;

  testClick() {
    this.isReversed = !this.isReversed;
  }

  render() {
    let items = [0, 1, 2, 3, 4];
    if (this.isReversed) {
      items.reverse();
    }

    return [
      <button onClick={this.testClick.bind(this)}>Test</button>,
      <div>
        {items.map((item) => {
          return (
            <div key={item} id={'item-' + item}>
              {item}
            </div>
          );
        })}
      </div>,
    ];
  }
}
