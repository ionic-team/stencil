
export type CSSVariables = {[prop: string]: string};
export type CSSEval = (p: CSSVariables) => string;
export type CSSSegment = string | CSSEval;
export type CSSTemplate = CSSSegment[];

export interface CSSSelector {
  nu: number;
  selector: string;
  specificity: number;
  declarations: Declaration[];
}

export interface Declaration {
  prop: string;
  value: CSSTemplate;
  important: boolean;
}

export interface CSSScope {
  original: string;

  cssScopeId?: string;

  selectors: CSSSelector[];
  template: CSSTemplate;
  isDynamic: boolean;
  styleEl?: HTMLStyleElement;
}
