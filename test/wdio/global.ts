import { setMode } from '@stencil/core';

const globalScript = () => {
  setMode((elm) => {
    return (elm as any).colormode || elm.getAttribute('colormode');
  });
};

export default globalScript;
