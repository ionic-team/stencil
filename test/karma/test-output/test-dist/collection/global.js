import { setMode } from '@stencil/core';
import '@test-sibling';
const globalScript = () => {
  Context['myService'] = 12;
  setMode((elm) => {
    return elm.colormode || elm.getAttribute('colormode') || window.KarmaMode;
  });
};
export default globalScript;
