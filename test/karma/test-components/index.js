import { Context, setMode } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

Context.someSetting = true;

const globalScript = () => {
  Context['myService'] = 12;
  setMode((elm) => {
    return elm.colormode || elm.getAttribute('colormode') || window.KarmaMode;
  });
};

const globalScripts = () => {
  globalScript();
};

globalScripts();
