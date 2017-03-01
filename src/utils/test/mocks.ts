const jsdom = require('jsdom');


export function mockDocument(): HTMLDocument {
  return jsdom.jsdom('<!doctype html><html><body><ion-app></ion-app></body></html>');
}