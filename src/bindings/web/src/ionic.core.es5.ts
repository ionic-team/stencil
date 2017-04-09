import { ConfigController } from '../../../client/config-controller';
import { DomController } from '../../../client/dom-controller';
import { initRenderer } from '../../../renderer/core';
import { Ionic } from '../../../util/interfaces';
import { NextTickController } from '../../../client/next-tick-controller';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponentsES5 } from '../../../client/registry.es5';


const ionic: Ionic = (<any>window).Ionic = (<any>window).Ionic || {};

const domCtrl = DomController(window);

const nextTickCtrl = NextTickController(window);

const plt = PlatformClient(window, document, ionic, ionic.staticDir, domCtrl, nextTickCtrl);

const renderer = initRenderer(plt);

const configCtrl = ConfigController(ionic.config || {});

registerComponentsES5(renderer, plt, configCtrl, ionic.components);
