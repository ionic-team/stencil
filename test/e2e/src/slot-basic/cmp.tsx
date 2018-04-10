import { Component, State } from '../../../../dist/index';


const textA = 'A';
const spanA = <span>A</span>;
const divA = <div>A</div>;

const textB = 'B';
const spanB = <span>B</span>;
const divB = <div>B</div>;


@Component({
  tag: 'slot-basic'
})
export class SlotBasic {

  @State() inc = 1;

  testClick() {
    this.inc++;
  }

  render() {
    return (
      <div>
        <button onClick={this.testClick.bind(this)} class='test'>
          Test
        </button>

        <div>
          Rendered: {this.inc}
        </div>

        <div class='results1'>
          <slot-basic-content>{textA}{textB}</slot-basic-content>
        </div>

        <div class='results2'>
          <slot-basic-content>{textA}{spanB}</slot-basic-content>
        </div>

        <div class='results3'>
          <slot-basic-content>{textA}{divB}</slot-basic-content>
        </div>

        <div class='results4'>
          <slot-basic-content><div>{textA}{divB}</div></slot-basic-content>
        </div>

        <div class='results5'>
          <slot-basic-content>{spanA}{textB}</slot-basic-content>
        </div>

        <div class='results6'>
          <slot-basic-content>{spanA}{spanB}</slot-basic-content>
        </div>

        <div class='results7'>
          <slot-basic-content>{spanA}{divB}</slot-basic-content>
        </div>

        <div class='results8'>
          <slot-basic-content>{divA}{textB}</slot-basic-content>
        </div>

        <div class='results9'>
          <slot-basic-content>{divA}{spanB}</slot-basic-content>
        </div>

        <div class='results10'>
          <slot-basic-content>{divA}{divB}</slot-basic-content>
        </div>

      </div>
    );
  }

}
