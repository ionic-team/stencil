import { Ionic } from '../../../util/interfaces';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponentsES5 } from '../../../client/registry.es5';
import { Renderer } from '../../../client/renderer/core';


const ionic: Ionic = (<any>window).Ionic = (<any>window).Ionic || {};

const plt = PlatformClient(window, document, ionic, ionic.staticDir, ionic.domCtrl, ionic.nextTickCtrl);
const renderer = Renderer(plt);


registerComponentsES5(renderer, plt, ionic.configCtrl, ionic.components);
