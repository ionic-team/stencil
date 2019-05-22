import { Component, h } from '@stencil/core';
import icon from './icon.svg';

@Component({
  tag: 'image-import'
})
export class ImageImport {

  render() {
    return (
      <div>
        <img src={icon} />
      </div>
    );
  }
}
