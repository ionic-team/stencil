import { Component, Prop } from '../../../../../dist/index';
import { printLifecycle } from '../../global/util';


@Component({
  tag: 'cmp-d',
  styleUrl: 'cmp-d.css'
})
export class CmpD {

  @Prop({ context: 'isClient' }) isClient: boolean;

  componentWillLoad() {
    printLifecycle(this.isClient, 'CmpD', 'componentWillLoad');
  }

  componentDidLoad() {
    printLifecycle(this.isClient, 'CmpD', 'componentDidLoad');
  }

  render() {
    return (
      <div>CmpD</div>
    );
  }
}
