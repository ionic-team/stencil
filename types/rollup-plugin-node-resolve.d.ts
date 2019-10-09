
declare module "rollup-plugin-node-resolve" {
  namespace rollupPluginNodeResolve {}
  function rollupPluginNodeResolve(opts?: any): {
    resolveId(id: string): Promise<{
      id: string;
    } | null | undefined>;
  };

  export = rollupPluginNodeResolve;
}
