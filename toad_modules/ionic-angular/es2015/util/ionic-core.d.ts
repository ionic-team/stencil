import { Config } from '../config/config';
import { DomController } from '../platform/dom-controller';
import { NgZone } from '@angular/core';
import { Platform } from '../platform/platform';
/**
 * @hidden
 */
export declare function setupCore(config: Config, plt: Platform, domCtrl: DomController, zone: NgZone): () => {};
