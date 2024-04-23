import { Component, h } from '@stencil/core';
import styles from './styles.css';

@Component({
  tag: 'hello-vdom',
  styles,
  shadow: true,
})
export class HelloWorld {
  render() {
    return <h1>Hello Client-side shadow DOM!</h1>;
  }
}
