import { setMode } from '@stencil/core';
import '@test-sibling';

const globalScript = () => {
  setMode((elm) => {
    return (elm as any).colormode || elm.getAttribute('colormode') || (window as any).KarmaMode;
  });
};

export default globalScript;
