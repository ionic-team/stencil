import { h } from '@stencil/core';
import stencilLogo from './stencil-logo.svg';
export class ImageImport {
  render() {
    return (h("div", null, h("img", { src: stencilLogo })));
  }
  static get is() { return "image-import"; }
}
