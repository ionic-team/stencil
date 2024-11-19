import { h } from '@stencil/core';
export class ConditionalRerenderRoot {
  constructor() {
    this.showContent = false;
    this.showFooter = false;
  }
  componentDidLoad() {
    this.showFooter = true;
    setTimeout(() => (this.showContent = true), 20);
  }
  render() {
    return (h("conditional-rerender", null, h("header", null, "Header"), this.showContent ? h("section", null, "Content") : null, this.showFooter ? h("footer", null, "Footer") : null));
  }
  static get is() { return "conditional-rerender-root"; }
  static get states() {
    return {
      "showContent": {},
      "showFooter": {}
    };
  }
}
