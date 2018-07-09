import * as d from '../../declarations';


export async function getStyleCache(compilerCtx: d.CompilerCtx, stylePath: string) {
  if (!compilerCtx.lastStyleInput.has(stylePath)) {
    // don't have the last style input, so don't even bother :(
    return null;
  }

  // let's see if we've even cached anything for this file path
  const styleText = compilerCtx.lastStyleOutput.get(stylePath);
  if (typeof styleText !== 'string') {
    // don't have the compiled style cached, so don't even bother :(
    return null;
  }

  // get what the current input is
  const currentStyleInput = await compilerCtx.fs.readFile(stylePath);

  // get what the last style input was
  const lastStyleInput = compilerCtx.lastStyleInput.get(stylePath);

  // compare our friends to see if style inputs changed
  if (currentStyleInput !== lastStyleInput) {
    // looks like the current style input is different than the last
    // which means we need to do a new compile on this style input
    return null;
  }

  // sweet, we've got a match! So the script file may have changed some code
  // but the actual styles in the script didn't change, so we're good here
  // use the style's cache
  return styleText;
}


export async function setStyleCache(compilerCtx: d.CompilerCtx, stylePath: string, compiledOutputText: string) {
  const currentStyleInput = await compilerCtx.fs.readFile(stylePath);
  compilerCtx.lastStyleInput.set(stylePath, currentStyleInput);

  compilerCtx.lastStyleOutput.set(stylePath, compiledOutputText);
}
