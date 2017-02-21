import { TranspileContext, TranspileOptions } from './interfaces';


export function generateTemplate(template: string, opts: TranspileOptions, ctx: TranspileContext) {
  template = transformIf(template);
  template = transformFor(template);
  return template;
}


export function transformIf(template: string) {
  template = template.replace(/\ \[if\]/g, ' v-if');

  return template;
}


export function transformFor(template: string) {
  template = template.replace(/\ \[for\]/g, ' v-for');

  return template;
}

