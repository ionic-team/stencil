import { Component, Prop } from '../../../../../dist/index';
import { printLifecycle } from '../../global/util';


@Component({
  tag: 'cmp-c',
  styleUrl: 'cmp-c.css'
})
export class CmpC {

  @Prop({ context: 'isClient' }) isClient: boolean;

  componentWillLoad() {
    printLifecycle(this.isClient, 'CmpC', 'componentWillLoad');
  }

  componentDidLoad() {
    printLifecycle(this.isClient, 'CmpC', 'componentDidLoad');
  }

  render() {
    return (
      <div>
        <div>CmpC</div>
        <cmp-d unique-id="c-child"/>
      </div>
    );
  }
}
