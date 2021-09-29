# 13. deno-removal

Date: 2021.09.16

## Status

accepted

## Context

Deno support in Stencil has always been marked as 'experimental'. Throughout the feature's lifespan, the current team
has run into some form of issue or another. For a concrete example of such an issue, see 
[0010-deno-vendoring.md](./0010-deno-vendoring.md).

The Stencil team revisited the capability and value associated with this functionality. The feature did not work in 
the latest version of Stencil, and the team has not been able to get any positive signal that this functionality is 
being used. 

## Decision

Deno shall be removed from the Stencil codebase. However, the `sys` interface shall remain.

Deno shall be removed from the Stencil site as a downloadable executable, and marked as having reached end of life.

## Consequences

The codebase may become easier to maintain.

It is possible the PR in which Deno is removed may leave behind artifacts from the Deno implementation. This includes,
but is not limited to:
- Implementation details that are a result of the system handling both the node and Deno runtimes
- Subtle breakages in the codebase in the event of global entities being mutated at build/runtime

## Links

- [0010-deno-vendoring.md](./0010-deno-vendoring.md)
- [Deno End of Life PR](https://github.com/ionic-team/stencil-site/pull/764)