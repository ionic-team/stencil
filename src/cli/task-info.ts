import type { CompilerSystem, Logger } from '../declarations';
import type { CoreCompiler } from './load-compiler';

export const taskInfo = (coreCompiler: CoreCompiler, sys: CompilerSystem, logger: Logger) => {
  const details = sys.details;
  const versions = coreCompiler.versions;

  console.log(``);
  console.log(`${logger.cyan('      System:')} ${sys.name} ${sys.version}`);
  console.log(`${logger.cyan('     Plaform:')} ${details.platform} (${details.release})`);
  console.log(
    `${logger.cyan('   CPU Model:')} ${details.cpuModel} (${sys.hardwareConcurrency} cpu${
      sys.hardwareConcurrency !== 1 ? 's' : ''
    })`,
  );
  console.log(`${logger.cyan('    Compiler:')} ${sys.getCompilerExecutingPath()}`);
  console.log(`${logger.cyan('       Build:')} ${coreCompiler.buildId}`);
  console.log(`${logger.cyan('     Stencil:')} ${coreCompiler.version}${logger.emoji(' ' + coreCompiler.vermoji)}`);
  console.log(`${logger.cyan('  TypeScript:')} ${versions.typescript}`);
  console.log(`${logger.cyan('      Rollup:')} ${versions.rollup}`);
  console.log(`${logger.cyan('      Parse5:')} ${versions.parse5}`);
  console.log(`${logger.cyan('      Sizzle:')} ${versions.sizzle}`);
  console.log(`${logger.cyan('      Terser:')} ${versions.terser}`);
  console.log(``);
};
