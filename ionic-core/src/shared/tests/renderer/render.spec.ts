import { Component } from '../../../decorators/component';
import { AppInitOptions, ComponentClass, ComponentMeta, ComponentCompiledMeta } from '../../interfaces';

const renderer = require('../../../../dist/commonjs/shared/renderer.js');
const jsdom = require('jsdom');
const transpiler = require('../../../../dist/commonjs/transpiler/index.js');

console.log = function(){};
console.info = function(){};

describe('renderer', () => {

  describe('createApp', () => {

    it('should create app on document', () => {
      createApp(RootApp, {
        components: [CmpA]
      });
    });

  });

  it('should compileComponent for testing', () => {
    let c = compileComponent({ tag: 'my-cmp', template: '<div>hi</div>'});
    expect(c.tag).toEqual('my-cmp');
    expect(typeof c.render).toEqual('function');
    expect(c.template).toBeUndefined();
  });

});


@Component(compileComponent({
  template: '<div></div>'
}))
class RootApp {}


@Component(compileComponent({
  tag: 'cmp-a',
  template: '<div>a</div>'
}))
class CmpA {}


function createApp(appRootCls: ComponentClass, opts: AppInitOptions) {
  let doc = jsdom.jsdom('<!doctype html><html><body><ion-app></ion-app></body></html>');
  let win = doc.defaultView;
  renderer.createApp(win, doc, appRootCls, opts);
  return doc;
}


function compileComponent(cmpMeta: ComponentMeta): ComponentCompiledMeta {
  const code = transpiler.generateComponentMeta(cmpMeta.tag, cmpMeta.template);
  const wrapper = `(function(){return ${code}})()`;
  return eval(wrapper);
}
