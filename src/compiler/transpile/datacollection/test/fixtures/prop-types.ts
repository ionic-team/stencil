import { Component, Method } from '../../../../../index';

/// STRINGS
const enum Text2 {
  Value = 'Value'
}
type Text5 = 'left' | 'right';
const STR_CONST = 'this is a string';
function returnText(): string {
  return 'dynamic';
}

/// NUMBERS
const enum Nu2 {
  Value = 2
}
type Nu5 = 0 | 1;
const NU_CONST = 12.3;
function returnNu(): number {
  return 12;
}

/// ANY
interface Something {
  prop: string;
}

@Component({
  tag: 'my-component',
})
class MyComponent {

  // Expect "string"
  @Prop() text0 = 'hola';
  @Prop() text1: 'md' | 'ios';
  @Prop() text2: Text2;
  @Prop() text3: string;
  @Prop() text4 = STR_CONST;
  @Prop() text5: Text5;
  @Prop() text6: string | undefined | null;
  @Prop() text7: 'md' | 'ios' | undefined;
  @Prop() text8 = returnText();
  @Prop() text9 = 'hola' + 'hello';
  @Prop() text10?: string;
  @Prop() text11!: string;


  // Expect "number"
  @Prop() nu0 = 12;
  @Prop() nu1: 2 | 1;
  @Prop() nu2: Nu2;
  @Prop() nu3: number;
  @Prop() nu4 = NU_CONST;
  @Prop() nu5: Nu5;
  @Prop() nu6: number | undefined | null;
  @Prop() nu7: 3 | 0.3 | undefined;
  @Prop() nu8 = returnNu();
  @Prop() nu9 = 3 + 1;
  @Prop() nu10?: number;
  @Prop() nu11!: number;

  // Expect "boolean"
  @Prop() bool0 = false;
  @Prop() bool1: boolean;
  @Prop() bool2: boolean | null;
  @Prop() bool3?: boolean;
  @Prop() bool4!: boolean;


  // TODO: revisit any vs unknown
  // Expect "any"
  @Prop() any0: any;
  @Prop() any1 = [];
  @Prop() any2 = {};
  @Prop() any3 = new WeakMap();
  @Prop() any4?: any;
  @Prop() any5!: any;


  // Expect "unknown"
  @Prop() unknown0: Something;
  @Prop() unknown1?: Something;
  @Prop() unknown2!: Something;
}
