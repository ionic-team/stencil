import { Component, Prop } from '../../../../dist/index';

@Component({
  tag: 'key-reorder'
})
export class KeyReorder {

  @Prop() num: number;

  render() {
    return (
      <div>
        {this.num}
      </div>
    );
  }
}
