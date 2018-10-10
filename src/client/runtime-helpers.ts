

export function runtimeHelpers(win: any) {
  const nodeGlobals = ['process', 'Buffer'];

  nodeGlobals.forEach(nodeGlobal => {
    if (typeof win[nodeGlobal] === 'undefined') {
      Object.defineProperty(win, nodeGlobal, {
        get: () => {
          throw new Error(`The "${nodeGlobal}" property appears to be a node global, however, node globals cannot be executed from within a browser environment. The source of using a node global is often from a dependency and a common solution is to provide the "rollup-plugin-node-globals" plugin within the stencil config plugins. Please see the bundling docs for more information.`);
        },
        configurable: true
      });
    }
  });

}
