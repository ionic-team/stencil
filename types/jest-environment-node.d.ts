
declare module "jest-environment-node" {
  class NodeEnvironment {
    constructor(config: any);

    teardown(): any;
  }

  export = NodeEnvironment;
}
