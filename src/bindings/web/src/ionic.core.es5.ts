import { ConfigController } from '../../../client/config-controller';
import { DomController } from '../../../client/dom-controller';
import { IonicGlobal } from '../../../util/interfaces';
import { NextTickController } from '../../../client/next-tick-controller';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponentsES5 } from '../../../client/registry.es5';
import { Renderer } from '../../../client/renderer/core';


const IonicGlobal: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

IonicGlobal.domCtrl = DomController(window);

IonicGlobal.nextTickCtrl = NextTickController(window);

IonicGlobal.configCtrl = ConfigController(IonicGlobal.config || {});

const plt = PlatformClient(window, document, IonicGlobal, IonicGlobal.staticDir, IonicGlobal.domCtrl, IonicGlobal.nextTickCtrl);

const renderer = Renderer(plt);

registerComponentsES5(window, renderer, plt, IonicGlobal.configCtrl, IonicGlobal.components);
