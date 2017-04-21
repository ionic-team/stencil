import { IonicGlobal } from '../../../util/interfaces';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponentsES5 } from '../../../client/registry.es5';
import { Renderer } from '../../../client/renderer/core';


const Ionic: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};


const plt = PlatformClient(window, window.document, Ionic, Ionic.staticDir, Ionic.domCtrl, Ionic.nextTickCtrl);
const renderer = Renderer(plt);


registerComponentsES5(window, renderer, plt, Ionic.configCtrl, Ionic.components);
