import { ConfigController } from '../../../platform/config-controller';
import { DomController } from '../../../platform/dom-controller';
import { initRenderer } from '../../../renderer/core';
import { Ionic } from '../../../utils/interfaces';
import { NextTickController } from '../../../platform/next-tick-controller';
import { PlatformClient } from '../../../platform/platform-client';
import { registerComponentsES5 } from '../../../registry/registry.es5';


const ionic: Ionic = (<any>window).Ionic = (<any>window).Ionic || {};

const domCtrl = DomController(window);

const nextTickCtrl = NextTickController(window);

const plt = PlatformClient(window, document, ionic, ionic.staticDir, domCtrl, nextTickCtrl);

const renderer = initRenderer(plt);

const configCtrl = ConfigController(ionic.config || {});

registerComponentsES5(renderer, plt, configCtrl, ionic.components);
