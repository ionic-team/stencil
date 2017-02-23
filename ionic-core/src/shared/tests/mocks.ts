import { ComponentMeta, ComponentCompiledMeta } from '../interfaces';
const generateComponentMeta = require('../../../../ionic-transpiler/index');


export function compileComponent(cmpMeta: ComponentMeta): ComponentCompiledMeta {
  const code = generateComponentMeta(cmpMeta.tag, cmpMeta.template);
  const wrapper = `(function(){return ${code}})()`;
  return eval(wrapper);
}
