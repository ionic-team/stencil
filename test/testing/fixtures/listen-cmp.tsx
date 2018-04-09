import { Component, Listen, Prop } from '../../../dist/index';

@Component({
  tag: 'listen-cmp'
})
export class ListenCmp {

  @Prop({ mutable: true }) opened = false;

  @Listen('click')
  handleClick() {
    this.opened = !this.opened;
  }
}
