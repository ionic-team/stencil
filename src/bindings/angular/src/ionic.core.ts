import { IonicGlobal } from '../../../util/interfaces';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponents } from '../../../client/registry';
import { Renderer } from '../../../client/renderer/core';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

// most of the controllers are added to window.Ionic within ionic-angular
const plt = PlatformClient(window, window.document, IonicGbl, IonicGbl.staticDir, IonicGbl.configCtrl, IonicGbl.domCtrl, IonicGbl.nextTickCtrl);
const renderer = Renderer(plt);


registerComponents(window, renderer, plt, IonicGbl.configCtrl, IonicGbl.components);
