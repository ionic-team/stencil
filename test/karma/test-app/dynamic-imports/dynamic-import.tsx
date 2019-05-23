import { Component, Method, State, h } from '@stencil/core';

@Component({
  tag: 'dynamic-import'
})
export class DynamicImport {

  @State() value?: string;

  async componentWillLoad() {
    await this.update();
  }

  async getResult() {
    return (await import('./module1')).getResult();
  }

  @Method()
  async update() {
    this.value = await this.getResult();
  }

  render() {
    return (
      <div>{this.value}</div>
    );
  }

}
