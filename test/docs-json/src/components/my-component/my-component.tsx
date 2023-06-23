import { Component, h, Method } from '@stencil/core';
import { importedInterface, ImportedInterface } from './imported-interface';

@Component({
  tag: 'my-component',
  shadow: true,
})
export class MyComponent {
  /**
   * A comment, which should be included, I should think!
   */
  @Method()
  onDidDismiss<T>(arg: T): Promise<ImportedInterface<T>> {
    return importedInterface(arg);
  }

  render() {
    return <div>Hello, World! I'm a mess 🫠</div>;
  }
}
