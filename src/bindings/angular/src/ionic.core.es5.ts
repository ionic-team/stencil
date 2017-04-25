import { IonicGlobal } from '../../../util/interfaces';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponentsES5 } from '../../../client/registry.es5';
import { Renderer } from '../../../client/renderer/core';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};


const plt = PlatformClient(window, window.document, IonicGbl, IonicGbl.staticDir, IonicGbl.configCtrl, IonicGbl.domCtrl, IonicGbl.nextTickCtrl);
const renderer = Renderer(plt);


registerComponentsES5(window, renderer, plt, IonicGbl.configCtrl, IonicGbl.components);
