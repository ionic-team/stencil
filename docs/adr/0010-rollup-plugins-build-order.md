# 10. Rollup plugins build order

Date: 2021-08-25

## Status

historical

## Context

The order of rollup plugin execution during a build is not well documented as of 2021-08-25, nor why. The goal with this document is to clarify the order of the rollup plugins that get executed. It is also to provide further, though not perfect, clarity behind the purpose of each plugin and what it does, as well as where consumers can inject their rollup plugins. 

Rollup Plugins with only load functions can be called in parallel, however the plugins with transforms are called in sequence. 

## Options

N/A

## Decision

This ADR covers the order of the [bundle-output.ts file](../../src/compiler/bundle/bundle-output.ts), which is called after each component has been transpiled by TypeScript. Within this ADR's PR, Stencil now has documentation that covers the rollup plugin order during a build's bundling process.  


## Consequences

1. We transform .json, .svg, and other files types to become ES Modules for bundling. 
2. We provide a way for consumers to write web workers by processing the worker file imported with a `?worker` string. 
3. 

## Links

