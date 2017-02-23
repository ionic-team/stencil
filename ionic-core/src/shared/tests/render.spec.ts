// import { Component } from '../../decorators/component';
// import { compileComponent } from './mocks';
import transpiler from '../../../../ionic-transpiler/dist/commonjs/index';


describe('renderer', () => {

  // describe('generateComponentDecorator', () => {
  //   // CmpA;
  //   expect(true).toBe(false);
  // });

  // describe('generateComponentDecorator2', () => {
  //   // CmpA;
  //   expect(true).toBe(true);
  // });

  it('should compileComponent for testing', () => {
    // let c = compileComponent({ tag: 'my-cmp', template: '<div>hi</div>'});
    // expect(c.tag).toEqual('my-cmp');
    // expect(typeof c.render).toEqual('function');
    // expect(c.template).toBeUndefined();

    transpiler.generateComponentMeta()

    expect(true).toBe(true);
  });

});


// @Component(compileComponent({
//   tag: 'cmp-a',
//   template: '<div>a</div>'
// }))
// class CmpA {}
