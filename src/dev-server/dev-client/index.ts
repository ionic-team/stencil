import * as d from '../../declarations';
import { initClient } from './init-client';

declare const win: d.DevClientWindow;
declare const doc: Document;
declare const config: d.DevClientConfig;

initClient(win, doc, config);
