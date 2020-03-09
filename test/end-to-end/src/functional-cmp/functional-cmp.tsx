import { Component, FunctionalComponent, h } from '@stencil/core';

@Component({
  tag: 'functional-cmp-wrapper',
  shadow: true,
})
export class FunctionalCmpWrapper {
  render() {
    return <FunctionalCmp />;
  }
}

const FunctionalCmp: FunctionalComponent<FunctionalCmpProps> = ({ first = 'Kim', last = 'Doe' } = {}) => (
  <div>Hi, my name is {first} {last}.</div>
);

interface FunctionalCmpProps {
  first?: string;
  last?: string;
}
