import { ConfigController } from '../../../client/config-controller';
import { DomController } from '../../../client/dom-controller';
import { IonicGlobal } from '../../../util/interfaces';
import { NextTickController } from '../../../client/next-tick-controller';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponentsES5 } from '../../../client/registry.es5';
import { Renderer } from '../../../client/renderer/core';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

IonicGbl.domCtrl = DomController(window);

IonicGbl.nextTickCtrl = NextTickController(window);

IonicGbl.configCtrl = ConfigController(IonicGbl.config || {});

const plt = PlatformClient(window, window.document, IonicGbl, IonicGbl.staticDir, IonicGbl.configCtrl, IonicGbl.domCtrl, IonicGbl.nextTickCtrl);

const renderer = Renderer(plt);

registerComponentsES5(window, renderer, plt, IonicGbl.configCtrl, IonicGbl.components);
