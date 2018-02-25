import { CompilerCtx, Config, FsWriteResults } from '../../declarations';
import { isDtsFile, isJsFile, normalizePath } from '../util';
import * as ts from 'typescript';


export function getTsHost(config: Config, ctx: CompilerCtx, writeQueue: Promise<FsWriteResults>[], tsCompilerOptions: ts.CompilerOptions) {
  const tsHost = ts.createCompilerHost(tsCompilerOptions);

  tsHost.directoryExists = (dirPath) => {
    dirPath = normalizePath(dirPath);

    try {
      const stat = ctx.fs.statSync(dirPath);

      return stat && stat.isDirectory;
    } catch (e) {
      return false;
    }
  };

  tsHost.getSourceFile = (filePath) => {
    filePath = normalizePath(filePath);
    let tsSourceFile: ts.SourceFile = null;

    try {
      let content = ctx.fs.readFileSync(filePath);
      if (isDtsFile(filePath)) {
        if (content.includes('namespace JSX {') && !content.includes('StencilJSX')) {
          // we currently have what seems to be an unsolvable problem where any third-party
          // package can provide their own global JSX types, while stencil also
          // provides them as a global in order for typescript to understand and use JSX
          // types. So we're renaming any "other" imported global JSX namespaces so there
          // are no collisions with the same global JSX interfaces stencil already has
          // we're totally up for better ideas  ¯\_(ツ)_/¯
          content = content.replace('namespace JSX {', `namespace JSX_NO_COLLISION_${Math.round(Math.random() * 99999999)} {`);

          config.logger.debug(`renamed global JSX namespace collision: ${filePath}`);
        }
      }

      tsSourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.ES2015);

    } catch (e) {
      config.logger.error(`tsHost.getSourceFile unable to find: ${filePath}`, e);
    }

    return tsSourceFile;
  };

  tsHost.fileExists = (filePath) => {
    return ctx.fs.accessSync(filePath);
  },

  tsHost.readFile = (filePath) => {
    let sourceText: string = null;
    try {
      sourceText = ctx.fs.readFileSync(filePath);
    } catch (e) {}

    return sourceText;
  },

  tsHost.writeFile = (outputFilePath: string, outputText: string, _writeByteOrderMark: boolean, _onError: any, sourceFiles: ts.SourceFile[]): void => {
    sourceFiles.forEach(sourceFile => {
      writeQueue.push(writeFileInMemory(config, ctx, sourceFile, outputFilePath, outputText));
    });
  };

  return tsHost;
}


function writeFileInMemory(config: Config, ctx: CompilerCtx, sourceFile: ts.SourceFile, distFilePath: string, outputText: string) {
  let tsFilePath = normalizePath(sourceFile.fileName);

  if (!config.sys.path.isAbsolute(tsFilePath)) {
    tsFilePath = normalizePath(config.sys.path.join(config.rootDir, tsFilePath));
  }

  distFilePath = normalizePath(distFilePath);

  // if this build is also building a distribution then we
  // actually want to eventually write the files to disk
  // otherwise we still want to put these files in our file system but
  // only as in-memory files and never are actually written to disk
  const isInMemoryOnly = !config.generateDistribution;

  // get or create the ctx module file object
  if (!ctx.moduleFiles[tsFilePath]) {
    // we don't have this module in the ctx yet
    ctx.moduleFiles[tsFilePath] = {};
  }

  // figure out which file type this is
  if (isJsFile(distFilePath)) {
    // transpiled file is a js file
    ctx.moduleFiles[tsFilePath].jsFilePath = distFilePath;

  } else if (isDtsFile(distFilePath)) {
    // transpiled file is a .d.ts file
    ctx.moduleFiles[tsFilePath].dtsFilePath = distFilePath;

  } else {
    // idk, this shouldn't happen
    config.logger.debug(`unknown transpiled output: ${distFilePath}`);
  }

  // let's write the beast to our internal in-memory file system
  // the distFilePath is only written to disk when a distribution
  // is being created. But if we're not generating a distribution
  // like just a website, we still need to write it to our file system
  // so it can be read later, but it only needs to be in memory
  return ctx.fs.writeFile(distFilePath, outputText, { inMemoryOnly: isInMemoryOnly });
}
