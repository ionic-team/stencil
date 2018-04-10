import { Component, Prop } from '../../../dist/index';

@Component({
  tag: 'prop-cmp'
})
export class PropCmp {
  @Prop() first: string;
  @Prop() lastName: string;

  render() {
    return (
      <div>
        Hello, my name is {this.first} {this.lastName}
      </div>
    )
  }
}
