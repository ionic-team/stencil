import { Method, Prop } from '@stencil/core';

export class ToMixin {
  @Prop() surname: string = 'Good';

  protected title: string = 'Mr';

  @Method()
  async surnameWithTitle() {
    return `${this.title} ${this.surname}`;
  }
}
