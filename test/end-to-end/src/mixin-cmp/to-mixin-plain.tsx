import { Method, Prop } from '@stencil/core';
import type { Title } from './interfaces';

export default class ToMixin {
  @Prop() surname: string = 'Good';
  @Prop() nameTitle: Title = 'Mr';

  @Method()
  async surnameWithTitle() {
    return `${this.nameTitle} ${this.surname}`;
  }
}
