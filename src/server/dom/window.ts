import { Console } from './console';
import { Document } from './document';
import { Location } from './location';
import { Navigator } from './navigator';
import { Performance } from './performance';
import { Storage } from './storage';
import fetch from 'node-fetch';
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;


export class Window {
  console: Console;
  document: Document;
  localStorage: Storage;
  sessionStorage: Storage;
  location: Location;
  navigator: Navigator;
  performance: Performance;
  fetch: any = fetch;
  XMLHttpRequest = XMLHttpRequest;


  constructor(url: string, referrer: string, userAgent: string, cookie: string) {
    this.console = new Console();
    this.location = new Location(url);
    this.navigator = new Navigator(userAgent);
    this.performance = new Performance();
    this.localStorage = new Storage();
    this.sessionStorage = new Storage();

    this.document = new Document();
    this.document.defaultView = this;
    this.document.location = this.location;
    this.document.cookie = cookie || '';
    this.document.referrer = referrer || '';
  }

  $parse(html: string): any {
    return this.document.$parse(html);
  }

  $serialize() {
    return this.document.$serialize();
  }

  $applyCss(css: string) {
    this.document.$applyCss(css);
  }

  $getAllSelectors() {
    return this.document.$getAllSelectors();
  }

  $destroy() {
    this.document.$destroy();
    this.console = this.document = this.localStorage = this.location = this.navigator = this.performance = null;
  }

  requestAnimationFrame(cb: Function) {
    return process.nextTick(() => {
      cb(this.performance.now());
    });
  }

  requestIdleCallback(cb: Function) {
    const start = this.performance.now();

    return process.nextTick(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => {
          return Math.max(0, 50 - (this.performance.now() - start));
        }
      });
    });
  }

  get screen() {
    return {};
  }

  cancelAnimationFrame() {}
  cancelIdleCallback() {}
  alert() {}
  confirm() {}
  prompt() {}
  print() {}
  postMessage() {}
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {}
  focus() {}
  blur() {}
}
