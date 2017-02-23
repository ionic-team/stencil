import { ComponentMeta, ComponentCompiledMeta } from '../shared/interfaces';
import * as transpiler from '../../dist/es2015/transpiler.js'


export function compileComponent(cmpMeta: ComponentMeta): ComponentCompiledMeta {
  const code = transpiler.generateComponentMeta(cmpMeta.tag, cmpMeta.template);
  const wrapper = `(function(){return ${code}})()`;
  return eval(wrapper);
}
