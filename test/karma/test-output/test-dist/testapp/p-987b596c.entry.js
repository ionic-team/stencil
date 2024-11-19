import { r as l, h as i } from "./p-55339060.js";

const c = class {
  constructor(i) {
    l(this, i), this.clicked = 0, this.scrolled = 0;
  }
  winClick() {
    this.clicked++;
  }
  winScroll() {
    this.scrolled++;
  }
  render() {
    return i("div", null, i("div", {
      id: "clicked"
    }, "Clicked: ", this.clicked), i("div", null, "Scrolled: ", this.scrolled), i("button", null, "Click!"), i("div", {
      style: {
        background: "gray",
        paddingTop: "2000px"
      }
    }));
  }
};

export { c as listen_window }