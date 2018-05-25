import { Component, Prop } from '../../../../../dist/index';
import { printLifecycle } from '../../global/util';


@Component({
  tag: 'cmp-b',
  styleUrl: 'cmp-b.css'
})
export class CmpB {

  @Prop({ context: 'isClient' }) isClient: boolean;

  componentWillLoad() {
    printLifecycle(this.isClient, 'CmpB', 'componentWillLoad');
  }

  componentDidLoad() {
    printLifecycle(this.isClient, 'CmpB', 'componentDidLoad');
  }

  render() {
    return (
      <div>
        <div>CmpB</div>
        <cmp-c/>
      </div>
    );
  }
}
