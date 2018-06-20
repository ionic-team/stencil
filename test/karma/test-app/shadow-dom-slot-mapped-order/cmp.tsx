import { Component } from "../../../../dist/index";

@Component({
  tag: "shadow-dom-slot-mapped-order",
  shadow: true
})
export class NestedCustom {
  render() {
    return (
      <div class="mapped-content">
        <slot />
      </div>
    );
  }
}
