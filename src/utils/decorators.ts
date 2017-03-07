import { $annotations } from './constants';
import { Annotations, ComponentOptions, PropOptions } from './interfaces';


export const Component: ComponentDecorator = function(opts?: ComponentOptions): (target: any) => any {
  return function(target: any) {
    if (opts) {
      const annotations: Annotations = target[$annotations] = target[$annotations] || {};
      annotations.tag = opts.tag;
      annotations.styleUrl = opts.styleUrl;
    }
  };
};


export interface ComponentDecorator {
  (opts?: ComponentOptions): any;
}


export const Prop: PropDecorator = function(opts?: PropOptions): (target: any, propKey: string) => any {
  return function(target: any, propKey: string) {
    const annotations: Annotations = target[$annotations] = target[$annotations] || {};
    annotations.props = annotations.props || {};
    annotations.props[propKey] = opts || {};

    annotations.obsAttrs = annotations.obsAttrs || [];
    annotations.obsAttrs.push(propKey);
  };
};


export interface PropDecorator {
  (opts?: PropOptions): any;
}
