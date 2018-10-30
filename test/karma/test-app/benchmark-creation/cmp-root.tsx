import { Component, Element, Prop, State } from '../../../../dist';

@Component({
  tag: 'bench-creation-root'
})
export class BenchCreationRoot {

  @Element() el: HTMLElement;
  @State() visible = false;
  @Prop() nu = 500;

  render() {

    return [
      <button onClick={() => this.visible = !this.visible}>Toggle</button>,
      <div>
        {this.visible && Array.from({length: this.nu}, ((_, i) => (
          <bench-creation index={i} index1={i + 1} index2={i + 2} index3={i + 3} index4={i + 4} index5={i + 5} index6={i + 6}>
            <div><span>Content of the item</span></div>
          </bench-creation>
        )))}
      </div>
    ];
  }
}
