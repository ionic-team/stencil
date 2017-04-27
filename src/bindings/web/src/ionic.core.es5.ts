import { ConfigController } from '../../../client/config-controller';
import { DomController } from '../../../client/dom-controller';
import { IonicGlobal } from '../../../util/interfaces';
import { NextTickController } from '../../../client/next-tick-controller';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponentsES5 } from '../../../client/registry.es5';
import { Renderer } from '../../../client/renderer/core';
import { detectPlatforms } from '../../../platform/platform-util';
import { PLATFORM_CONFIGS } from '../../../platform/platform-registry';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

IonicGbl.DomCtrl = DomController(window);

IonicGbl.NextTickCtrl = NextTickController(window);

IonicGbl.ConfigCtrl = ConfigController(IonicGbl.config, detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core'));

const plt = PlatformClient(window, window.document, IonicGbl, IonicGbl.NextTickCtrl);

registerComponentsES5(window, Renderer(plt), plt, IonicGbl.ConfigCtrl, IonicGbl.components);
