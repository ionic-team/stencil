import { setMode } from '@stencil/core';

setMode(elm => {
  return (elm as any).colormode || elm.getAttribute('colormode') || (window as any).KarmaMode
});
