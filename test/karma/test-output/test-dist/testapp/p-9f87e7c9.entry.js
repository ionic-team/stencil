import { r as d, h as o, e as i } from "./p-55339060.js";

const l = class {
  constructor(o) {
    d(this, o), this.willLoad = 0, this.didLoad = 0, this.didUnload = 0;
  }
  componentWillLoad() {
    this.willLoad++;
  }
  componentDidLoad() {
    this.didLoad++;
  }
  disconnectedCallback() {
    this.didUnload++;
  }
  render() {
    return o(i, null, o("p", null, "componentWillLoad: ", this.willLoad), o("p", null, "componentDidLoad: ", this.didLoad), o("p", null, "disconnectedCallback: ", this.didUnload));
  }
};

export { l as dom_reattach }