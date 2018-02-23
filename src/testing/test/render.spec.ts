import { flush, render, transpile } from '../index';
import { h } from '../../core/renderer/h';
import { ComponentConstructor } from '../../declarations';


describe('rendering', () => {

  let elm;
  let MyComponent: ComponentConstructor;

  beforeEach(async () => {
    MyComponent = class {
      first = '';
      last = '';
      static get is() {
        return 'my-component';
      }
      static get properties() {
        return {
          first: {
            type: String
          },
          last: {
            type: String
          }
        };
      }
      render() {
        return h(`div`, null, `Hello, World! I'm ${this.first} ${this.last}`);
      }
    };

    elm = await render({
      components: [MyComponent],
      html: '<my-component></my-component>'
    });
  });

  it('should work without parameters', () => {
    expect(elm.textContent.trim()).toEqual(`Hello, World! I'm`);
  });

  it('should work with a first name', async () => {
    elm.first = 'Peter';
    await flush(elm);
    expect(elm.textContent.trim()).toEqual(`Hello, World! I'm Peter`);
  });

  it('should work with a last name', async () => {
    elm.last = 'Parker';
    await flush(elm);
    expect(elm.textContent.trim()).toEqual('Hello, World! I\'m  Parker');
  });

  it('should work with both a first and a last name', async () => {
    elm.first = 'Peter';
    elm.last = 'Parker';
    await flush(elm);
    expect(elm.textContent.trim()).toEqual('Hello, World! I\'m Peter Parker');
  });

});
