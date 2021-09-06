import { Component, Prop, State, Event, EventEmitter, Method, Listen, h, VNode } from '@stencil/core';
import { utility as utility2 } from './utility2';

@Component({
  tag: 'mixed-in-basic',
  shadow: true,
})
export class MixedBasic {
  @Event() eventFromComponent: EventEmitter<string>;
  @State() stateFromComponent: string = `I'm a state from a component`;
  @Prop() propFromComponent: string = `I'm a prop from a component`;
  @Method()
  async methodFromComponent() {
    return `I'm a method from a component`;
  }
  @Listen('click')
  listenerFromComponent() {
    this.eventFromComponent.emit(`I'm a listener from a component`);
  }
  private privatePropFromComponent: string = `I'm a private prop from component`;
  privateMethodFromComponent() {
    return this.privatePropFromComponent;
  }
  privateMethodFromComponentReverse() {
    return utility2(this.privatePropFromComponent);
  }
  @Prop() nameClash: string = `I won't be present at all`;
  @Prop() nameFiltered: string = `I won't be present at all`;

  renderTpl(): VNode {
    return <h1>I'm a jsx node from a mixed in component</h1>;
  }
}
