import { Component, Prop } from '../../../../dist';

@Component({
  tag: 'bench-creation',
  shadow: true
})
export class BenchCreation {

  @Prop() index: number = 100;
  @Prop() index1: number = 100;
  @Prop() index2: number = 100;
  @Prop() index3: number = 100;
  @Prop() index4: number = 100;
  @Prop() index5: number = 100;
  @Prop() index6: number = 100;


  render() {
    return (
      <button class="native-button">
        <div class="inner-button">
          <slot name="start"></slot>
          <div class="inner-wrapper">
            <slot></slot>
            <slot name="end"></slot>
          </div>
          <div class="highlight"></div>
        </div>
        <div class="highlight"></div>
        <div class="ripple-effect"></div>
      </button>
    );
  }
}
