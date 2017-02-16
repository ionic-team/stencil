
import * as compiler from './build';


export function compile(template: string, opts?: any) {
  return compiler.compile(template, opts);
}
