import { Component, Prop } from '../../../../../dist/index';
import { printLifecycle } from '../../global/util';


@Component({
  tag: 'cmp-d',
  styleUrl: 'cmp-d.css'
})
export class CmpD {

  @Prop({ context: 'isClient' }) isClient: boolean;
  @Prop() uniqueId: string = '';

  componentWillLoad() {
    printLifecycle(this.isClient, `CmpD - ${this.uniqueId}`, 'componentWillLoad');
  }

  componentDidLoad() {
    printLifecycle(this.isClient, `CmpD - ${this.uniqueId}`, 'componentDidLoad');
  }

  render() {
    return (
      <div>CmpD</div>
    );
  }
}
