import { ComponentMeta, IonicComponent, PropOptions } from './interfaces';


export const Component: ComponentDecorator = function(opts?: ComponentMeta): (target: any) => any {
  return function(target: IonicComponent) {
    if (opts) {
      const annotations = target.$annotations = target.$annotations || {};
      annotations.tag = opts.tag;
    }
  };
};


export interface ComponentDecorator {
  (opts?: ComponentMeta): any;
}


export const Prop: PropDecorator = function(opts?: PropOptions): (target: any, propKey: string) => any {
  return function(target: IonicComponent, propKey: string) {
    const annotations = target.$annotations = target.$annotations || {};
    annotations.props = annotations.props || {};
    annotations.props[propKey] = opts || {};

    annotations.obsAttrs = annotations.obsAttrs || [];
    annotations.obsAttrs.push(propKey);
  };
};


export interface PropDecorator {
  (opts?: PropOptions): any;
}
