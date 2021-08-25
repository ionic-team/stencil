# 9. Consuming App Peer Dependencies

Date: 2021-08-25

## Status

historical

## Context

Stencil supports several features for development and building web components. In order to keep the distributable as small as possible, the Stencil compiler only bundles the tooling that is absolutely necessary to compile Stencil components. Additional functionality, such as testing, requires the consumer to manually install these packages.

Having peer dependencies of non-essential packages has an additional benefit of allowing end users to attempt to upgrade libraries themselves, rather than waiting for the Stencil team to release a new version of Stencil. Issues that consumers have during their upgrades can be reported via the team's issue tracker and help inform the team of potential upgrade pain points.

Theoretically, in the future, this provides a way for consumers to use other Stencil supported packages that may be a preference of the component author, such as puppeteer vs playwright.

## Options

N/A

## Decision

For uninstalled peer dependencies, Stencil emits error when a `stencil` command which depends on a peer dependency is invoked. This gives consumers à la carte behavior around the tooling they can use. [ADR-5](./0005-repo-structure.md) helped mandate this behavior for consuming apps. 

## Consequences

- [This code sets up supported consumer peer dependencies and their versions](https://github.com/ionic-team/stencil/blob/c3f7f2ee1182b5eb78f5bc05603064c06b788480/src/sys/node/node-sys.ts#L586)). When we expand on the supported peer dependencies, we can expand on that array. 
- There is also code within [task-test.ts](https://github.com/ionic-team/stencil/blob/c3f7f2ee1182b5eb78f5bc05603064c06b788480/src/cli/task-test.ts), which also checks to see if peer dependencies are installed prior to running the test task. 
- The function lazyRequire, which should be available on any given system, can be called throughout any process to provide a peer dependency warning prior to the task in question being run, [like here](https://github.com/ionic-team/stencil/blob/bf5f197910daab7f822a6e4c56f4f40a81c2ce7e/src/compiler/output-targets/output-service-workers.ts#L15), where workbox is required to help create service workers for a consuming application. 
- Users must install the deps themselves (and in the case of them using the starter repos, we could update the starters to run npm i for them)
- Although users are in control of the deps, they may not be compatible with their version of whatever lib they want to update (e.g. I doubt Stencil 1.X is compatible with Puppeteer 10)
- There's a smaller Stencil distributable size as a result of this decision

## Links

Code sets up supported consumer peer dependencies and their versions: [link](https://github.com/ionic-team/stencil/blob/c3f7f2ee1182b5eb78f5bc05603064c06b788480/src/sys/node/node-sys.ts#L586)
Example of a lazyRequire call on a node system: [link](https://github.com/ionic-team/stencil/blob/bf5f197910daab7f822a6e4c56f4f40a81c2ce7e/src/compiler/output-targets/output-service-workers.ts#L15)
