import { setMode } from '@stencil/core';

declare const Context: any;

const globalScript = () => {
  Context['myService'] = 12;

  setMode(elm => {
    return (elm as any).colormode || elm.getAttribute('colormode') || (window as any).KarmaMode
  });
};

export default globalScript;
