import { flush, h, render, transpile } from '../index';
import { ComponentConstructor } from '../../declarations';


describe('rendering', () => {

  let element;
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

    element = await render({
      components: [MyComponent],
      html: '<my-component></my-component>'
    });
  });

  it('should work without parameters', () => {
    expect(element.textContent.trim()).toEqual(`Hello, World! I'm`);
  });

  it('should work with a first name', async () => {
    element.first = 'Peter';
    await flush(element);
    expect(element.textContent.trim()).toEqual(`Hello, World! I'm Peter`);
  });

  it('should work with a last name', async () => {
    element.last = 'Parker';
    await flush(element);
    expect(element.textContent.trim()).toEqual('Hello, World! I\'m  Parker');
  });

  it('should work with both a first and a last name', async () => {
    element.first = 'Peter';
    element.last = 'Parker';
    await flush(element);
    expect(element.textContent.trim()).toEqual('Hello, World! I\'m Peter Parker');
  });

});
