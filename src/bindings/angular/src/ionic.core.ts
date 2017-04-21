import { IonicGlobal } from '../../../util/interfaces';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponents } from '../../../client/registry';
import { Renderer } from '../../../client/renderer/core';


const Ionic: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

// most of the controllers are added to window.Ionic within ionic-angular
const plt = PlatformClient(window, window.document, Ionic, Ionic.staticDir, Ionic.domCtrl, Ionic.nextTickCtrl);
const renderer = Renderer(plt);


registerComponents(window, renderer, plt, Ionic.configCtrl, Ionic.components);
