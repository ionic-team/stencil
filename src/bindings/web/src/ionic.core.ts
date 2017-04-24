import { ConfigController } from '../../../client/config-controller';
import { DomController } from '../../../client/dom-controller';
import { IonicGlobal } from '../../../util/interfaces';
import { NextTickController } from '../../../client/next-tick-controller';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponents } from '../../../client/registry';
import { Renderer } from '../../../client/renderer/core';


const IonicGlobal: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

IonicGlobal.domCtrl = DomController(window);

IonicGlobal.nextTickCtrl = NextTickController(window);

IonicGlobal.configCtrl = ConfigController(IonicGlobal.config || {});

const plt = PlatformClient(window, window.document, IonicGlobal, IonicGlobal.staticDir, IonicGlobal.domCtrl, IonicGlobal.nextTickCtrl);

const renderer = Renderer(plt);

registerComponents(window, renderer, plt, IonicGlobal.configCtrl, IonicGlobal.components);
