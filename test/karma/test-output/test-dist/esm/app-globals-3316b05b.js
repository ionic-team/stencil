import { c as setMode } from './index-a2c0d171.js';

const globalScript = () => {
  setMode((elm) => {
    return elm.colormode || elm.getAttribute('colormode') || window.KarmaMode;
  });
};

const globalScripts = () => {
  globalScript();
};

export { globalScripts as g };
