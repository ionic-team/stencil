import { Prop, State, Event, EventEmitter, Method, Listen } from '@stencil/core';
import { utility as utility1 } from './utility1';

export class MixedBasic {
  @Event() eventFromBasicClass: EventEmitter<string>;
  @State() stateFromBasicClass: string = `I'm a state from a basic class`;
  @Prop() propFromBasicClass: string = `I'm a prop from a basic class`;
  @Method()
  async methodFromBasicClass() {
    return `I'm a method from a basic class`;
  }
  @Listen('click')
  listenerFromBasicClass() {
    this.eventFromBasicClass.emit(`I'm a listener from a basic class`);
  }
  private privatePropFromBasicClass: string = `I'm a private prop from basic class`;
  privateMethodFromBasicClass() {
    return this.privatePropFromBasicClass;
  }
  privateMethodFromBasicClassReverse() {
    return utility1(this.privatePropFromBasicClass);
  }
  @Prop() nameClash: string = `I won't be present at all`;
}
