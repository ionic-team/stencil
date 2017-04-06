import { PropOptions } from './interfaces';


export const Component: ComponentDecorator = function(opts?: ComponentOptions): (target: any) => any {
  return function() {opts;};
};


export interface ComponentDecorator {
  (opts?: ComponentOptions): any;
}


export interface ComponentOptions {
  tag: string;
  styleUrls: string[] | ModeStyles;
}

export interface ModeStyles {
  [modeName: string]: string | string[];
}


export const Prop: PropDecorator = function(opts?: PropOptions): (target: any, propKey: string) => any {
  return function() {opts;};
};


export interface PropDecorator {
  (opts?: PropOptions): any;
}
