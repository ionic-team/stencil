import { IonicGlobal } from '../../../util/interfaces';
import { PlatformClient } from '../../../client/platform-client';
import { registerComponents } from '../../../client/registry';
import { Renderer } from '../../../client/renderer/core';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

const plt = PlatformClient(window, window.document, IonicGbl, IonicGbl.staticDir, IonicGbl.ConfigCtrl, IonicGbl.DomCtrl, IonicGbl.NextTickCtrl);

registerComponents(window, Renderer(plt), plt, IonicGbl.ConfigCtrl, IonicGbl.components);
