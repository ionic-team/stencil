import { r as t, h as s } from "./p-55339060.js";

const a = class {
  constructor(s) {
    t(this, s), this.value = void 0;
  }
  async componentWillLoad() {
    await this.update();
  }
  async getResult() {
    return (await __sc_import_testapp("./p-b8c680ab.js")).getResult();
  }
  async update() {
    this.value = await this.getResult();
  }
  render() {
    return s("div", null, this.value);
  }
};

export { a as dynamic_import }