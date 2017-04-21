import { ConfigController } from '../../../client/config-controller';
import { DomController } from '../../../client/dom-controller';
import { IonicGlobal } from '../../../util/interfaces';
import { NextTickController } from '../../../client/next-tick-controller';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponents } from '../../../client/registry';
import { Renderer } from '../../../client/renderer/core';


const Ionic: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

const domCtrl = DomController(window);

const nextTickCtrl = NextTickController(window);

const plt = PlatformClient(window, document, Ionic, Ionic.staticDir, domCtrl, nextTickCtrl);

const renderer = Renderer(plt);

const configCtrl = ConfigController(Ionic.config || {});

registerComponents(window, renderer, plt, configCtrl, Ionic.components);
