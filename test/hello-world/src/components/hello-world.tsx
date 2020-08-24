import { Component, h } from '@stencil/core';

@Component({
  tag: 'hello-world',
})
export class HelloWorld {
  render() {
    return <div>{getData()}</div>;
  }
}

const getData = async () => {
  const rsp = await fetch('http://ionic.io/');
  const txt = await rsp.text();
  return txt;
};
