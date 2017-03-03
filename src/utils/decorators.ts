import { $props, $obsAttrs } from './constants';
import { PropOptions } from './interfaces';


export const Prop: PropDecorator = function(opts?: PropOptions): (target: any, propKey: string) => any {
  return function(target: any, propKey: string) {
    target[$props] = target[$props] || {};
    target[$props][propKey] = opts || {};

    target[$obsAttrs] = target[$obsAttrs] || [];
    target[$obsAttrs].push(propKey);
  };
};


export interface PropDecorator {
  (opts?: PropOptions): any;
}

