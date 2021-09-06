# 5. Repo Structure

Date: 2021-08-06

## Status

historical

## Context

Building out the wide array of products, features, and functionality that Stencil offers can create a hard to explore repo of source code. Reusing well tested code is encouraged, and understanding where to place that code and it's responsibilities

## Options

1. Continue to develop a non-organized repo
2. Use Lerna as a monorepo dependency, where we can use and organize our code in a maintainable way that the software's opinion provides. 
3. Use Nx as a monorepo dependency, where we can use and organize our code in a maintainable way that the software's opinion provides. 
4. Use a sub-module organization, without a separate dependency, using TypeScript and Jest to map module names to sub-paths.

## Decision

We decided on #4, because mapping module names, though manually maintained, could help us organize our code and build without worrying about publishing and consuming separate packages. It also allows us to manually maintain the mapped modules. We can bundle all the built code as the code that's published on NPM as @stencil/core. 

## Consequences

We can now provide a module mapped as the `@utils` string to the code, as opposed to something that would need to be published, such as with Lerna. See [ADR-6 • Organizing Helper Methods](./0006-organizing-utility-functions.md).

## Links
Based off the information we learned from Adam in our first meeting. 