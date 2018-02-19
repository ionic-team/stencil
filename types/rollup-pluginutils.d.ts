declare module "rollup-pluginutils" {
  namespace rollupPluginUtils {

    function createFilter(include: any, exclude: any): Function;

    function makeLegalIdentifier(key: string): string;
  }


  export = rollupPluginUtils;
}

