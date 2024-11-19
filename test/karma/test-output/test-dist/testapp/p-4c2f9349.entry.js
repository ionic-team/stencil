import { r as o, h as i } from "./p-55339060.js";

const e = class {
  constructor(i) {
    o(this, i);
  }
  render() {
    return [ i("div", {
      id: "relative"
    }), i("div", {
      id: "relativeToRoot"
    }), i("div", {
      id: "absolute"
    }) ];
  }
};

e.style = 'div#relativeToRoot{background-image:url("/assets/favicon.ico?relativeToRoot")}div#relative{background-image:url("../assets/favicon.ico?relative")}div#absolute{background-image:url("https://www.google.com/favicon.ico")}';

export { e as init_css_root }