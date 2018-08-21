declare module "rollup-pluginutils" {
  namespace rollupPluginUtils {

    function createFilter(include: any, exclude: any): Function;

    function makeLegalIdentifier(key: string): string;

    function attachScopes(ast: any, scope: any): any;
  }


  export = rollupPluginUtils;
}

