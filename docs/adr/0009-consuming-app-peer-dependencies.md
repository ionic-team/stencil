# 9. Consuming App Peer Dependencies

Date: 2021-08-25

## Status

historical

## Context

Stencil ships with multiple concepts that may not all be organized and available to customers. Stencil does not want to theoretically mandate certain tooling and bundle them into the Stencil compiler. These tools include, but are not limited to: Puppeteer and Jest. 

## Options

Historical

## Decision

For uninstalled peer dependencies, we fire an error when a `stencil` command which depends on a peer dependency is invoked. This gives consumers a la carte behavior around the tooling they can use. [ADR-5](./0005-repo-structure.md) helped us to mandate this behavior for consuming apps. 

## Consequences

- [This code sets up supported consumer peer dependencies and their versions](https://github.com/ionic-team/stencil/blob/c3f7f2ee1182b5eb78f5bc05603064c06b788480/src/sys/node/node-sys.ts#L586)). When we expand on the supported peer dependencies, we can expand on that array. 
- The function lazyRequire, which should be available on any given system, can be called throughout any process to provide a peer dependency warning prior to the task in question being run, [like here](https://github.com/ionic-team/stencil/blob/bf5f197910daab7f822a6e4c56f4f40a81c2ce7e/src/compiler/output-targets/output-service-workers.ts#L15), where workbox is required to help create service workers for a consuming application. 
- Users must install the deps themselves (and in the case of them using the starter repos, we could update the starters to run npm i for them)
- Although users are in control of the deps, they may not be compatible with their version of whatever lib they want to update (e.g. I doubt Stencil 1.X is compatible with Puppeteer 10)
- There's a smaller Stencil distributable size as a result of this decision

## Links

Code sets up supported consumer peer dependencies and their versions: [link](https://github.com/ionic-team/stencil/blob/master/src/sys/node/node-sys.ts#L586)
Example of a lazyRequire call on a node system: [link](https://github.com/ionic-team/stencil/blob/bf5f197910daab7f822a6e4c56f4f40a81c2ce7e/src/compiler/output-targets/output-service-workers.ts#L15)
