import * as d from '../../declarations';
import { applyComponentHostData } from '../render';


describe('applyConstructorHost', () => {

  let vnodeHostData: d.VNodeData;
  let hostMeta: d.ComponentConstructorHost;
  let instance: any;

  beforeEach(() => {
    vnodeHostData = {};
    hostMeta = {};
    instance = {};
  });

  it('add theme classes, w/ mode and color, no existing vnodeHostData', () => {
    vnodeHostData = undefined;
    instance.mode = 'ios';
    instance.color = 'secondary';
    hostMeta['theme'] = 'button';
    const data = applyComponentHostData(vnodeHostData, hostMeta, instance);
    expect(data).toEqual({
      'class': {
        'button': true,
        'button-ios': true,
        'button-ios-secondary': true,
        'button-secondary': true
      }
    });
  });

  it('add theme classes, w/ mode and color', () => {
    instance.mode = 'ios';
    instance.color = 'secondary';
    hostMeta['theme'] = 'button';
    const data = applyComponentHostData(vnodeHostData, hostMeta, instance);
    expect(data).toEqual({
      'class': {
        'button': true,
        'button-ios': true,
        'button-ios-secondary': true,
        'button-secondary': true
      }
    });
  });

  it('add theme classes, only mode, no color', () => {
    instance.mode = 'ios';
    hostMeta['theme'] = 'button';
    const data = applyComponentHostData(vnodeHostData, hostMeta, instance);
    expect(data).toEqual({
      'class': {
        'button': true,
        'button-ios': true
      }
    });
  });

  it('add theme classes, no mode or color', () => {
    hostMeta['theme'] = 'button';
    const data = applyComponentHostData(vnodeHostData, hostMeta, instance);
    expect(data).toEqual({
      'class': {
        'button': true
      }
    });
  });

  it('add multiple classes', () => {
    hostMeta['class'] = 'class-one class-two class-three';
    const data = applyComponentHostData(vnodeHostData, hostMeta, instance);
    expect(data).toEqual({
      'class': {
        'class-one': true,
        'class-two': true,
        'class-three': true
      }
    });
  });

  it('add class and attr', () => {
    hostMeta['class'] = 'css-class';
    hostMeta['aria-label'] = 'some label';
    const data = applyComponentHostData(vnodeHostData, hostMeta, instance);
    expect(data).toEqual({
      'class': {
        'css-class': true
      },
      'aria-label': 'some label'
    });
  });

  it('add attribute', () => {
    hostMeta['aria-label'] = 'some label';
    const data = applyComponentHostData(vnodeHostData, hostMeta, instance);
    expect(data).toEqual({
      'aria-label': 'some label'
    });
  });

  it('create vnodeHostData', () => {
    vnodeHostData = null;
    const data = applyComponentHostData(vnodeHostData, hostMeta, instance);
    expect(data).toBeDefined();
  });

});
