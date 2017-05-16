import { IonicGlobal } from '../../../util/interfaces';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponentsES5 } from '../../../client/registry.es5';
import { Renderer } from '../../../client/renderer/core';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

const plt = PlatformClient(window, window.document, IonicGbl, IonicGbl.QueueCtrl);

registerComponentsES5(Renderer(plt), plt, IonicGbl.ConfigCtrl, IonicGbl.components);
