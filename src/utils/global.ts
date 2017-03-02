import { Config } from './config';
import { GlobalIonic } from '../utils/interfaces';
import { PlatformClient } from '../platform/platform-client';
import { initRenderer, attributesModule, classModule, eventListenersModule, styleModule } from '../renderer/core';

declare const global: any;


export function Ionic(opts?: GlobalIonic): GlobalIonic {
  const GLOBAL = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : Function('return this;')();
  const ionic: GlobalIonic  = (GLOBAL.ionic = GLOBAL.ionic || {});

  if (opts) {
    if (opts.api) {
      ionic.api = opts.api;
    }
    if (opts.config) {
      ionic.config = opts.config;
    }
  }

  if (!ionic.api) {
    ionic.api = new PlatformClient(document);
  }

  if (!ionic.renderer) {
    ionic.renderer = initRenderer([
      attributesModule,
      classModule,
      eventListenersModule,
      styleModule
    ], ionic.api);
  }

  if (!ionic.config) {
    ionic.config = new Config();
  }

  if (!ionic.obsAttrs) {
    ionic.obsAttrs = new WeakMap();
  }

  if (!ionic.props) {
    ionic.props = new WeakMap();
  }

  return ionic;
}
