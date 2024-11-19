import { h } from '@stencil/core';
export class ListenWindow {
  constructor() {
    this.clicked = 0;
    this.scrolled = 0;
  }
  winClick() {
    this.clicked++;
  }
  winScroll() {
    this.scrolled++;
  }
  render() {
    return (h("div", null, h("div", { id: "clicked" }, "Clicked: ", this.clicked), h("div", null, "Scrolled: ", this.scrolled), h("button", null, "Click!"), h("div", { style: { background: 'gray', paddingTop: '2000px' } })));
  }
  static get is() { return "listen-window"; }
  static get states() {
    return {
      "clicked": {},
      "scrolled": {}
    };
  }
  static get listeners() {
    return [{
        "name": "click",
        "method": "winClick",
        "target": "window",
        "capture": false,
        "passive": false
      }, {
        "name": "scroll",
        "method": "winScroll",
        "target": "window",
        "capture": false,
        "passive": true
      }];
  }
}
