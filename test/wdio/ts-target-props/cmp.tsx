import { Component, Element, h, Prop, State } from '@stencil/core';

const customDecoratedProps = new Map<string, PropertyDescriptor | undefined>();

function CustomDecorator(): PropertyDecorator {
  return (_target: Object, propertyKey: string | symbol, descriptor?: PropertyDescriptor) => {
    customDecoratedProps.set(propertyKey.toString(), descriptor);
  };
}

@Component({
  tag: 'ts-target-props',
})
export class TsTargetProps {
  constructor() {
    customDecoratedProps.forEach((_descriptor, key) => {
      // @ts-ignore
      this.el[`__${key}`] = () => this[key] + ' decorated!';
    });
  }

  @Element() el: HTMLElement;

  @Prop() basicProp: string = 'basicProp';

  @CustomDecorator()
  @Prop()
  decoratedProp: string = 'decoratedProp';

  private _decoratedGetterSetterProp: string = 'decoratedGetterSetterProp';
  @CustomDecorator()
  @Prop()
  get decoratedGetterSetterProp() {
    return this._decoratedGetterSetterProp;
  }
  set decoratedGetterSetterProp(value: string) {
    this._decoratedGetterSetterProp = value;
  }

  @State() basicState: string = 'basicState';

  @CustomDecorator()
  @State()
  decoratedState: string = 'decoratedState';

  render() {
    return (
      <div>
        <div class="basicProp">{this.basicProp}</div>
        <div class="decoratedProp">{this.decoratedProp}</div>
        <div class="decoratedGetterSetterProp">{this.decoratedGetterSetterProp}</div>
        <div class="basicState">{this.basicState}</div>

        <button
          onClick={() => {
            this.basicState += ' changed ';
          }}
        >
          Change basicState
        </button>

        <div class="decoratedState">{this.decoratedState}</div>
        <button
          onClick={() => {
            this.decoratedState += ' changed ';
          }}
        >
          Change decoratedState
        </button>
      </div>
    );
  }
}
