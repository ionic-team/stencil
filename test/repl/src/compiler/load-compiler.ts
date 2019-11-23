import * as d from '@stencil/core/internal';
import { InputFile } from './declarations';
import { logDiagnostics } from './logger';


export const createCompiler = async (stencilCompilerPath: string) => {
  const stencil = await import(stencilCompilerPath);
  const compiler: d.WorkerCompiler = await stencil.createWorkerCompiler();
  return compiler;
}

export const initCompilerFs = async (compiler: d.WorkerCompiler, userInputs: InputFile[]) => {
  await compiler.sys.mkdir('/src');

  const inputs = [ ...userInputs ];

  if (!hasTsConfig(inputs)) {
    inputs.push({
      name: '/tsconfig.json',
      code: defaultTsConfig,
    });
  }

  await Promise.all(inputs.map(async input => (
    compiler.sys.writeFile(input.name, input.code)
  )));
}

export const loadConfig = async (compiler: d.WorkerCompiler, outputTarget: any) => {
  const diagnostics = await compiler.loadConfig({
    devMode: true,
    watch: true,
    outputTargets: [
      { type: outputTarget }
    ]
  });
  logDiagnostics(diagnostics);
}

const hasTsConfig = (inputs: InputFile[]) => {
  return inputs.some(({name}) => name === '/tsconfig.json');
};

const defaultTsConfig = `
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "lib": [
      "dom",
      "es2015"
    ],
    "module": "esnext",
    "target": "es2017",
    "jsx": "react",
    "jsxFactory": "h"
  },
  "include": [
    "src"
  ]
}
`;
