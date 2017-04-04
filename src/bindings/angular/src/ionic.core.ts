import { Ionic } from '../../../utils/interfaces';
import { PlatformClient } from '../../../platform/platform-client';
import { initRenderer } from '../../../renderer/core';
import { registerComponents } from '../../../registry/registry';


const ionic: Ionic = (<any>window).Ionic = (<any>window).Ionic || {};

// most of the controllers are added to window.Ionic within ionic-angular
const plt = PlatformClient(window, document, ionic, ionic.staticDir, ionic.domCtrl, ionic.nextTickCtrl);
const renderer = initRenderer(plt);


registerComponents(renderer, plt, ionic.configCtrl, ionic.components);
