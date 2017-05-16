import { ConfigController } from '../../../util/config-controller';
import { DomClient } from '../../../client/dom-client';
import { IonicGlobal } from '../../../util/interfaces';
import { PlatformClient } from '../../../client/platform-client';
import { QueueClient } from '../../../client/queue-client';
import { registerComponents } from '../../../client/registry';
import { Renderer } from '../../../client/renderer/core';
import { detectPlatforms } from '../../../platform/platform-util';
import { PLATFORM_CONFIGS } from '../../../platform/platform-registry';


const IonicGbl: IonicGlobal = (<any>window).Ionic = (<any>window).Ionic || {};

IonicGbl.DomCtrl = DomClient(window);

IonicGbl.QueueCtrl = QueueClient(window);

IonicGbl.ConfigCtrl = ConfigController(IonicGbl.config, detectPlatforms(window.location.href, window.navigator.userAgent, PLATFORM_CONFIGS, 'core'));

const plt = PlatformClient(window, window.document, IonicGbl, IonicGbl.QueueCtrl);

registerComponents(Renderer(plt), plt, IonicGbl.ConfigCtrl, IonicGbl.components);
