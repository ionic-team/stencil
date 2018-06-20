import { Component, State } from "../../../../dist/index";

@Component({
  tag: "shadow-dom-slot-mapped-order-root"
})
export class NestedCustomRoot {
  @State() items: string[] = ["0", "1", "2"];

  private addToItems() {
    this.items = [...this.items, `${this.items.length}`];
  }

  render() {
    return [
      <shadow-dom-slot-mapped-order>
        {this.items.map(item => <label>{item}</label>)}
      </shadow-dom-slot-mapped-order>,
      <button onClick={this.addToItems.bind(this)}>Add Item</button>
    ];
  }
}
