import { Component, Element, h, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'input-basic-root'
})
export class InputBasicRoot {

  @Element() el: HTMLElement;
  @Prop({ mutable: true }) value: string;
  @Watch('value')
  onValueChanges(v: any) {
    console.log('onValueChanges', v);
  }

  render() {
    console.log('render');
    return (
      <div>
        <input type="text" value={this.value} onInput={(ev: any) => this.value = ev.target.value}></input>
      </div>
    );
  }
}
