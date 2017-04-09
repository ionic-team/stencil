import { Ionic } from '../../../util/interfaces';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponents } from '../../../client/registry';
import { Renderer } from '../../../renderer/core';


const ionic: Ionic = (<any>window).Ionic = (<any>window).Ionic || {};

// most of the controllers are added to window.Ionic within ionic-angular
const plt = PlatformClient(window, document, ionic, ionic.staticDir, ionic.domCtrl, ionic.nextTickCtrl);
const renderer = Renderer(plt);


registerComponents(renderer, plt, ionic.configCtrl, ionic.components);
