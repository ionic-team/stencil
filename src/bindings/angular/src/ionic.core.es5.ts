import { Ionic } from '../../../utils/interfaces';
import { PlatformClient } from '../../../platform/platform-client';
import { initRenderer } from '../../../renderer/core';
import { registerComponentsES5 } from '../../../registry/registry.es5';


const ionic: Ionic = (<any>window).Ionic = (<any>window).Ionic || {};

const plt = PlatformClient(window, document, ionic, ionic.staticDir, ionic.domCtrl, ionic.nextTickCtrl);
const renderer = initRenderer(plt);


registerComponentsES5(renderer, plt, ionic.configCtrl, ionic.components);
