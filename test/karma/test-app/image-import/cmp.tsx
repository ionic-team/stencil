import { Component, State, h } from '@stencil/core';
import icon from './icon.svg';

@Component({
  tag: 'image-import'
})
export class ImageImport {

  @State() isOpen = false;

  testClick() {
    this.isOpen = !this.isOpen;
  }

  render() {
    return (
      <div>
        <img src={icon} />
      </div>
    );
  }

}
